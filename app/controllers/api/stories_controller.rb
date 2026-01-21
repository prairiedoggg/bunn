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
      render json: { stories: stories.map { |s| Api::StorySerializer.call(s) } }
    end

    def show
      story = Story.includes(:tags).find(params[:id])
      viewer = current_user
      critiques = story.critiques
        .recent
        .visible_to(viewer)
        .select(:id, :story_id, :user_id, :pen_name, :body, :is_public, :created_at)

      # show 응답에서는 "보이는" 합평 개수를 사용해 클라이언트 표시와 일치시킵니다.
      visible_critiques = critiques.to_a
      story_payload = Api::StorySerializer.call(story, critiques_count: visible_critiques.length)
      render json: { story: story_payload, critiques: visible_critiques.map { |c| Api::CritiqueSerializer.call(c, viewer: viewer) } }
    end

    def random
      story = Story.includes(:tags).order(Arel.sql("RANDOM()")).first
      return render json: { story: nil }, status: :not_found if story.nil?

      render json: { story: Api::StorySerializer.call(story) }
    end

    def create
      story = Story.new(story_params)
      story.assign_tags(story_tags)
      if story.save
        render json: { story: Api::StorySerializer.call(story) }, status: :created
      else
        render json: { errors: story.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def story_params
      params.require(:story).permit(:title, :pen_name, :body)
    end

    def story_tags
      raw = params.dig(:story, :tags)
      return raw if raw.is_a?(Array)

      str = params.dig(:story, :tags_string).to_s
      return [] if str.blank?

      str.split(/[,\s]+/)
    end
  end
end

