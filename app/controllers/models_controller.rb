class ModelsController < ApplicationController
  include PaginationParams

  before_action :set_models, only: :index
  before_action :set_model, only: :show

  def index
  end

  def show
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
    params.permit(:title, :description, :introduction, :permalink, :system_instruction, :is_public, :avatar)
  end

  def set_model
    @model = Model.find_by(permalink: params[:permalink])
  end
end
