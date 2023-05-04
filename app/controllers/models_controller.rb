class ModelsController < ApplicationController
  include PaginationParams

  before_action :set_models, only: :index
  before_action :set_model, only: [:show, :like, :unlike, :star, :unstar, :update, :destroy]
  before_action :validate_model, only: :show
  before_action :authenticate_user!, only: [:update, :destroy]

  def index
  end

  def show
  end

  def create
    warden.authenticate!
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

  def update
    @model.update!(model_params)
    render_json_response :ok
  rescue => e
    render_json_response :error, message: e.message
  end

  def destroy
    @model.destroy!
    render_json_response :ok
  rescue => e
    render_json_response :error, message: e.message
  end

  def like
    current_user.like_model(@model)
  end

  def unlike
    current_user.unlike_model(@model)
  end

  def star
    current_user.star_model(@model)
  end

  def unstar
    current_user.unstar_model(@model)
  end

  private

  def authenticate_user!
    warden.authenticate!
    if @model.user != current_user
      render status: 401, json: { message: "Unauthorized" }
    end
  end

  def set_models
    if params[:scope] == "self"
      @models = current_user.models
    elsif params[:scope] == "starred"
      @models = current_user.star_models
    else
      @models = Model.visible.includes(:user)
    end
    @models = @models.order("likes_count desc, created_at asc").page(page).per(per)
  end

  def model_params
    params.permit(:title, :description, :introduction, :permalink, :system_instruction, :is_public, :avatar, :voice, :input_placeholder, :openai_params)
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
