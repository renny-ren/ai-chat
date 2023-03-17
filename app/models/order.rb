class Order < ApplicationRecord
  belongs_to :user
  belongs_to :owner, polymorphic: true

  enum status: { pending: 0, paid: 1, closed: 2 }

  def fullfill!
    plan = self.owner
    ActiveRecord::Base.transaction do
      subscription = MembershipSubscription.create!(
        user_id: user_id,
        membership_plan_id: plan.id,
        start_at: Time.now,
        end_at: Time.now + (plan.duration).days,
      )
      user.update!(membership: plan.name)
    end
  end
end
