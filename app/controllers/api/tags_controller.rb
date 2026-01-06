module Api
  class TagsController < BaseController
    def index
      tags = Tag.popular.limit(50).select(:id, :name)
      render json: { tags: tags.map { |t| { id: t.id, name: t.name } } }
    end
  end
end

