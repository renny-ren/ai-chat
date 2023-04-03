json.images do
  json.array! @images.map do |image|
    json.url image.dig("url")
  end
end
