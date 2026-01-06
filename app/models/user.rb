class User < ApplicationRecord
  has_secure_password validations: false

  before_validation :normalize_email

  validates :email, uniqueness: true, length: { maximum: 255 }, allow_blank: true
  validates :password, presence: true, if: -> { provider.blank? }, on: :create
  validates :name, length: { maximum: 50 }, allow_blank: true

  validates :provider, inclusion: { in: %w[google apple naver kakao], allow_blank: true }
  validates :uid, presence: true, if: -> { provider.present? }

  private

  def normalize_email
    self.email = email.to_s.strip.downcase
  end
end
