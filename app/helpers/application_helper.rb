module ApplicationHelper
  def display_pen_name(name)
    name.presence || "익명"
  end

  def excerpt(text, length: 180)
    truncate(text.to_s.squish, length: length)
  end
end
