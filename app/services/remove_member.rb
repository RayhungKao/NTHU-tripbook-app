# frozen_string_literal: true

module Tripbook
  # Service to remove a member to calendar
  class RemoveMember
    class MemberNotRemoved < StandardError; end

    def initialize(config)
      @config = config
    end

    def api_url
      @config.API_URL
    end

    def call(current_account:, member:, calendar_id:)
      response = HTTP.auth("Bearer #{current_account.auth_token}")
                     .delete("#{api_url}/calendars/#{calendar_id}/members",
                             json: { email: member[:email] })

      raise MemberNotRemoved unless response.code == 200
    end
  end
end
