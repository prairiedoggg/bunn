module Messaging
  class NullProducer < Producer
    def publish(topic:, payload:, key: nil, headers: {})
      Rails.logger.info("[Messaging] drop publish backend=none topic=#{topic} key=#{key} headers=#{headers.inspect} payload=#{payload.inspect}")
      true
    end
  end
end

