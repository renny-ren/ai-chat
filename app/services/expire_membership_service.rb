class ExpireMembershipService
  attr_reader :subscription, :user

  def initialize(subscription)
    @subscription = subscription
    @user = subscription.user
  end

  def call
    revoke_image_count
    user.update!(membership: "free", openai_account: nil)
    subscription.expired!
  end

  private

  def revoke_image_count
    user.update_image_count([user.image_count - plan_image_count, 0].max)
  end

  def plan_image_count
    YAML.load_file(Rails.root.join("config", "membership_plans.yml")).dig(user.membership, "image_count")
  end
end
