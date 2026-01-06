module Api
  class CritiquesController < BaseController
    before_action :set_story
    before_action :authenticate!

    def create
      critique = @story.critiques.new(critique_params)
      if critique.save
        render json: { critique: critique_json(critique), story: { id: @story.id, critiques_count: @story.reload.critiques_count } }, status: :created
      else
        render json: { errors: critique.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      critique = @story.critiques.find(params[:id])
      critique.destroy
      render json: { ok: true, story: { id: @story.id, critiques_count: @story.reload.critiques_count } }
    end

    private

    def set_story
      @story = Story.find(params[:story_id])
    end

    def critique_params
      params.require(:critique).permit(:pen_name, :body)
    end

    def critique_json(critique)
      {
        id: critique.id,
        story_id: critique.story_id,
        pen_name: critique.pen_name,
        body: critique.body,
        created_at: critique.created_at&.iso8601
      }
    end
  end
end

