# frozen_string_literal: true

require 'http'

module Tripbook
  # Returns a calendar belonging to an account
  class GetCalendar
    def initialize(config)
      @config = config
    end

    def call(current_account, calendar_id)
      response = HTTP.auth("Bearer #{current_account.auth_token}")
                     .get("#{@config.API_URL}/calendars/#{calendar_id}")

      response.code == 200 ? JSON.parse(response.body.to_s)['data'] : nil
    end
  end
end
