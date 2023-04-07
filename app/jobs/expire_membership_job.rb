class ExpireMembershipJob < ApplicationJob
  queue_as :default

  # TODO: move this to a service
  def perform
    subscriptions = MembershipSubscription.active.where("end_at <= ?", DateTime.now)
    subscriptions.find_each do |subscription|
      user = subscription.user
      revoke_image_count(user)
      user.update!(membership: "free", openai_account: nil)
      subscription.expired!
    end
  end

  private

  def revoke_image_count(user)
    image_count = YAML.load_file(Rails.root.join("config", "membership_plans.yml")).dig(user.membership, "image_count")
    user.update_image_count([user.image_count - image_count, 0].max)
  end
end
