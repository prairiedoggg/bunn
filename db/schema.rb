# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2026_01_10_154000) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "critiques", force: :cascade do |t|
    t.integer "story_id", null: false
    t.string "pen_name"
    t.text "body", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.boolean "is_public", default: true, null: false
    t.index ["is_public"], name: "index_critiques_on_is_public"
    t.index ["story_id"], name: "index_critiques_on_story_id"
    t.index ["user_id"], name: "index_critiques_on_user_id"
  end

  create_table "stories", force: :cascade do |t|
    t.string "title", null: false
    t.string "pen_name"
    t.text "body", null: false
    t.integer "critiques_count", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "story_taggings", force: :cascade do |t|
    t.integer "story_id", null: false
    t.integer "tag_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["story_id", "tag_id"], name: "index_story_taggings_on_story_id_and_tag_id", unique: true
    t.index ["story_id"], name: "index_story_taggings_on_story_id"
    t.index ["tag_id"], name: "index_story_taggings_on_tag_id"
  end

  create_table "tags", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_tags_on_name", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.string "name"
    t.string "provider"
    t.string "uid"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["provider", "uid"], name: "index_users_on_provider_and_uid", unique: true
  end

  add_foreign_key "critiques", "stories"
  add_foreign_key "critiques", "users"
  add_foreign_key "story_taggings", "stories"
  add_foreign_key "story_taggings", "tags"
end
