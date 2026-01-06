require "omniauth-oauth2"

module OmniAuth
  module Strategies
    class Naver < OmniAuth::Strategies::OAuth2
      option :name, "naver"

      option :client_options,
             site: "https://nid.naver.com",
             authorize_url: "/oauth2.0/authorize",
             token_url: "/oauth2.0/token"

      option :authorize_options, %i[state]

      uid { response_info["id"] }

      info do
        {
          email: response_info["email"],
          name: response_info["name"] || response_info["nickname"]
        }
      end

      def raw_info
        @raw_info ||= access_token.get("https://openapi.naver.com/v1/nid/me").parsed
      end

      def response_info
        raw_info["response"] || {}
      end
    end
  end
end

