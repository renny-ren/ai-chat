class Conversation < ApplicationRecord
  self.inheritance_column = :_type
  belongs_to :user
  has_many :messages, dependent: :destroy
end
