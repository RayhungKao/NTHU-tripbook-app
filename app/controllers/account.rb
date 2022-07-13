# frozen_string_literal: true

require 'roda'
require_relative './app'

module Tripbook
  # Web controller for Tripbook API
  class App < Roda
    route('account') do |routing|
      routing.on do
        # GET /account
        routing.is do
          if @current_account.logged_in?
            response.status = 200
            { username: @current_account.username, email: @current_account.email,
              auth_token: @current_account.auth_token }.to_json
          else
            response.status = 401
            { message: 'qq' }.to_json
          end
        end
        # GET api/v1/accounts/[username]
        routing.get String do |username|
          account = GetAccountDetails.new(App.config).call(
            @current_account, username
          )
          return { username: account.username, email: account.email, auth_token: account.auth_token }.to_json
        rescue GetAccountDetails::InvalidAccount => e
          response.status = 403
          return { message: e }.to_json
        rescue StandardError => e
          response.status = 500
          return { message: e }.to_json
        end

        # POST /account/<registration_token>
        routing.post String do |registration_token|
          body = JSON.parse(routing.body.read)
          puts body

          password = Form::Passwords.new.call(body)

          puts password.errors(locale: :en).messages

          if password.failure?
            # raise 'Passwords do not match or empty'
            response.status = 401
            return { message: Form.message_values(password) }.to_json
          end

          new_account = SecureMessage.decrypt(registration_token)
          CreateAccount.new(App.config).call(
            email: new_account['email'],
            username: new_account['username'],
            password: body['password']
          )
          flash[:notice] = 'Account created! Please login'
          return { message: 'Account created! Please login' }.to_json
        rescue CreateAccount::InvalidAccount => e
          flash[:error] = e.message
          return { message: flash[:error] }.to_json
        rescue StandardError => e
          flash[:error] = e.message
          routing.redirect(
            "#{App.config.APP_URL}/auth/register/#{registration_token}"
          )
        end
      end
    end
  end
end
