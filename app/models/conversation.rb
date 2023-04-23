class Conversation < ApplicationRecord
  self.inheritance_column = :_type
  belongs_to :user
  has_many :messages, dependent: :destroy

  enum type: { chatgpt: 0, fortune: 1, developer: 2, mj_prompt: 3, girlfriend: 4 }
end
