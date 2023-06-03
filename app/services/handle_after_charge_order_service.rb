class HandleAfterChargeOrderService
  attr_reader :order, :user, :plan

  def initialize(order)
    @order = order
    @user = order.user
    @plan = order.owner
  end

  def call
    ActiveRecord::Base.transaction do
      UpgradeMembershipService.new(user, plan.name).call
      RewardReferrerService.new(user.referrer).call if user.referrer.present?
      order.fulfilled!
    end
    grant_image_count
  rescue Exception => e
    App::Error.track(e)
  end

  private

  def grant_image_count
    image_count = YAML.load_file(Rails.root.join("config", "membership_plans.yml")).dig(@plan.name, "image_count")
    @user.update_image_count(@user.image_count + image_count)
  end
end
