# frozen_string_literal: true

require 'http'

module Tripbook
  # Create a new calendar for a calendar
  class CreateNewCalendar
    def initialize(config)
      @config = config
    end

    def api_url
      @config.API_URL
    end

    def call(current_account:, calendar_data:)
      config_url = "#{api_url}/calendars"
      response = HTTP.auth("Bearer #{current_account.auth_token}")
                     .post(config_url, json: calendar_data)

      response.code == 201 ? JSON.parse(response.body.to_s) : raise
    end
  end
end
