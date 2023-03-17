class OrdersController < ApplicationController
  before_action :authenticate_user!

  def show
    @order = Order.find(params[:id])
    render status: 401, json: { message: "Unauthorized" } if @order.user_id != current_user.id
  end

  def create
    plan = MembershipPlan.find_by(name: params[:name])
    if plan.present?
      @order = current_user.orders.pending.find_by(owner: plan)
      @order = create_new_order(plan) if @order.nil?
      render_json_response :ok, id: @order.id, qr_code_url: @order.data.dig("qr_code_url")
      # render_json_response :ok, trade_no: "202303171620545090", qr_code_url: "https://qr.alipay.com/bax08311ig2okdd4zow72533"
      # render_json_response :ok, id: Order.last.id, qr_code_url: "https://qr.alipay.com/bax08311ig2okdd4zow72533"
    else
      render_json_response :error, message: "Invalid plan"
    end
  rescue => e
    render_json_response :error, message: e.message
  end

  private

  def create_new_order(plan)
    Order.transaction do
      alipay_resp = precreate_alipay_trade(plan)
      current_user.orders.create!(
        owner: plan,
        amount: plan.amount,
        data: { out_trade_no: alipay_resp[:out_trade_no], qr_code_url: alipay_resp[:qr_code_url] },
      )
    end
  end

  def order_params
    params.permit(:email, :username, :nickname, :password, :password_confirmation)
  end

  def authenticate_user!
    warden.authenticate!
  end

  def precreate_alipay_trade(plan)
    AlipayTrade::PrecreateService.new(plan).call
  end
end
