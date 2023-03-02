class Message < ApplicationRecord
  # include ActionController::Live

  GPT_USER_ID = 13.freeze

  belongs_to :user
  has_many :replies, class_name: "::Message", foreign_key: :parent_id, dependent: :destroy
  belongs_to :parent, class_name: "::Message", foreign_key: :parent_id, optional: true

  delegate :nickname, to: :user, prefix: true
  delegate :avatar_url, to: :user, prefix: true

  after_commit :generate_ai_response, on: :create, if: :mentioned_ai?

  # scope :to_ai, -> { where("mentioned_user_ids @> ?", GPT_USER_ID) }
  scope :to_ai, -> { where("? = ANY(mentioned_user_ids)", GPT_USER_ID) }

  def update_conversation_history
    update_history(role: "user", content: self.content)
  end

  def generate_ai_response
    update_conversation_history
    params = {
      # model: "text-davinci-003",
      model: "gpt-3.5-turbo",
      messages: conversation_history,
      max_tokens: 500,
      temperature: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: true,
    }
    conn = Faraday.new(
      url: "https://api.openai.com",
      params: params,
      headers: headers,
    )
    @result = { text: "", detail: {}, is_first_chunk: true }
    mentioned_users = User.where(id: self.user_id)

    conn.post("/v1/chat/completions") do |req|
      req.body = params.to_json
      req.options.on_data = Proc.new do |chunk, overall_received_bytes, env|
        puts "Received #{overall_received_bytes} characters"
        puts "---chunk: #{chunk}"
        puts "===data: #{chunk[/data: (.*)\n\n$/, 1]}"
        data = chunk[/data: (.*)\n\n$/, 1]
        response = JSON.parse(data)

        if data == "[DONE]"
          # TODO: close connection
          signal_done(response)
          Message.transaction do
            message = Message.create!(
              content: @result[:text],
              user_id: robot_user.id,
              mentioned_user_ids: mentioned_users.ids,
            )
            update_history(role: "assistant", content: message.content)
          end
        else
          @result = build_result(response)
          ActionCable.server.broadcast("MessagesChannel", {
            id: response.dig("id"),
            done: false,
            content: @result[:text],
            is_first_chunk: @result[:is_first_chunk],
            user_id: robot_user.id,
            user_nickname: "GPT robot",
            user_avatar_url: robot_user.avatar_url,
            mentioned_users_nickname: mentioned_users.map(&:nickname),
          })
          @result[:is_first_chunk] = false
        end
      end
    end
  end

  def signal_done(response)
    ActionCable.server.broadcast("MessagesChannel", {
      id: response.dig("id"),
      done: true,
    })
  end

  def build_result(response)
    if response.dig("choices", 0, "delta", "content")
      @result[:text] = @result[:text] + response.dig("choices", 0, "delta", "content")
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

  def conversation_cache_key
    "user_#{self.user_id}_conversations"
  end

  def headers
    {
      "Content-Type" => "application/json",
      "Authorization" => "Bearer #{OPENAI_API_KEY}",
    }
  end

  def initial_messages
    [
      { role: "system", content: "You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible. Current date: #{Date.today.to_s}" },
    ]
  end

  def robot_user
    @robot_user ||= User.find(GPT_USER_ID)
  end

  def mentioned_ai?
    self.mentioned_user_ids.include?(robot_user.id)
  end

  def conversation_history
    Rails.cache.fetch(conversation_cache_key, expires_in: 1.day) do
      initial_messages
    end
  end

  def update_history(role:, content:)
    updated_history = conversation_history << { role: role, content: content }
    if updated_history.size > 20
      updated_history.delete_at(1)
      updated_history.delete_at(2)
    end
    Rails.cache.write(conversation_cache_key, updated_history, expires_in: 1.day)
  end
end
