require "test_helper"

class CritiqueTest < ActiveSupport::TestCase
  test "public critique is valid without user" do
    story = stories(:one)
    critique = story.critiques.new(body: "좋았어요", is_public: true)
    assert critique.valid?
  end

  test "private critique requires user" do
    story = stories(:one)
    critique = story.critiques.new(body: "비공개", is_public: false)
    assert_not critique.valid?
    assert_includes critique.errors.full_messages.join("\n"), "비공개"
  end

  test "private critique is valid with user" do
    story = stories(:one)
    user = User.create!(email: "user@example.com", password: "password123")
    critique = story.critiques.new(body: "비공개", is_public: false, user: user)
    assert critique.valid?
  end
end
