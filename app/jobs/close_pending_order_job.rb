class ClosePendingOrderJob < ApplicationJob
  queue_as :default

  # https://opendocs.alipay.com/apis/009zid#%E8%A7%A6%E5%8F%91%E9%80%9A%E7%9F%A5%E7%A4%BA%E4%BE%8B
  # 支付宝预下单请求生成的二维码有效期为 2 小时，本 Job 及时将 pending order 过期，以创建新订单、生成新的二维码
  def perform
    orders = Order.pending
    orders.find_each do |order|
      order.closed!
    end
  end
end
