class AddVisibilityAndUserToCritiques < ActiveRecord::Migration[7.1]
  def change
    add_reference :critiques, :user, null: true, foreign_key: true, index: true
    add_column :critiques, :is_public, :boolean, null: false, default: true
    add_index :critiques, :is_public
  end
end

