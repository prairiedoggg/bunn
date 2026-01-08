module Messaging
  class Producer
    def publish(_topic:, _payload:, _key: nil, _headers: {})
      raise NotImplementedError
    end
  end
end

