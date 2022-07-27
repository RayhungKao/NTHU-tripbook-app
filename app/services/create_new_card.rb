# frozen_string_literal: true

require 'http'

module Tripbook
  # Create a new card for account
  class CreateNewCard
    def initialize(config)
      @config = config
    end

    def api_url
      @config.API_URL
    end

    def call(current_account:, username:, card_data:)
      config_url = "#{api_url}/cards/#{username}"
      response = HTTP.auth("Bearer #{current_account.auth_token}")
                     .post(config_url, json: card_data)
      
      response.code == 201 ? JSON.parse(response.body.to_s) : raise
    end
  end
end
