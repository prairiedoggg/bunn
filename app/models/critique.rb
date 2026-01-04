class Critique < ApplicationRecord
  belongs_to :story, counter_cache: true

  validates :pen_name, length: { maximum: 30 }, allow_blank: true
  validates :body, presence: true, length: { maximum: 5_000 }

  scope :recent, -> { order(created_at: :desc) }
end
