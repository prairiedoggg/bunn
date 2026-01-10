module Api
  class StoriesController < BaseController
    before_action :authenticate!, only: :create
    def index
      stories = Story
        .recent
        .includes(:tags)
        .search(params[:q])

      if params[:tag].present?
        tag = params[:tag].to_s.strip.downcase
        stories = stories.joins(:tags).where(tags: { name: tag }).distinct
      end

      stories = stories.select(:id, :title, :pen_name, :body, :critiques_count, :created_at)
      render json: { stories: stories.map { |s| story_json(s) } }
    end

    def show
      story = Story.includes(:tags).find(params[:id])
      viewer = current_user
      critiques = story.critiques.recent.select(:id, :user_id, :pen_name, :body, :is_public, :created_at)
      render json: { story: story_json(story), critiques: critiques.map { |c| critique_json(c, viewer) } }
    end

    def random
      story = Story.includes(:tags).order(Arel.sql("RANDOM()")).first
      return render json: { story: nil }, status: :not_found if story.nil?

      render json: { story: story_json(story) }
    end

    def create
      story = Story.new(story_params)
      story.assign_tags(story_tags)
      if story.save
        render json: { story: story_json(story) }, status: :created
      else
        render json: { errors: story.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def story_params
      params.require(:story).permit(:title, :pen_name, :body, tags: [])
    end

    def story_tags
      raw = params.dig(:story, :tags)
      return raw if raw.is_a?(Array)

      str = params.dig(:story, :tags_string).to_s
      return [] if str.blank?

      str.split(/[,\s]+/)
    end

    def story_json(story)
      {
        id: story.id,
        title: story.title,
        pen_name: story.pen_name,
        body: story.body,
        critiques_count: story.critiques_count,
        tags: story.tags.map(&:name),
        created_at: story.created_at&.iso8601
      }
    end

    def critique_json(critique, viewer)
      mine = critique.user_id.present? && viewer&.id == critique.user_id
      can_view_body = critique.is_public || mine

      {
        id: critique.id,
        pen_name: can_view_body ? critique.pen_name : nil,
        body: can_view_body ? critique.body : nil,
        is_public: critique.is_public,
        mine: mine,
        created_at: critique.created_at&.iso8601
      }
    end
  end
end

