# frozen_string_literal: true

module App
  class Error
    class << self
      def track(e, title: nil, body: nil)
        body = build_body(e, body: body)
        ExceptionTrack::Log.create!(title: title, body: body)
      end

      def notify(e, title: nil, body: nil)
        body = build_body(e, body: body)
        ExceptionTrack::Log.create!(title: title, body: body)
      end

      private

      def build_body(e, body: nil)
        body ||= ""
        body += "\n\n"
        body += e.class.name + ":\n\n"
        body += e.message + "\n\n"
        body += "-------------------------------------------------------------\n"
        body += (e.backtrace || []).join("\n")
        body
      end
    end
  end
end
