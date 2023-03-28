class Retry
  def self.timeout_run(time: 30.seconds, count: 3, &block)
    retries ||= 0
    Timeout.timeout(time) do
      block.call
    end
  rescue Timeout::Error => e
    if (retries += 1) < count
      retry
    else
      App::Error.track(e)
      raise e
    end
  end

  def self.run(time: 3.seconds, count: 3, after_retry: nil, &block)
    retries ||= 0
    block.call
  rescue => e
    App::Error.track(e, title: e.message) if retries == 1
    if (retries += 1) < count
      sleep(time)
      retry
    else
      after_retry.call if after_retry.present?
      raise e
    end
  end
end
