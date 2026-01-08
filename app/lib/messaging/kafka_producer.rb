require "json"
require "kafka"

module Messaging
  class KafkaProducer < Producer
    def initialize(brokers: Config.kafka_brokers, client_id: Config.kafka_client_id)
      @kafka = Kafka.new(seed_brokers: brokers, client_id: client_id)
    end

    def publish(topic:, payload:, key: nil, headers: {})
      # headers는 Ruby Kafka에서 message headers 지원이 제한적일 수 있어 payload에 포함시키지 않습니다.
      @kafka.deliver_message(JSON.generate(payload), topic: topic, key: key)
    end
  end
end

