require "json"
require "bunny"

module Messaging
  class RabbitmqProducer < Producer
    def initialize(url: Config.rabbitmq_url)
      @url = url
    end

    def publish(topic:, payload:, key: nil, headers: {})
      with_channel do |ch|
        exchange = ch.topic("events", durable: true)
        exchange.publish(
          JSON.generate(payload),
          routing_key: topic,
          headers: headers,
          message_id: key
        )
      end
    end

    private

    def with_channel
      conn = Bunny.new(@url, automatically_recover: true)
      conn.start
      ch = conn.create_channel
      yield ch
    ensure
      ch&.close rescue nil
      conn&.close rescue nil
    end
  end
end

