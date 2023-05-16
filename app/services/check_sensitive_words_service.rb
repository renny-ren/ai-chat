class CheckSensitiveWordsService
  attr_reader :text

  def initialize(text)
    @text = text
  end

  def call
    sensitive?
  end

  private

  def sensitive?
    sensitive_words.any? { |word| text.include?(word) }
  end

  def sensitive_words
    data = YAML.load_file(Rails.root.join("config", "sensitive_words.yml"))
    data.dig("sensitive_words")
  end
end
