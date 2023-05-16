module AlipayTrade
  class PrecreateService
    attr_reader :client, :plan, :out_trade_no

    def initialize(plan)
      @plan = plan
      @client = Alipay::Client.new(
        url: "https://openapi.alipay.com/gateway.do",
        # url: Rails.application.credentials.alipay.gateway_url,
        app_id: Rails.application.credentials.alipay.app_id,
        app_private_key: Rails.application.credentials.alipay.app_private_key,
        alipay_public_key: Rails.application.credentials.alipay.alipay_public_key,
        charset: "utf-8",
      )
      @out_trade_no = "#{Time.now.strftime("%Y%m%d%H%M%S%L")}#{SecureRandom.rand(9)}"
    end

    def call
      response = client.execute(
        method: "alipay.trade.precreate",
        notify_url: "https://aiichat.cn/webhooks/alipay",
        biz_content: JSON.generate({
          out_trade_no: out_trade_no,
          total_amount: plan.amount,
          subject: plan.description,
        }, ascii_only: true),
      )
      { out_trade_no: out_trade_no, qr_code_url: JSON.parse(response).dig("alipay_trade_precreate_response", "qr_code") }
    end
  end
end
