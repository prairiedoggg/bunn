class StoriesController < ApplicationController
  before_action :set_story, only: %i[ show edit update destroy ]
  before_action :require_admin!, only: %i[new create edit update destroy]

  # GET /stories
  def index
    @stories = Story.recent
  end

  # GET /stories/1
  def show
    # HTML 화면에서는 비공개 합평을 노출하지 않습니다.
    @critiques = @story.critiques.where(is_public: true).recent
    @public_critiques_count = @critiques.size
    @critique = @story.critiques.new
  end

  # GET /stories/new
  def new
    @story = Story.new
  end

  # GET /stories/1/edit
  def edit
  end

  # POST /stories
  def create
    @story = Story.new(story_params)

    if @story.save
      redirect_to @story, notice: "소설이 등록됐어요."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /stories/1
  def update
    if @story.update(story_params)
      redirect_to @story, notice: "소설이 수정됐어요.", status: :see_other
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /stories/1
  def destroy
    @story.destroy!
    redirect_to stories_url, notice: "소설이 삭제됐어요.", status: :see_other
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_story
      @story = Story.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def story_params
      params.require(:story).permit(:title, :pen_name, :body)
    end
end
