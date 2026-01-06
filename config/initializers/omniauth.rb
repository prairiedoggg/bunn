require Rails.root.join("app/lib/omniauth/strategies/google")
require Rails.root.join("app/lib/omniauth/strategies/apple")
require Rails.root.join("app/lib/omniauth/strategies/naver")
require Rails.root.join("app/lib/omniauth/strategies/kakao")

OmniAuth.config.logger = Rails.logger
OmniAuth.config.allowed_request_methods = %i[get post]
OmniAuth.config.path_prefix = "/api/auth"

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google, ENV["GOOGLE_CLIENT_ID"], ENV["GOOGLE_CLIENT_SECRET"]
  provider :apple, ENV["APPLE_CLIENT_ID"], ENV["APPLE_CLIENT_SECRET"]
  provider :naver, ENV["NAVER_CLIENT_ID"], ENV["NAVER_CLIENT_SECRET"]
  provider :kakao, ENV["KAKAO_CLIENT_ID"], ENV["KAKAO_CLIENT_SECRET"]
end

