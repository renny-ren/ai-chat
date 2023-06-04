class RewardReferrerService
  attr_reader :referrer, :invitee

  def initialize(user)
    @referrer = user.referrer
    @invitee = user
  end

  def call
    extend_subscription
    update_referral
  rescue Exception => e
    App::Error.track(e)
  end

  private

  def extend_subscription
    subscription = referrer.active_subscription
    return if subscription.nil?

    subscription.update!(end_at: subscription.end_at + 5.days)
  end

  def update_referral
    referral = Referral.find_by(invitee_id: invitee.id, referrer_id: referrer.id)
    referral.paid! if referral.present?
  end
end
