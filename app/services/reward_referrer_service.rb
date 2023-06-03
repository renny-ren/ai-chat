class RewardReferrerService
  attr_reader :referrer

  def initialize(referrer)
    @referrer = referrer
  end

  def call
    subscription = referrer.active_subscription
    return if subscription.nil?

    subscription.update!(end_at: subscription.end_at + 5.days)
  rescue Exception => e
    App::Error.track(e)
  end
end
