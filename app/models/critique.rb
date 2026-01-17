class Critique < ApplicationRecord
  belongs_to :story, counter_cache: true
  belongs_to :user, optional: true

  validates :pen_name, length: { maximum: 30 }, allow_blank: true
  validates :body, presence: true, length: { maximum: 5_000 }
  validates :is_public, inclusion: { in: [ true, false ] }

  validate :private_requires_user

  scope :recent, -> { order(created_at: :desc) }
  scope :visible_to, ->(viewer) {
    if viewer
      where(is_public: true).or(where(user_id: viewer.id))
    else
      where(is_public: true)
    end
  }

  def public?
    is_public
  end

  private

  def private_requires_user
    return if is_public
    return if user_id.present?

    errors.add(:is_public, "비공개 합평은 로그인 사용자만 작성할 수 있어요.")
  end
end
