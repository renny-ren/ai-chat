class MembershipSubscriptionsController < ApplicationController
  include PaginationParams

  before_action :authenticate_user!
  before_action :set_subscriptions, only: :index

  def index
  end

  private

  def authenticate_user!
    warden.authenticate!
  end

  def set_subscriptions
    @subscriptions = current_user.membership_subscriptions.order(created_at: :desc)
  end
end
