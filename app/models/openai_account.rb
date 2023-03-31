class OpenaiAccount < ApplicationRecord
  belongs_to :user, optional: true

  scope :engaged, -> { where.not(user_id: nil) }
end
