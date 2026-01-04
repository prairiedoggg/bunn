# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

Story.find_or_create_by!(title: "잉크 냄새가 남은 밤") do |s|
  s.pen_name = "모과"
  s.body = <<~TEXT
    새벽 두 시, 책상 위 유리컵에 달빛이 얹혔다.
    나는 매번 같은 문장에서 멈추고, 같은 숨을 되돌려 받는다.

    문장 끝의 점은 어쩌면 마침표가 아니라,
    다음 문장을 부르는 작은 종일지도 모른다.
  TEXT
end

Story.find_or_create_by!(title: "문장 사이로 부는 바람") do |s|
  s.pen_name = ""
  s.body = <<~TEXT
    바람은 늘 문장 사이에서 시작된다.
    말해지지 않은 것들이, 말해진 것들을 밀어낸다.
  TEXT
end

first = Story.find_by(title: "잉크 냄새가 남은 밤")
if first && first.critiques.none?
  first.critiques.create!(pen_name: "독자1", body: "첫 문장이 정말 좋았어요. 유리컵에 달빛이 얹혔다는 표현이 선명합니다.")
  first.critiques.create!(pen_name: "", body: "중반부에서 감정이 더 확 올라오면 좋을 것 같아요. 다음 문장이 기대돼요.")
end
