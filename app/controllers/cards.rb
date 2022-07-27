# frozen_string_literal: true

require 'roda'
require_relative './app'

module Tripbook
  # Web controller for Tripbook API
  class App < Roda
    route('cards') do |routing|
      routing.on do
        routing.on String do |username|
          # GET /cards/[username]
          routing.get do
            card_list = GetCard.new(App.config)
                                     .call(current_account: @current_account)

            return { card_list: card_list}.to_json
          rescue StandardError
            routing.halt 500, { message: 'Could not get cards' }.to_json
          end

          # POST /cards/[username]
          routing.post do
            params = JSON.parse(routing.body.read)
            card_data = CreateNewCard.new(App.config)
                                           .call(current_account: @current_account, username: username, card_data: params)

            return { current_user: @current_account.username, message: card_data['message'],
                     data: card_data['data'] }.to_json
          rescue StandardError
            routing.halt 500, { message: 'Could not post cards' }.to_json
          end
        end
      end
    end
  end
end