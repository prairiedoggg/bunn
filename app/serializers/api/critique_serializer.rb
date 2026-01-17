module Api
  module CritiqueSerializer
    module_function

    def call(critique, viewer:)
      mine = critique.user_id.present? && viewer&.id == critique.user_id
      can_view_body = critique.is_public || mine

      {
        id: critique.id,
        story_id: critique.story_id,
        pen_name: can_view_body ? critique.pen_name : nil,
        body: can_view_body ? critique.body : nil,
        is_public: critique.is_public,
        mine: mine,
        created_at: critique.created_at&.iso8601
      }
    end
  end
end

