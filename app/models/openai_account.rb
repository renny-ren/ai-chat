class OpenaiAccount < ApplicationRecord
  belongs_to :user, optional: true

  enum status: { active: 0, expired: 1 }

  scope :engaged, -> { where.not(user_id: nil) }

  validates :secret_key, presence: true, uniqueness: true
end
