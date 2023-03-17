class AlipayTradesController < ApplicationController
  before_action :authenticate_user!

  def precreate
    response = AlipayTrade::PrecreateService.new.call
  end

  private

  def authenticate_user!
    warden.authenticate!
  end
end
