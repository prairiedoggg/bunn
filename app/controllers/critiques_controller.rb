class CritiquesController < ApplicationController
  before_action :set_story

  def create
    @critique = @story.critiques.new(critique_params)

    if @critique.save
      respond_to do |format|
        format.turbo_stream
        format.html { redirect_to @story, notice: "합평이 등록됐어요." }
      end
    else
      @critiques = @story.critiques.recent

      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace(
            "critique_form",
            partial: "critiques/form",
            locals: { story: @story, critique: @critique }
          ), status: :unprocessable_entity
        end
        format.html { render "stories/show", status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @critique = @story.critiques.find(params[:id])
    @critique.destroy

    respond_to do |format|
      format.turbo_stream
      format.html { redirect_to @story, notice: "합평이 삭제됐어요." }
    end
  end

  private

  def set_story
    @story = Story.find(params[:story_id])
  end

  def critique_params
    params.require(:critique).permit(:pen_name, :body)
  end
end
