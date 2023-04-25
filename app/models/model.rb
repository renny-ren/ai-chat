class Model < ApplicationRecord
  belongs_to :user
  has_many :conversations

  delegate :nickname, to: :user, prefix: true

  has_one_attached :avatar, dependent: :purge

  validates :permalink, presence: true, uniqueness: true, length: 1..16
  validates_presence_of :title, :description, :system_instruction
end
