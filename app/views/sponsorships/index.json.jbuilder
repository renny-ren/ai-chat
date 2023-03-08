json.array! @sponsorships.map do |item|
  json.(item, :amount, :anonymous)
  json.sponsor_at item.created_at.in_time_zone("Asia/Shanghai").strftime("%Y-%m-%d")
  if item.user.present?
    json.user do
      json.(item.user, :nickname, :avatar_url)
    end
  end
end
