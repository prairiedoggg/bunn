class Story < ApplicationRecord
  has_many :critiques, dependent: :destroy

  validates :title, presence: true, length: { maximum: 100 }
  validates :pen_name, length: { maximum: 30 }, allow_blank: true
  validates :body, presence: true, length: { maximum: 20_000 }

  scope :recent, -> { order(created_at: :desc) }
end
