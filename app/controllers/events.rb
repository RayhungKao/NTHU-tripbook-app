# frozen_string_literal: true

require 'roda'

module Tripbook
  # Web controller for Tripbook API
  class App < Roda
    route('events') do |routing|
      routing.redirect '/auth/login' unless @current_account.logged_in?

      # GET /events/[event_id]
      routing.get(String) do |event_id|
        event_info = GetEvent.new(App.config)
                             .call(@current_account, event_id)
        event = Event.new(event_info)

        return { current_user: @current_account.username, event: event.to_json }.to_json
      end
    end
  end
end
