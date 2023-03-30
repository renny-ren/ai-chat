module OpenAi
  class CheckCreditService
    attr_reader :secret_key

    def initialize(secret_key)
      @secret_key = secret_key
    end

    def call
      res = Faraday.get("https://api.openai.com/dashboard/billing/credit_grants", nil, headers)
      JSON.parse(res.body)
    end

    private

    def headers
      {
        "Authorization" => "Bearer #{secret_key}",
      }
    end
  end
end
