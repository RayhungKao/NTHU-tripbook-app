# frozen_string_literal: true

module Tripbook
  # Service to remove a member to calendar
  class RemoveEvent
    class EventNotRemoved < StandardError; end

    def initialize(config)
      @config = config
    end

    def api_url
      @config.API_URL
    end

    def call(current_account:, calendar_id:, event_data:)
      response = HTTP.auth("Bearer #{current_account.auth_token}")
                     .delete("#{api_url}/calendars/#{calendar_id}/events",
                             json: event_data)

      raise EventNotRemoved unless response.code == 201
    end
  end
end
