class WebhooksController < ApplicationController
  skip_before_action :verify_authenticity_token, only: :alipay

  # This endpoint is a callback endpoint, so it doesn't have authentication.
  def alipay
    case params["trade_status"]
    when "TRADE_SUCCESS"
      order = Order.find_by("data ->> 'out_trade_no' = ?", params["out_trade_no"])
      if order.present? && order.pending?
        order.paid!
        order.complete!
      end
    else
    end
    render status: 200, json: nil
  rescue Exception => e
    App::Error.track(e, title: "Alipay webhook exception", body: params.to_s)
  end

  # Example params:
  # def params
  #   {"gmt_create"=>"2023-03-17 19:37:10", "charset"=>"GBK", "seller_email"=>"xxxxx@163.com", "subject"=>"����������", "sign"=>"aadpxb9+vk4mbNtBcs", "buyer_id"=>"2088242607716403", "invoice_amount"=>"0.10", "notify_id"=>"2023031701222193715016401451768604", "fund_bill_list"=>"[{\"amount\":\"0.10\",\"fundChannel\":\"ALIPAYACCOUNT\"}]", "notify_type"=>"trade_status_sync", "trade_status"=>"TRADE_SUCCESS", "receipt_amount"=>"0.10", "buyer_pay_amount"=>"0.10", "app_id"=>"2021003183611229", "sign_type"=>"RSA2", "seller_id"=>"2088512307220473", "gmt_payment"=>"2023-03-17 19:37:15", "notify_time"=>"2023-03-17 19:37:16", "version"=>"1.0", "out_trade_no"=>"202303171937084778", "total_amount"=>"0.10", "trade_no"=>"2023031722001416401452269303", "auth_app_id"=>"2021003183611229", "buyer_logon_id"=>"182****2340", "point_amount"=>"0.00"}
  # end
end
