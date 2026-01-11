class Rack::Attack
  # 기본: Rails.cache를 사용 (단일 노드/개발에선 메모리 캐시로 동작)
  # 멀티 파드(웹 2개 이상)로 스케일하면 Redis 같은 공유 캐시로 바꾸는 게 업계 표준입니다.
  Rack::Attack.cache.store = Rails.cache

  # /up 은 로드밸런서/헬스체크가 자주 치므로 allowlist
  safelist("allow health check") do |req|
    req.path == "/up"
  end

  # 전체적인 HTTP flood 방어(너무 낮게 잡으면 정상 유저도 막힘)
  throttle("req/ip", limit: 300, period: 5.minutes) do |req|
    req.ip unless req.path.start_with?("/assets")
  end

  # 로그인/회원가입은 별도 더 강하게 제한
  throttle("auth/ip", limit: 20, period: 5.minutes) do |req|
    if req.path.start_with?("/api/auth/") && %w[POST].include?(req.request_method)
      req.ip
    end
  end

  # 쓰기 API(스토리/합평 생성)도 완만히 제한
  throttle("write/ip", limit: 60, period: 5.minutes) do |req|
    next unless req.request_method == "POST"
    next unless req.path.start_with?("/api/")

    # /api/stories(POST), /api/stories/:id/critiques(POST)
    if req.path == "/api/stories" || req.path.match?(%r{\A/api/stories/\d+/critiques\z})
      req.ip
    end
  end
end

