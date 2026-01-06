require "omniauth-oauth2"

module OmniAuth
  module Strategies
    class Google < OmniAuth::Strategies::OAuth2
      option :name, "google"

      option :client_options,
             site: "https://accounts.google.com",
             authorize_url: "/o/oauth2/v2/auth",
             token_url: "/o/oauth2/token"

      option :authorize_options, %i[scope prompt access_type]
      option :scope, "openid email profile"
      option :prompt, "select_account"
      option :access_type, "online"

      uid { raw_info["sub"] }

      info do
        {
          email: raw_info["email"],
          name: raw_info["name"]
        }
      end

      def raw_info
        @raw_info ||= access_token.get("https://openidconnect.googleapis.com/v1/userinfo").parsed
      end
    end
  end
end

