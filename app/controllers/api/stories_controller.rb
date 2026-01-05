module Api
  class StoriesController < BaseController
    def index
      stories = Story.recent.select(:id, :title, :pen_name, :body, :critiques_count, :created_at)
      render json: { stories: stories.map { |s| story_json(s) } }
    end

    def show
      story = Story.find(params[:id])
      critiques = story.critiques.recent.select(:id, :pen_name, :body, :created_at)
      render json: { story: story_json(story), critiques: critiques.map { |c| critique_json(c) } }
    end

    def create
      story = Story.new(story_params)
      if story.save
        render json: { story: story_json(story) }, status: :created
      else
        render json: { errors: story.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def story_params
      params.require(:story).permit(:title, :pen_name, :body)
    end

    def story_json(story)
      {
        id: story.id,
        title: story.title,
        pen_name: story.pen_name,
        body: story.body,
        critiques_count: story.critiques_count,
        created_at: story.created_at&.iso8601
      }
    end

    def critique_json(critique)
      {
        id: critique.id,
        pen_name: critique.pen_name,
        body: critique.body,
        created_at: critique.created_at&.iso8601
      }
    end
  end
end

