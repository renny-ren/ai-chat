class GenerateAiResponseJob < ApplicationJob
  queue_as :default

  def perform(id)
    message = Message.find(id)

    params = {
      # model: "text-davinci-003",
      model: "gpt-3.5-turbo",
      messages: message.ai_conversation_history,
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
