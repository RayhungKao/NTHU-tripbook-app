# frozen_string_literal: true

require 'roda'

module Tripbook
  # Web controller for Tripbook API
  class App < Roda
    route('google') do |routing|
      routing.on do
        routing.get do
          google_map_api_key = App.config.REACT_APP_GOOGLE_MAP_KEY

          return { message: google_map_api_key }.to_json
        rescue StandardError => e
          routing.halt 500, { message: 'error to get google map api key' }.to_json
        end
      end
    end
  end
end
