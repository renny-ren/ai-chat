class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :validatable,:timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :trackable,
         :recoverable, :rememberable, :validatable

  validates_uniqueness_of :nickname, :username

  def avatar_url(size = 80)
    "https://ui-avatars.com/api/?name=#{username}&size=#{size}"
  end

  # def find_for_database_authentication(warden_conditions)
  #   conditions = warden_conditions.dup
  #   login = conditions.delete(:login)
  #   where(conditions).where(["lower(username) = :value OR lower(email) = :value", { value: login.strip.downcase }]).first
  # end

  protected

  def email_required?
    false
  end

  def email_changed?
    false
  end
end
