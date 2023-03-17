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

  has_one_attached :avatar, dependent: :purge

  validates :username, presence: true, uniqueness: true, length: 3..16
  validates :nickname, presence: true, uniqueness: true, length: 1..16
  validates_format_of :username, with: /^[a-zA-Z0-9_\.]*$/, multiline: true # Only allow letter, number, underscore and punctuation.
  validates :email, uniqueness: true, allow_blank: true, format: { with: URI::MailTo::EMAIL_REGEXP, message: "email is not valid" }

  enum membership: { free: 0, basic: 1, advanced: 2 }

  def avatar_url(size = 80)
    # ActiveStorage::Current.url_options = { host: "localhost", port: 3000 }
    avatar.url || "https://ui-avatars.com/api/?name=#{nickname}&size=#{size}"
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
    }
  end

  def ai_conversations
    Rails.cache.read(conversation_cache_key)
  end

  def conversation_cache_key
    "user_#{id}_conversations"
  end

  def used_count_cache_key
    "used_count:user_#{id}"
  end

  protected

  def email_required?
    false
  end

  def email_changed?
    false
  end
end
