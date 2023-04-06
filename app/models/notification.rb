# Auto generate with notifications gem.
class Notification < ActiveRecord::Base
  include Notifications::Model

  belongs_to :app_message, -> { where(notifications: { target_type: "AppMessage" }) }, foreign_key: "target_id"

  scope :important, -> { joins(:app_message).where(app_messages: { is_important: true }) }
end
