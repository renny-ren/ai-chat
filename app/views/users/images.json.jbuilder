json.array! @images.map do |image|
  json.url image[:url]
end
