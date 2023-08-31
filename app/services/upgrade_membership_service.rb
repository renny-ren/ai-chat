class UpgradeMembershipService
  attr_reader :user, :plan

  def initialize(user, plan_name)
    @user = user
    @plan = MembershipPlan.find_by(name: plan_name)
  end

  def call
    return if plan.nil?

    ActiveRecord::Base.transaction do
      if user.active_subscription.present?
        subscription = user.active_subscription
        subscription.update!(
          membership_plan_id: plan.id,
          end_at: subscription.end_at + (plan.duration).days,
        )
        user.update!(membership: plan.name)
      else
        user.membership_subscriptions.create!(
          membership_plan_id: plan.id,
          start_at: Time.now,
          end_at: Time.now + (plan.duration).days,
        )
        openai_account = OpenaiAccount.active.find_by(user_id: nil)
        user.update!(membership: plan.name, openai_account: openai_account)
      end
    end
  rescue Exception => e
    App::Error.track(e)
  end
end
