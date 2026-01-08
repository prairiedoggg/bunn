module Messaging
  module Factory
    module_function

    def producer
      case Config.backend
      when "rabbitmq", "rabbit"
        RabbitmqProducer.new
      when "kafka"
        KafkaProducer.new
      else
        NullProducer.new
      end
    end
  end
end

