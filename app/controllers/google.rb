# frozen_string_literal: true

require 'roda'

module Tripbook
  # Web controller for Tripbook API
  class App < Roda
    route('google') do |routing|
      routing.get('calendar') do
        response = HTTP.auth("Bearer #{@current_account.google_auth_token}")
                       .get('https://www.googleapis.com/calendar/v3/users/me/calendarList?maxResults=10')
        return response.to_s if response.code == 200

        return { message: 'error' }.to_json
      rescue StandardError => e
        puts e.message
        routing.halt 500, { message: 'error' }.to_json
      end

      routing.get('event') do
        params_timeMax = routing.params['timeMax']
        params_timeMin = routing.params['timeMin']
        params_calendar_id = routing.params['calendar_id']

        params_timeMax = params_timeMax.sub('+', '%2B')
        params_timeMax = params_timeMax.sub(':', '%3A')

        params_timeMin = params_timeMin.sub('+', '%2B')
        params_timeMin = params_timeMin.sub(':', '%3A')

        params_calendar_id = params_calendar_id.sub('#', '%23')
        params_calendar_id = params_calendar_id.sub('@', '%40')

        # puts "https://www.googleapis.com/calendar/v3/calendars/#{params_calendar_id}/events?timeMax=#{params_timeMax}&timeMin=#{params_timeMin}"
        response = HTTP.auth("Bearer #{@current_account.google_auth_token}")
                       .get("https://www.googleapis.com/calendar/v3/calendars/#{params_calendar_id}/events?timeMax=#{params_timeMax}&timeMin=#{params_timeMin}")

        return response.to_s if response.code == 200

        return { message: 'error' }.to_json
      rescue StandardError => e
        puts e.message
        routing.halt 500, { message: 'error' }.to_json
      end
    end
  end
end
