require "omniauth-oauth2"

module OmniAuth
  module Strategies
    class Kakao < OmniAuth::Strategies::OAuth2
      option :name, "kakao"

      option :client_options,
             site: "https://kauth.kakao.com",
             authorize_url: "/oauth/authorize",
             token_url: "/oauth/token"

      option :authorize_options, %i[scope]
      option :scope, "profile_nickname account_email"

      uid { raw_info["id"].to_s }

      info do
        account = raw_info["kakao_account"] || {}
        profile = account["profile"] || {}
        {
          email: account["email"],
          name: profile["nickname"]
        }
      end

      def raw_info
        @raw_info ||= access_token.get("https://kapi.kakao.com/v2/user/me").parsed
      end
    end
  end
end

