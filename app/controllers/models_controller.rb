class ModelsController < ApplicationController
  include PaginationParams

  before_action :set_models, only: :index

  def index
  end

  def create
    current_user.models.create!(model_params)
    render_json_response :ok
  rescue => e
    render_json_response :error, message: e.message
  end

  private

  def authenticate_user!
    warden.authenticate!
  end

  def set_models
    @models = Model.includes(:user).page(page).per(per)
  end

  def model_params
    params.permit(:title, :description, :introduction, :permalink, :system_instruction, :is_public)
  end
end
