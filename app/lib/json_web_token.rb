module JsonWebToken
  class << self
    def encode(payload, exp: 30.days.from_now)
      payload = payload.dup
      payload[:exp] = exp.to_i
      JWT.encode(payload, secret_key, "HS256")
    end

    def decode(token)
      decoded = JWT.decode(token, secret_key, true, { algorithm: "HS256" })
      decoded.first.with_indifferent_access
    rescue JWT::DecodeError
      nil
    end

    private

    def secret_key
      ENV.fetch("JWT_SECRET") { Rails.application.secret_key_base }
    end
  end
end

