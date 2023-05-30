class ExpireMembershipJob < ApplicationJob
  queue_as :default

  def perform
    subscriptions = MembershipSubscription.active.where("end_at <= ?", DateTime.now)
    subscriptions.find_each do |subscription|
      ExpireMembershipService.new(subscription).call
    end
  end
end
