require "application_system_test_case"

class StoriesTest < ApplicationSystemTestCase
  setup do
    @story = stories(:one)
  end

  test "visiting the index" do
    visit stories_url
    assert_selector "h1", text: "문(文)"
  end

  test "should create story" do
    visit stories_url
    click_on "새 소설 쓰기", match: :first

    fill_in "제목", with: @story.title
    fill_in "필명(선택)", with: @story.pen_name
    fill_in "본문", with: @story.body
    click_on "등록"

    assert_text "소설이 등록됐어요."
    click_on "목록", match: :first
  end

  test "should update Story" do
    visit story_url(@story)
    click_on "수정", match: :first

    fill_in "제목", with: @story.title
    fill_in "필명(선택)", with: @story.pen_name
    fill_in "본문", with: @story.body
    click_on "수정 저장"

    assert_text "소설이 수정됐어요."
    click_on "목록", match: :first
  end

  test "should destroy Story" do
    visit story_url(@story)
    accept_confirm { click_on "삭제", match: :first }

    assert_text "소설이 삭제됐어요."
  end
end
