module Image
  class GenerateService
    attr_reader :current_user, :params

    def initialize(current_user, params)
      @current_user = current_user
      @params = params
    end

    def call
      res = client.images.generate(params)
      JSON.parse(res.body)
    rescue Exception => e
      App::Error.track(e)
    end

    private

    def client
      @client ||= OpenAI::Client.new(current_user.openai_account&.secret_key || OPENAI_API_KEY)
    end
  end
end
