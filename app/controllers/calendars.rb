# frozen_string_literal: true

require 'roda'

module Tripbook
  # Web controller for Tripbook API
  class App < Roda
    route('calendars') do |routing|
      routing.on do
        @calendars_route = '/calendars'

        routing.is do
          # GET /calendars/
          routing.get do
            calendars_list = GetAllCalendars.new(App.config).call(@current_account)

            return { current_user: @current_account.username, calendars: calendars_list }.to_json
          end
          # POST /calendars/
          routing.post do
            params = JSON.parse(routing.body.read)
            calendar = CreateNewCalendar.new(App.config).call(current_account: @current_account, calendar_data: params)
            puts calendar['data']
            return { current_user: @current_account.username, message: calendar['message'],
                     data: calendar['data'] }.to_json
          end
        end

        routing.on String do |cal_id|
          # GET /calendars/[cal_id]
          routing.get do
            if routing.headers['AUTHORIZATION'].nil?
              temp_account = @current_account
            else
              scheme, auth_token = routing.headers['AUTHORIZATION'].split
              temp_account = Account.new('temp', auth_token)
            end
            result = GetCalendar.new(App.config).call(temp_account, cal_id)
            calendar = Calendar.new(result)

            return { current_user: @current_account.username, calendar: calendar.to_json }.to_json
          end
          # POST /calendars/[cal_id]/members
          routing.post('members') do
            params = JSON.parse(routing.body.read)
            member_info = Form::MemberEmail.new.call(params)
            if member_info.failure?
              flash[:error] = Form.validation_errors(member_info)
              routing.halt
            end

            action = routing.params['action']
            task_list = {
              'add' => { service: AddMember,
                         message: 'Added new member to calendar' },
              'remove' => { service: RemoveMember,
                            message: 'Removed member from calendar' }
            }

            task = task_list[action]

            task[:service].new(App.config).call(
              current_account: @current_account,
              member: member_info,
              calendar_id: cal_id
            )
            flash[:notice] = task[:message]
            return { message: "member: #{member_info[:email]} added to calendar" }.to_json if action == 'add'
            return { message: "member: #{member_info[:email]} removed from calendar" }.to_json if action == 'remove'
          rescue StandardError
            flash[:error] = 'Could not find member'
            routing.halt 500, { message: 'Could not find member' }.to_json
          end

          routing.post('events') do
            event_data = JSON.parse(routing.body.read)

            action = routing.params['action']
            task_list = {
              'add' => { service: CreateNewEvent,
                         message: 'Added new event to calendar' },
              'remove' => { service: RemoveEvent,
                            message: 'Removed event from calendar' }
            }
            task = task_list[action]

            task[:service].new(App.config).call(
              current_account: @current_account,
              calendar_id: cal_id,
              event_data:
            )

            { message: task[:message] }.to_json
          rescue StandardError => e
            routing.halt 500, { message: "Could not #{task[:message]}" }.to_json
          end
        end
      end
    end
  end
end
