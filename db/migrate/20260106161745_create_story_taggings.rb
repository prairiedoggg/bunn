class CreateStoryTaggings < ActiveRecord::Migration[7.1]
  def change
    create_table :story_taggings do |t|
      t.references :story, null: false, foreign_key: true
      t.references :tag, null: false, foreign_key: true

      t.timestamps
    end

    add_index :story_taggings, %i[story_id tag_id], unique: true
  end
end
