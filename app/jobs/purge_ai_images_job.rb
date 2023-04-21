class PurgeAiImagesJob < ApplicationJob
  queue_as :default

  def perform
    images = ActiveStorage::Attachment.where(name: "images").where("created_at <= ?", DateTime.now - 24.hours)
    images.find_each do |image|
      image.purge_later
    end
  end
end
