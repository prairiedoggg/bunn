module Api
  class CritiquesController < BaseController
    before_action :set_story
    before_action :authenticate!

    def create
      critique = @story.critiques.new(critique_params)
      critique.user = current_user
      if critique.save
        render json: { critique: critique_json(critique), story: { id: @story.id, critiques_count: @story.reload.critiques_count } }, status: :created
      else
        render json: { errors: critique.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      critique = @story.critiques.find(params[:id])
      if critique.user_id.present? && critique.user_id != current_user&.id
        return render json: { error: "권한이 없어요." }, status: :forbidden
      end
      critique.destroy
      render json: { ok: true, story: { id: @story.id, critiques_count: @story.reload.critiques_count } }
    end

    private

    def set_story
      @story = Story.find(params[:story_id])
    end

    def critique_params
      params.require(:critique).permit(:pen_name, :body, :is_public)
    end

    def critique_json(critique)
      {
        id: critique.id,
        story_id: critique.story_id,
        pen_name: critique.pen_name,
        body: critique.body,
        is_public: critique.is_public,
        mine: critique.user_id.present? && critique.user_id == current_user&.id,
        created_at: critique.created_at&.iso8601
      }
    end
  end
end

