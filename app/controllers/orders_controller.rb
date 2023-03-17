class OrdersController < ApplicationController
  before_action :authenticate_user!
  skip_before_action :authenticate_user!, only: :notify

  def show
    @order = Order.find(params[:id])
    render status: 401, json: { message: "Unauthorized" } if @order.user_id != current_user.id
  end

  def create
    plan = MembershipPlan.find_by(name: params[:plan_name])
    if plan.present?
      Order.transaction do
        response = precreate_alipay_trade
        order = current_user.orders.create!(
          owner: plan,
          amount: plan.amount,
          data: { out_trade_no: response.out_trade_no },
        )
      end
    end
    render_json_response :ok, data: { trade_no: response.out_trade_no, qr_code_url: response.qr_code_url }
  rescue => e
    render_json_response :error, message: e.message
  end

  # This endpoint is a callback endpoint, so it doesn't have authentication.
  def notify
    order = Order.find_by("data ->> 'out_trade_no' = ?", params[:out_trade_no])
    order.fullfill! if order.present?
  end

  private

  def order_params
    params.permit(:email, :username, :nickname, :password, :password_confirmation)
  end

  def authenticate_user!
    warden.authenticate!
  end

  def precreate_alipay_trade
    AlipayTrade::PrecreateService.new(plan).call
  end
end
