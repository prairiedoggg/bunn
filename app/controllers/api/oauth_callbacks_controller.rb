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

      token = JsonWebToken.encode({ user_id: user.id })
      redirect_to success_redirect_url(token, return_to: request.env.dig("omniauth.params", "return_to"))
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

    def success_redirect_url(token, return_to:)
      target = normalize_return_to(return_to) || frontend_url
      # 토큰을 query에 싣지 않기 위해 fragment로 전달(서버 로그/프록시 로그에 덜 남음)
      "#{target}#token=#{CGI.escape(token)}"
    end

    def failure_redirect_url(code)
      "#{frontend_url}/login?error=#{CGI.escape(code)}"
    end

    def normalize_return_to(value)
      url = value.to_s.strip
      return nil if url.blank?

      # 모바일(Expo) 개발 딥링크(exp://...) 또는 커스텀 스킴(mun://...) 허용
      return url if url.start_with?("exp://", "mun://")

      # 웹 프론트만 허용
      return url if url.start_with?(frontend_url)

      nil
    end
  end
end

