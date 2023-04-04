module AppMessage
  class PushService
    attr_reader :message

    def initialize(message)
      @message = message
    end

    def call
      user_ids = message.user_ids.present? ? message.user_ids : User.all.ids
      ActiveRecord::Base.transaction do
        user_ids.each do |user_id|
          Notification.create(
            notify_type: message.msg_type,
            target: message,
            user_id: user_id,
          )
        end
        @message.published!
      end
    end
  end
end
