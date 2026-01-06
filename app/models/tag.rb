class Tag < ApplicationRecord
  has_many :story_taggings, dependent: :destroy
  has_many :stories, through: :story_taggings

  before_validation :normalize_name

  validates :name, presence: true, length: { maximum: 20 }, uniqueness: true

  scope :popular, -> { left_joins(:story_taggings).group(:id).order(Arel.sql("COUNT(story_taggings.id) DESC"), name: :asc) }

  private

  def normalize_name
    self.name = name.to_s.strip.downcase
  end
end
