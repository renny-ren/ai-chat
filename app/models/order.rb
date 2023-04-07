class Order < ApplicationRecord
  belongs_to :user
  belongs_to :owner, polymorphic: true

  enum status: { pending: 0, paid: 1, closed: 2, fulfilled: 3 }

  after_create :schedule_close_order

  def complete!
    return unless paid?

    HandleAfterChargeOrderService.new(self).call
  end

  # https://opendocs.alipay.com/apis/009zid#%E8%A7%A6%E5%8F%91%E9%80%9A%E7%9F%A5%E7%A4%BA%E4%BE%8B
  # 支付宝预下单请求生成的二维码有效期为 2 小时
  def schedule_close_order
    ClosePendingOrderJob.set(wait: 2.hours).perform_later(self.id)
  end
end
