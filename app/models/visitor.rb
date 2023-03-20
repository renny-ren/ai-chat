class Visitor
  def id
    @id ||= SecureRandom.uuid
  end

  def nickname
    @nickname ||= '游客'
  end

  def avatar_url
    'https://aii-chat-assets.oss-cn-chengdu.aliyuncs.com/images/anonymous.png'
  end
end
