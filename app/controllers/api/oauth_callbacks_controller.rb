module Api
  class OauthCallbacksController < BaseController
    def callback
      auth = request.env["omniauth.auth"]
      return redirect_to failure_redirect_url("oauth_auth_missing") if auth.blank?

      provider = auth["provider"].to_s
      uid = auth["uid"].to_s
      info = auth["info"] || {}

      user = User.find_or_initialize_by(provider: provider, uid: uid)
      user.email = info["email"] if user.email.blank? && info["email"].present?
      user.name = info["name"] if user.name.blank? && info["name"].present?
      user.save!

      token = JsonWebToken.encode(user_id: user.id)
      redirect_to success_redirect_url(token)
    rescue StandardError
      redirect_to failure_redirect_url("oauth_failed")
    end

    def failure
      redirect_to failure_redirect_url("oauth_denied")
    end

    private

    def frontend_url
      ENV.fetch("FRONTEND_URL", "http://localhost:3001")
    end

    def success_redirect_url(token)
      # 토큰을 query에 싣지 않기 위해 fragment로 전달(서버 로그/프록시 로그에 덜 남음)
      "#{frontend_url}/auth/callback#token=#{CGI.escape(token)}"
    end

    def failure_redirect_url(code)
      "#{frontend_url}/login?error=#{CGI.escape(code)}"
    end
  end
end

