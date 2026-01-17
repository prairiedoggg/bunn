module Api
  module StorySerializer
    module_function

    def call(story, critiques_count: nil)
      {
        id: story.id,
        title: story.title,
        pen_name: story.pen_name,
        body: story.body,
        critiques_count: critiques_count.nil? ? story.critiques_count : critiques_count,
        tags: story.tags.map(&:name),
        created_at: story.created_at&.iso8601
      }
    end
  end
end

