Rails.application.routes.draw do
  mount ActionCable.server => "/cable"

  authenticate :user, ->(u) { u.admin? } do
    mount ExceptionTrack::Engine => "/exception-track"
  end

  devise_for :users, controllers: {
                       registrations: :registrations,
                       sessions: :sessions,
                     }

  root "homepage#index"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  scope "v1" do
    resources :completions, only: :create do
      get "live_stream", on: :collection
    end
    resources :messages, only: :index
    resources :users, only: [:update, :show] do
      post :clear_conversations, on: :collection
    end
    resources :sponsorships, only: :index
    resources :conversations, only: [:index, :show, :update, :destroy]
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
  end

  scope "webhooks" do
    post "alipay" => "webhooks#alipay"
  end
  get "/*path" => "homepage#index", format: false, constraints: ->(req) { !req.xhr? && req.format.html? }
  # get "/settings" => "homepage#index"
  # mount ActiveStorage::Engine => "/active_storage"
end
