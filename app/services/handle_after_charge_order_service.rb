class HandleAfterChargeOrderService
  attr_reader :order, :user, :plan

  def initialize(order)
    @order = order
    @user = order.user
    @plan = order.owner
  end

  def call
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
        openai_account = OpenaiAccount.find_by(user_id: nil)
        user.update!(membership: plan.name, openai_account: openai_account)
      end
      order.fulfilled!
    end
    grant_image_count
  rescue Exception => e
    App::Error.track(e)
  end

  private

  def grant_image_count
    image_count = YAML.load_file(Rails.root.join("config", "membership_plans.yml")).dig(@plan.name, "image_count")
    @user.update_image_count(@user.image_count + image_count)
  end
end
