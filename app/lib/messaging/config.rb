module Messaging
  module Config
    module_function

    def backend
      (ENV["MESSAGE_BACKEND"] || "rabbitmq").strip.downcase
    end

    def rabbitmq_host
      ENV.fetch("RABBITMQ_HOST", "localhost")
    end

    def rabbitmq_port
      Integer(ENV.fetch("RABBITMQ_PORT", "5672"))
    end

    def rabbitmq_user
      ENV.fetch("RABBITMQ_USER")
    end

    def rabbitmq_password
      ENV.fetch("RABBITMQ_PASSWORD")
    end

    def kafka_brokers
      (ENV["KAFKA_BROKERS"] || "localhost:9092").split(",").map(&:strip).reject(&:empty?)
    end

    def kafka_client_id
      ENV.fetch("KAFKA_CLIENT_ID", "bunn")
    end
  end
end

