class CreateCritiques < ActiveRecord::Migration[7.1]
  def change
    create_table :critiques do |t|
      t.references :story, null: false, foreign_key: true
      t.string :pen_name
      t.text :body, null: false

      t.timestamps
    end
  end
end
