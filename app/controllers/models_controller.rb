class ModelsController < ApplicationController
  include PaginationParams

  before_action :set_models, only: :index
  before_action :set_model, only: :show
  before_action :validate_model, only: :show

  def index
  end

  def show
  end

  def create
    model = current_user.models.new(model_params)
    if model.valid?
      model.save!
      render_json_response :ok
    else
      render_json_response :error, message: model.errors.full_messages
    end
  rescue => e
    render_json_response :error, message: e.message
  end

  private

  def authenticate_user!
    warden.authenticate!
  end

  def set_models
    if params[:scope] == "self"
      @models = current_user.models
    else
      @models = Model.visible.includes(:user)
    end
    @models = @models.page(page).per(per)
  end

  def model_params
    params.permit(:title, :description, :introduction, :permalink, :system_instruction, :is_public, :avatar, :voice)
  end

  def set_model
    @model = Model.find_by(permalink: params[:permalink])
  end

  def validate_model
    if @model.nil?
      return render_json_response :error, error_code: 1001, message: "No model found"
    end

    if !@model.is_public && @model.user != current_user
      return render_json_response :error, error_code: 1002, message: "This is a private model"
    end
  end
end
