# Auto generate with notifications gem.
class Notification < ActiveRecord::Base
  include Notifications::Model

  scope :important, -> {
      joins("INNER JOIN app_messages on app_messages.id = notifications.target_id AND notifications.target_type = 'AppMessage'")
        .where(app_messages: { is_important: true })
    }
end
