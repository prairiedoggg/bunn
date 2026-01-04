class CreateStories < ActiveRecord::Migration[7.1]
  def change
    create_table :stories do |t|
      t.string :title, null: false
      t.string :pen_name
      t.text :body, null: false
      t.integer :critiques_count, null: false, default: 0

      t.timestamps
    end
  end
end
