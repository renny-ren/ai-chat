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
  has_many :notifications
  has_many :models
  has_one :active_subscription, -> { active }, class_name: "MembershipSubscription"
  has_one :openai_account
  belongs_to :referrer, class_name: "User", foreign_key: :referrer_id, optional: true

  has_one_attached :avatar, dependent: :purge
  has_many_attached :images, dependent: :purge

  validates :username, presence: true, uniqueness: true, length: 3..16
  validates :nickname, presence: true, uniqueness: true, length: 1..16
  validates_format_of :username, with: /^[a-zA-Z0-9_\.]*$/, multiline: true # Only allow letter, number, underscore and punctuation.
  validates :email, uniqueness: true, allow_blank: true, format: { with: URI::MailTo::EMAIL_REGEXP, message: "email is not valid" }
  validate :validate_referrer_id

  enum membership: { free: 0, basic: 1, standard: 2, advanced: 3 }

  after_create :send_welcome_notification
  after_create :apply_affiliation, if: :referrer_id?
  after_update :purge_avatar_cache

  action_store :like, :model, counter_cache: true
  action_store :star, :model, counter_cache: true

  def avatar_url(size = 80)
    # ActiveStorage::Current.url_options = { host: "localhost", port: 3000 }
    Rails.cache.fetch("user_#{id}_avatar_url", expires_in: 2.hours) do
      avatar.url || "user_avatar/?name=#{nickname}&size=#{size}"
    end
  end

  def avatar=(new_avatar)
    avatar.purge_later if new_avatar.present?
    super
  end

  def purge_avatar_cache
    Rails.cache.delete("user_#{id}_avatar_url")
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

  def conversation_cache_key
    "user_#{id}_conversations"
  end

  def used_count_cache_key
    "used_count:user_#{id}"
  end

  def image_count_cache_key
    "used_image_count:user_#{id}"
  end

  def used_message_count(ip)
    @used_message_count ||= [
      Rails.cache.read(used_count_cache_key).to_i,
      Rails.cache.read("used_count:ip_#{ip}").to_i,
    ].max
  end

  def update_used_count(ip)
    updated_count = used_message_count(ip) + 1
    Rails.cache.write(used_count_cache_key, updated_count, expires_at: Time.now.end_of_day)
    Rails.cache.write("used_count:ip_#{ip}", updated_count, expires_at: Time.now.end_of_day)
  end

  # TODO: use redis to store this
  def update_image_count(count)
    Rails.cache.write(image_count_cache_key, count)
  end

  def image_count
    Rails.cache.read(image_count_cache_key).to_i
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

  def send_welcome_notification
    message = AppMessage.welcome.first
    Notification.create(
      notify_type: message.msg_type,
      target: message,
      user_id: id,
    )
  end

  def apply_affiliation
    UpgradeMembershipService.new(self, "basic").call
  end

  private

  def initial_messages
    [
      { role: "system", content: "You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible. Current date: #{Date.today.to_s}" },
    ]
  end

  def validate_referrer_id
    if referrer_id.present? && referrer.nil?
      errors.add(:invite_code, "无效")
    end
  end

  protected

  def email_required?
    false
  end

  def email_changed?
    false
  end
end
