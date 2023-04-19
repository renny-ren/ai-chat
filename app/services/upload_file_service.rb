require "aliyun/oss"

class UploadFileService
  attr_reader :filename, :file_path

  def initialize(filename, file_path)
    @filename = filename
    @file_path = file_path
  end

  def call
    bucket = oss_client.get_bucket(Rails.application.credentials.dig(:aliyun, :bucket_name))
    bucket.put_object(filename, file: file_path)
  end

  private

  def oss_client
    @client ||= Aliyun::OSS::Client.new(
      endpoint: Rails.application.credentials.dig(:aliyun, :endpoint),
      access_key_id: Rails.application.credentials.dig(:aliyun, :access_key_id),
      access_key_secret: Rails.application.credentials.dig(:aliyun, :access_key_secret),
    )
  end
end
