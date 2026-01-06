module Api
  class BaseController < ActionController::API
    private

    def current_user
      return @current_user if defined?(@current_user)

      token = request.headers["Authorization"].to_s.sub(/^Bearer\s+/i, "").strip
      payload = JsonWebToken.decode(token)
      @current_user = payload ? User.find_by(id: payload[:user_id]) : nil
    end

    def authenticate!
      render json: { error: "인증이 필요해요." }, status: :unauthorized unless current_user
    end
  end
end

