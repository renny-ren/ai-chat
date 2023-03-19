class ExpireMembershipJob < ApplicationJob
  queue_as :default

  def perform
    subscriptions = MembershipSubscription.active.where("end_at <= ?", DateTime.now)
    subscriptions.find_each do |subscription|
      subscription.user.update!(membership: "free", openai_account: nil)
      subscription.expired!
    end
  end
end
