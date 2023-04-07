class GenerateAiResponseJob < ApplicationJob
  include ActiveJob::Locking::Serialized

  queue_as :default

  self.enqueue_time = 1

  # Ensures that only one instance of GenerateAiResponseJob can be running at a time.
  # With this approach, if the job is already running when a new instance is enqueued, the new instance
  # will not be processed until the previous one completes.
  def lock_key(*args)
    self.class.name
  end

  def perform(id)
    message = Message.find(id)

    params = {
      # model: "text-davinci-003",
      model: "gpt-3.5-turbo",
      messages: message.user.ai_conversation_history << { role: "user", content: message.content.sub("@#{User.gpt_user[:nickname]} ", "") },
      max_tokens: 500,
      temperature: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: true,
    }
    if can_chat?
      ChatCompletion::CreateService.new(message, params).call
    end
  end

  private

  def can_chat?
    true
  end
end
