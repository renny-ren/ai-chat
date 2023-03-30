class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :validatable,:timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :trackable,
         :recoverable, :rememberable, :validatable

  has_many :messages
  has_many :sponsorships
  has_many :conversations
  has_many :orders
  has_many :membership_subscriptions
  has_one :active_subscription, -> { active }, class_name: "MembershipSubscription"
  has_one :openai_account

  has_one_attached :avatar, dependent: :purge

  validates :username, presence: true, uniqueness: true, length: 3..16
  validates :nickname, presence: true, uniqueness: true, length: 1..16
  validates_format_of :username, with: /^[a-zA-Z0-9_\.]*$/, multiline: true # Only allow letter, number, underscore and punctuation.
  validates :email, uniqueness: true, allow_blank: true, format: { with: URI::MailTo::EMAIL_REGEXP, message: "email is not valid" }

  enum membership: { free: 0, basic: 1, advanced: 2 }

  def avatar_url(size = 80)
    # ActiveStorage::Current.url_options = { host: "localhost", port: 3000 }
    Rails.cache.fetch("user_#{id}_avatar_url", expires_in: 10.minutes) do
      avatar.url || "https://ui-avatars.com/api/?name=#{nickname}&size=#{size}"
    end
  end

  def avatar=(new_avatar)
    avatar.purge_later if new_avatar.present?
    super
  end

  # def find_for_database_authentication(warden_conditions)
  #   conditions = warden_conditions.dup
  #   login = conditions.delete(:login)
  #   where(conditions).where(["lower(username) = :value OR lower(email) = :value", { value: login.strip.downcase }]).first
  # end

  def frontend_attributes
    {
      id: self.id,
      nickname: self.nickname,
      email: self.email,
      config: self.config,
      avatar_url: self.avatar_url,
      membership: self.membership,
      membership_name: self.membership_name,
      plan: YAML.load_file(Rails.root.join("config", "membership_plans.yml")).dig(self.membership),
    }
  end

  def ai_conversation_history
    Rails.cache.fetch(conversation_cache_key, expires_in: 1.day) do
      initial_messages
    end
  end

  def cut_ai_conversation_history
    updated_history = ai_conversation_history
    until updated_history.to_s.size < 4000
      updated_history.slice!(1, 2) # Removes 2 elements starting from index 1 (the second and third elements)
    end
    Rails.cache.write(conversation_cache_key, updated_history, expires_in: 1.day)
  end

  def update_history(role:, content:)
    updated_history = ai_conversation_history << { role: role, content: content }
    if updated_history.size > 20
      updated_history.slice!(1, 2)
    end
    Rails.cache.write(conversation_cache_key, updated_history, expires_in: 1.day)
  end

  def conversation_cache_key
    "user_#{id}_conversations"
  end

  def used_count_cache_key
    "used_count:user_#{id}"
  end

  def admin?
    self.is_admin
  end

  def self.gpt_user
    Rails.cache.fetch("gpt_user", expires_in: 1.day) do
      gpt_user = User.find(GPT_USER_ID)
      { nickname: gpt_user.nickname, avatar_url: gpt_user.avatar_url }
    end
  end

  private

  def initial_messages
    [
      { role: "system", content: "You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible. Current date: #{Date.today.to_s}" },
    ]
  end

  protected

  def email_required?
    false
  end

  def email_changed?
    false
  end
end
