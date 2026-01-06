class Story < ApplicationRecord
  has_many :critiques, dependent: :destroy
  has_many :story_taggings, dependent: :destroy
  has_many :tags, through: :story_taggings

  validates :title, presence: true, length: { maximum: 100 }
  validates :pen_name, length: { maximum: 30 }, allow_blank: true
  validates :body, presence: true, length: { maximum: 20_000 }

  scope :recent, -> { order(created_at: :desc) }

  def self.search(query)
    q = query.to_s.strip
    return all if q.blank?

    where("title LIKE :q OR body LIKE :q", q: "%#{sanitize_sql_like(q)}%")
  end

  def assign_tags(tags)
    names = Array(tags).map { |t| t.to_s.strip.downcase }.reject(&:blank?).uniq.first(10)
    self.tags = names.map { |name| Tag.find_or_create_by!(name: name) }
  end
end
