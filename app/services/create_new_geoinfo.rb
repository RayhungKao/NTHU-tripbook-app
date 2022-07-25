# frozen_string_literal: true

require 'http'

module Tripbook
  # Create a new geoinfo for account
  class CreateNewGeoinfo
    def initialize(config)
      @config = config
    end

    def api_url
      @config.API_URL
    end

    def call(current_account:, username:, geoinfo_data:)
      config_url = "#{api_url}/geoinfos/#{username}"
      response = HTTP.auth("Bearer #{current_account.auth_token}")
                     .post(config_url, json: geoinfo_data)
      
      response.code == 201 ? JSON.parse(response.body.to_s) : raise
    end
  end
end
