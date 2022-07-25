# frozen_string_literal: true

require 'http'

module Tripbook
  # Returns all calendars belonging to an account
  class GetPoisFromMap
    def initialize(config)
      @config = config
    end

    def call(current_account, map_id)
      response = HTTP.auth("Bearer #{current_account.auth_token}")
                     .get("#{@config.API_URL}/maps/#{map_id}/pois")
      
      response.code == 200 ? JSON.parse(response.to_s)['data'] : nil
    end
  end
end
