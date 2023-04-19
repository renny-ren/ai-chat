json.array! @image_blobs.map do |image|
  json.url image.url
  json.name image.filename.to_s
end
