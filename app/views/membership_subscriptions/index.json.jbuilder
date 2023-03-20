json.subscriptions do
  json.array! @subscriptions.map do |subscription|
    json.(subscription, :status, :status_name)
    json.plan_name subscription.plan.description
    json.left_days (subscription.end_at.to_date - Time.now.to_date).to_i
    json.start_at subscription.start_at.to_date
    json.end_at subscription.end_at.to_date
  end
end
