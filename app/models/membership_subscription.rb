class MembershipSubscription < ApplicationRecord
  belongs_to :membership_plan
  belongs_to :user

  enum status: { active: 0, expired: 1 }
end
