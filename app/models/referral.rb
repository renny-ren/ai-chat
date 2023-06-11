# "referral" represents the action of inviting, whereas "invitee" represents the user who is being invited.
class Referral < ApplicationRecord
  belongs_to :referrer, class_name: "User"
  belongs_to :invitee, class_name: "User"

  enum status: { registered: 0, paid: 1 }
end
