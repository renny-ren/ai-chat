class Order < ApplicationRecord
  belongs_to :user
  belongs_to :owner, polymorphic: true

  enum status: { pending: 0, paid: 1, closed: 2, fulfilled: 3 }

  after_create :schedule_close_order

  def complete!
    return unless paid?

    plan = self.owner
    ActiveRecord::Base.transaction do
      if user.active_subscription.present?
        subscription = user.active_subscription
        subscription.update!(
          membership_plan_id: plan.id,
          end_at: subscription.end_at + (plan.duration).days,
        )
        user.update!(membership: plan.name)
      else
        MembershipSubscription.create!(
          user_id: user_id,
          membership_plan_id: plan.id,
          start_at: Time.now,
          end_at: Time.now + (plan.duration).days,
        )
        openai_account = OpenaiAccount.find_by(user_id: nil)
        user.update!(membership: plan.name, openai_account: openai_account)
      end
      fulfilled!
    end
  end

  # https://opendocs.alipay.com/apis/009zid#%E8%A7%A6%E5%8F%91%E9%80%9A%E7%9F%A5%E7%A4%BA%E4%BE%8B
  # 支付宝预下单请求生成的二维码有效期为 2 小时
  def schedule_close_order
    ClosePendingOrderJob.set(wait: 2.hours).perform_later(self.id)
  end
end
