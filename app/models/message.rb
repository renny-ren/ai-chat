class Message < ApplicationRecord
  belongs_to :user

  delegate :nickname, to: :user, prefix: true
end
