class MembershipSubscription < ApplicationRecord
  belongs_to :plan, class_name: "MembershipPlan", foreign_key: :membership_plan_id
  belongs_to :user

  enum status: { active: 0, expired: 1 }
end
