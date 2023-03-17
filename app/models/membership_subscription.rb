class MembershipSubscription < ApplicationRecord
  belongs_to :membership_plan

  enum status: { active: 0, expired: 1 }
end
