json.referrals do
  json.array! @referrals.map do |referral|
    json.(referral.invitee, :nickname)
    json.(referral, :status, :status_name)
    json.created_at referral.invitee.created_at.in_time_zone("Asia/Shanghai").strftime("%Y-%m-%d %H:%M:%S")
  end
end
