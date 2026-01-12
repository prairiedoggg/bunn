require "test_helper"

class Api::StoriesControllerTest < ActionDispatch::IntegrationTest
  test "show returns only public critiques for anonymous" do
    story = Story.create!(title: "t", body: "b")
    user = User.create!(email: "a@example.com", password: "password123")

    story.critiques.create!(body: "public", is_public: true, user: user)
    story.critiques.create!(body: "private", is_public: false, user: user)

    get "/api/stories/#{story.id}"
    assert_response :success

    data = JSON.parse(response.body)
    critiques = data.fetch("critiques")
    assert_equal 1, critiques.length
    assert_equal true, critiques[0]["is_public"]
    assert_equal "public", critiques[0]["body"]
  end

  test "show returns my private critiques when authorized" do
    story = Story.create!(title: "t", body: "b")
    user = User.create!(email: "b@example.com", password: "password123")

    story.critiques.create!(body: "public", is_public: true, user: user)
    story.critiques.create!(body: "private", is_public: false, user: user)

    token = JsonWebToken.encode(user_id: user.id)
    get "/api/stories/#{story.id}", headers: { "Authorization" => "Bearer #{token}" }
    assert_response :success

    data = JSON.parse(response.body)
    bodies = data.fetch("critiques").map { |c| c["body"] }.sort
    assert_equal %w[private public], bodies
  end
end

