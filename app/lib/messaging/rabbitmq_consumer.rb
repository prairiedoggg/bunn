require "json"
require "bunny"

module Messaging
  class RabbitmqConsumer
    def self.run!(queue_name: ENV.fetch("RABBITMQ_QUEUE", "bunn.events"), binding_key: ENV.fetch("RABBITMQ_BINDING", "#"))
      new(queue_name: queue_name, binding_key: binding_key).run!
    end

    def initialize(queue_name:, binding_key:)
      @queue_name = queue_name
      @binding_key = binding_key
      @host = Config.rabbitmq_host
      @port = Config.rabbitmq_port
      @user = Config.rabbitmq_user
      @password = Config.rabbitmq_password
    end

    def run!
      STDOUT.sync = true
      puts "[RabbitMQ] consumer starting queue=#{@queue_name} binding=#{@binding_key}"
      Rails.logger.info("[RabbitMQ] consumer starting queue=#{@queue_name} binding=#{@binding_key}")

      conn = Bunny.new(
        host: @host,
        port: @port,
        username: @user,
        password: @password,
        automatically_recover: true
      )
      conn.start
      ch = conn.create_channel
      ch.prefetch(10)

      exchange = ch.topic("events", durable: true)
      queue = ch.queue(@queue_name, durable: true)
      queue.bind(exchange, routing_key: @binding_key)

      shutdown = -> do
        Rails.logger.info("[RabbitMQ] consumer shutting down...")
        begin
          ch.close
        rescue StandardError
          nil
        end
        begin
          conn.close
        rescue StandardError
          nil
        end
        exit(0)
      end

      %w[INT TERM].each { |sig| Signal.trap(sig, &shutdown) }

      queue.subscribe(manual_ack: true, block: true) do |delivery_info, _properties, body|
        payload = JSON.parse(body) rescue { "_raw" => body }
        puts "[RabbitMQ] received rk=#{delivery_info.routing_key} payload=#{payload.inspect}"
        Rails.logger.info("[RabbitMQ] received rk=#{delivery_info.routing_key} payload=#{payload.inspect}")
        ch.ack(delivery_info.delivery_tag)
      rescue StandardError => e
        puts "[RabbitMQ] handler error=#{e.class} msg=#{e.message}"
        Rails.logger.error("[RabbitMQ] handler error=#{e.class} msg=#{e.message}")
        ch.nack(delivery_info.delivery_tag, false, true)
      end
    end
  end
end

