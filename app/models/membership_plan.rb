class MembershipPlan < ApplicationRecord
  has_many :orders, as: :owner
  has_many :subscriptions, class_name: "MembershipSubscription"
end
