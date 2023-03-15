Rails.application.routes.draw do
  mount ActionCable.server => "/cable"

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
    resources :conversations, only: [:index, :destroy]
  end
  get "/*path" => "homepage#index", format: false, constraints: ->(req) { !req.xhr? && req.format.html? }
  # get "/settings" => "homepage#index"
  # mount ActiveStorage::Engine => "/active_storage"
end
