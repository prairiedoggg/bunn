module Api
  class CritiquesController < BaseController
    before_action :set_story
    before_action :authenticate!

    def create
      critique = @story.critiques.new(critique_params)
      critique.user = current_user
      if critique.save
        visible_count = @story.critiques.visible_to(current_user).count
        render json: { critique: Api::CritiqueSerializer.call(critique, viewer: current_user), story: { id: @story.id, critiques_count: visible_count } }, status: :created
      else
        render json: { errors: critique.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      critique = @story.critiques.find(params[:id])
      if critique.user_id != current_user&.id
        return render json: { error: "권한이 없어요." }, status: :forbidden
      end
      critique.destroy
      visible_count = @story.critiques.visible_to(current_user).count
      render json: { ok: true, story: { id: @story.id, critiques_count: visible_count } }
    end

    private

    def set_story
      @story = Story.find(params[:story_id])
    end

    def critique_params
      params.require(:critique).permit(:pen_name, :body, :is_public)
    end
  end
end

