class Message < ApplicationRecord
  # include ActionController::Live

  GPT_USER_ID = 13.freeze

  belongs_to :user
  has_many :replies, class_name: "::Message", foreign_key: :parent_id, dependent: :destroy
  belongs_to :parent, class_name: "::Message", foreign_key: :parent_id, optional: true

  delegate :nickname, to: :user, prefix: true
  delegate :avatar_url, to: :user, prefix: true

  after_commit :generate_response, on: :create, if: :mentioned_ai?

  # scope :to_ai, -> { where("mentioned_user_ids @> ?", GPT_USER_ID) }
  scope :to_ai, -> { where("? = ANY(mentioned_user_ids)", GPT_USER_ID) }

  def generate_response
    params = {
      model: "text-davinci-003",
      max_tokens: 100,
      temperature: 0.6,
      frequency_penalty: 0,
      presence_penalty: 0,
      prompt: build_session_prompt,
      stream: true,
    }
    conn = Faraday.new(
      url: "https://api.openai.com",
      params: params,
      headers: headers,
    )
    @result = { text: "", detail: {}, is_first_chunk: true }

    conn.post("/v1/completions") do |req|
      req.body = params.to_json
      req.options.on_data = Proc.new do |chunk, overall_received_bytes, env|
        puts "Received #{overall_received_bytes} characters"
        data = chunk[/data: (.*)\n\n/, 1]

        if data == "[DONE]"
          # TODO: close connection
          mentioned_users = User.where(id: self.user_id)
          message = Message.create!(
            content: @result[:text],
            user_id: robot_user.id,
            mentioned_user_ids: mentioned_users.ids,
          )
        else
          @result = build_result(data)
          # text = JSON.parse(chunk[/data: (.*)\n\n/, 1]).dig("choices", 0, "text").strip
          ActionCable.server.broadcast("MessagesChannel", {
            id: JSON.parse(chunk[/data: (.*)\n\n/, 1]).dig("id"),
            content: @result[:text],
            is_first_chunk: @result[:is_first_chunk],
            user_id: robot_user.id,
            user_nickname: "GPT 机器人",
            user_avatar_url: "",
            mentioned_users_nickname: ["renny"],
          })
          @result[:is_first_chunk] = false
        end
      end
    end
  end

  def build_result(data)
    response = JSON.parse(data)
    if response.dig("choices", 0, "text")
      @result[:text] = @result[:text] + response.dig("choices", 0, "text")
      @result[:detail] = response
    end
    @result
  end

  # def generate_response
  #   client = OpenAI::Client.new(OPENAI_API_KEY)
  #   res = client.create_completion(
  #     model: "text-davinci-003",
  #     max_tokens: 1000,
  #     temperature: 0.6,
  #     frequency_penalty: 0,
  #     presence_penalty: 0,
  #     prompt: build_session_prompt,
  #     stream: true,
  #   )
  #   response = JSON.parse(res.body)

  #   Message.transaction do
  #     mentioned_users = User.where(id: self.user_id)
  #     message = Message.create!(
  #       content: response.dig("choices", 0, "text").strip,
  #       user_id: robot_user.id,
  #       mentioned_user_ids: mentioned_users.ids,
  #     )
  #     ActionCable.server.broadcast("MessagesChannel", {
  #       content: message.content,
  #       user_id: message.user_id,
  #       user_nickname: message.user_nickname,
  #       user_avatar_url: message.user_avatar_url,
  #       mentioned_users_nickname: mentioned_users.map(&:nickname),
  #     })
  #   end
  # end

  def mentioned_users_nickname
    id_nickname_array = Rails.cache.fetch("id_nickname_array", expires_in: 30.seconds) do
      User.all.pluck(:id, :nickname)
    end
    id_nickname_array.select { |item| mentioned_user_ids.include?(item[0]) }.map { |item| item[1] }
    # User.where(id: self.mentioned_user_ids).map(&:nickname)
  end

  def as_item_json
    as_json(only: %i[content user_id], methods: %i[user_nickname user_avatar_url mentioned_users_nickname], include: { user: { only: [:nickname, :id] } })
  end

  private

  def headers
    {
      "Content-Type" => "application/json",
      "Authorization" => "Bearer #{OPENAI_API_KEY}",
    }
  end

  def robot_user
    User.find(GPT_USER_ID)
  end

  def mentioned_ai?
    self.mentioned_user_ids.include?(robot_user.id)
  end

  def build_session_prompt
    "Instructions:\nYou are ChatGPT, a large language model trained by OpenAI. Current date: 2023-03-01\n\nUser:\n\n#{self.content}\n\nChatGPT:\n"
    # messages = current_user.messages.to_ai.last(10)
    # prompt = conf().get("character_desc", "")
    # if prompt:
    #     prompt += "\n\n"
    # session = user_session.get(user_id, None)
    # if session:
    #     for conversation in session:
    #         prompt += "Q: " + conversation["question"] + "\n\n\nA: " + conversation["answer"] + "<|im_end|>\n"
    #     prompt += "Q: " + query + "\nA: "
    #     return prompt
    # else:
    #     return prompt + "Q: " + query + "\nA: "
  end
end
