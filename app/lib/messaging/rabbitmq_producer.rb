require "json"
require "bunny"

module Messaging
  class RabbitmqProducer < Producer
    def initialize(host: Config.rabbitmq_host, port: Config.rabbitmq_port, user: Config.rabbitmq_user, password: Config.rabbitmq_password)
      @host = host
      @port = port
      @user = user
      @password = password
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
      conn = Bunny.new(
        host: @host,
        port: @port,
        username: @user,
        password: @password,
        automatically_recover: true
      )
      conn.start
      ch = conn.create_channel
      yield ch
    ensure
      ch&.close rescue nil
      conn&.close rescue nil
    end
  end
end

