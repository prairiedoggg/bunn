class StoryTagging < ApplicationRecord
  belongs_to :story
  belongs_to :tag

  validates :tag_id, uniqueness: { scope: :story_id }
end
