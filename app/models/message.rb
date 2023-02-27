class Message < ApplicationRecord
  belongs_to :user

  delegate :nickname, to: :user, prefix: true
  delegate :avatar_url, to: :user, prefix: true
end
