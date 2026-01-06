Rails.application.routes.draw do
  root "stories#index"

  resources :stories do
    resources :critiques, only: %i[create destroy]
  end

  namespace :api do
    post "auth/register", to: "auth#register"
    post "auth/login", to: "auth#login"
    get "auth/me", to: "auth#me"

    match "auth/:provider/callback", to: "oauth_callbacks#callback", via: %i[get post]
    match "auth/failure", to: "oauth_callbacks#failure", via: %i[get post]

    resources :tags, only: %i[index]
    resources :stories, only: %i[index show create] do
      collection do
        get :random
      end
      resources :critiques, only: %i[create destroy]
    end
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

end
