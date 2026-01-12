class ApplicationController < ActionController::Base
  private

  def require_admin!
    return if Rails.env.development? || Rails.env.test?

    user = ENV["ADMIN_BASIC_AUTH_USER"].to_s
    pass = ENV["ADMIN_BASIC_AUTH_PASSWORD"].to_s

    # 프로덕션에서 HTML 관리 기능을 열어두지 않기 위한 안전장치:
    # 자격증명이 없으면 아예 404로 숨깁니다.
    return head :not_found if user.blank? || pass.blank?

    authenticate_or_request_with_http_basic("Admin") do |u, p|
      ActiveSupport::SecurityUtils.secure_compare(u.to_s, user) &
        ActiveSupport::SecurityUtils.secure_compare(p.to_s, pass)
    end
  end
end
