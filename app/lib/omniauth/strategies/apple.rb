require "omniauth-oauth2"

module OmniAuth
  module Strategies
    class Apple < OmniAuth::Strategies::OAuth2
      option :name, "apple"

      option :client_options,
             site: "https://appleid.apple.com",
             authorize_url: "/auth/authorize",
             token_url: "/auth/token"

      option :authorize_options, %i[scope response_mode]
      option :scope, "name email"
      option :response_mode, "form_post"

      uid { raw_info["sub"] }

      info do
        {
          email: raw_info["email"],
          name: raw_info["name"]
        }
      end

      # Apple은 id_token(JWT)에 기본 정보가 들어갑니다.
      def raw_info
        @raw_info ||= begin
          id_token = access_token.params["id_token"].to_s
          segments = id_token.split(".")
          payload = segments[1]
          json = Base64.urlsafe_decode64(payload + "=" * ((4 - payload.size % 4) % 4))
          JSON.parse(json)
        rescue StandardError
          {}
        end
      end
    end
  end
end

