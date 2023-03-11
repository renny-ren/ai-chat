module ChatCompletion
  class CreateService
    attr_reader :params

    def initialize(params)
      @params = {
        model: "gpt-3.5-turbo",
        messages: conversation_history,
        max_tokens: 500,
        temperature: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: true,
      }
    end

    def call
    end

    private

    def headers
      {
        "Content-Type" => "application/json",
        "Authorization" => "Bearer #{OPENAI_API_KEY}",
      }
    end
  end
end
