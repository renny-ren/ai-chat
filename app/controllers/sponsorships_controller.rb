class SponsorshipsController < ApplicationController
  # before_action :authenticate_user!
  before_action :set_resources, only: :index

  def index
  end

  private

  def authenticate_user!
    warden.authenticate!
  end

  def set_resources
    @sponsorships = Sponsorship.includes(:user).all
  end
end