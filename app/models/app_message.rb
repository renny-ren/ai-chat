class AppMessage < ApplicationRecord
  validates_presence_of :title, :body

  enum msg_type: { product: 0, operation: 1, other: 2 }
  enum status: { draft: 0, published: 1 }

  belongs_to :creator, class_name: "User", required: false
  belongs_to :updater, class_name: "User", required: false

  scope :important, -> { where("is_important = ?", true) }
end
