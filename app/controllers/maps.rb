# frozen_string_literal: true

require 'roda'
require_relative './app'

module Tripbook
  # Web controller for Tripbook API
  class App < Roda
    route('maps') do |routing|
      routing.on do
        @maps_route = '/maps'

        routing.on String do |map_id|
          # GET /maps/[map_id]/pois
          routing.get('pois') do
            pois = GetPoisFromMap.new(App.config)
                                 .call(@current_account, map_id)

            return { pois: pois }.to_json
          rescue StandardError
            routing.halt 500, { message: 'Could not get pois from map' }.to_json
          end
        end
      end
    end
  end
end
