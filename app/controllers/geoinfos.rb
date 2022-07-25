# frozen_string_literal: true

require 'roda'
require_relative './app'

module Tripbook
  # Web controller for Tripbook API
  class App < Roda
    route('geoinfos') do |routing|
      routing.on do
        routing.on String do |username|
          # GET /geoinfos/[username]
          routing.get do
            puts @current_account.auth_token
            geoinfo_list = GetGeoinfo.new(App.config)
                                     .call(@current_account)

            return { geoinfo_list: geoinfo_list}.to_json
          rescue StandardError
            routing.halt 500, { message: 'Could not get geoinfos' }.to_json
          end

          # POST /geoinfos/[username]
          routing.post do
            params = JSON.parse(routing.body.read)
            puts params
            geoinfo_data = CreateNewGeoinfo.new(App.config)
                                           .call(current_account: @current_account, username: username, geoinfo_data: params)

            puts geoinfo_data['data']
            return { current_user: @current_account.username, message: geoinfo_data['message'],
                     data: geoinfo_data['data'] }.to_json
          rescue StandardError
            routing.halt 500, { message: 'Could not post geoinfos' }.to_json
          end
        end
      end
    end
  end
end