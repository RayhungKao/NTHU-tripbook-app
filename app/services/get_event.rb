# frozen_string_literal: true

require 'http'

module Tripbook
  # Returns an event belonging to a calendar
  class GetEvent
    def initialize(config)
      @config = config
    end

    def call(user, event_id)
      response = HTTP.auth("Bearer #{user.auth_token}")
                     .get("#{@config.API_URL}/events/#{event_id}")

      response.code == 200 ? JSON.parse(response.body.to_s)['data'] : nil
    end
  end
end
