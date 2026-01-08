module Messaging
  module Config
    module_function

    def backend
      (ENV["MESSAGE_BACKEND"] || "rabbitmq").strip.downcase
    end

    def rabbitmq_url
      ENV.fetch("RABBITMQ_URL", "amqp://guest:guest@localhost:5672")
    end

    def kafka_brokers
      (ENV["KAFKA_BROKERS"] || "localhost:9092").split(",").map(&:strip).reject(&:empty?)
    end

    def kafka_client_id
      ENV.fetch("KAFKA_CLIENT_ID", "bunn")
    end
  end
end

