module Api
  class AuthController < BaseController
    before_action :authenticate!, only: :me

    def register
      email = params[:email].to_s
      password = params[:password].to_s

      if email.strip.blank? || password.blank?
        return render json: { errors: ["이메일과 비밀번호가 필요해요."] }, status: :unprocessable_entity
      end

      user = User.new(email: email, password: password, name: params[:name])
      if user.save
        render json: { token: JsonWebToken.encode(user_id: user.id), user: user_json(user) }, status: :created
      else
        render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def login
      email = params[:email].to_s.strip.downcase
      password = params[:password].to_s

      user = User.find_by(email: email, provider: nil)
      if user&.authenticate(password)
        render json: { token: JsonWebToken.encode(user_id: user.id), user: user_json(user) }
      else
        render json: { error: "이메일 또는 비밀번호가 올바르지 않아요." }, status: :unauthorized
      end
    end

    def me
      render json: { user: user_json(current_user) }
    end

    private

    def user_json(user)
      { id: user.id, email: user.email, name: user.name }
    end
  end
end

