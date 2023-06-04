Rails.application.routes.draw do
  ActiveAdmin.routes(self)
  mount ActionCable.server => "/cable"

  authenticate :user, ->(u) { u.admin? } do
    mount ExceptionTrack::Engine => "/exception-track"
    mount AuditLog::Engine => "/audit-log"
  end

  devise_for :users, controllers: {
                       registrations: :registrations,
                       sessions: :sessions,
                     }, sign_out_via: [:delete, :get]

  root "homepage#index"
  get "/user_avatar", to: "images#user_avatar"

  scope "v1" do
    resources :completions, only: :create do
      get "live_stream", on: :collection
    end
    resources :messages, only: :index do
      post "check_words", on: :collection
    end
    resources :users, only: [:update, :show] do
      collection do
        post :clear_conversations
        get :fake_name
      end
      member do
        get :images
      end
    end
    resources :sponsorships, only: :index
    resources :conversations, only: [:index, :show, :update, :destroy] do
      delete :clear, on: :collection
    end
    resources :orders, only: [:show, :create]
    resources :membership_subscriptions, only: [:index]
    scope "images" do
      post "generations" => "images#generations"
    end
    namespace :notifications do
      resources :notifications, only: :index, path: "" do
        collection do
          delete :clean
          post :read
          get :unread_count
        end
      end
    end
    resources :app_messages, except: [:new, :edit] do
      member do
        post :push
      end
    end
    resources :models, except: [:new, :edit], param: :permalink do
      member do
        post :like
        post :star
        post :unlike
        post :unstar
      end
    end
  end

  namespace :admin do
    resources :users, only: :index do
      resources :messages, only: :index
    end
  end

  scope "webhooks" do
    post "alipay" => "webhooks#alipay"
  end
  get "/*path" => "homepage#index", format: false, constraints: ->(req) { !req.xhr? && req.format.html? }
  # get "/settings" => "homepage#index"
  # mount ActiveStorage::Engine => "/active_storage"
end
