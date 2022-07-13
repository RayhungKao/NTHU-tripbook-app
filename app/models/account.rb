# frozen_string_literal: true

module Tripbook
  # Behaviors of the currently logged in account
  class Account
    def initialize(account_info, auth_token, google_auth_token = nil)
      @account_info = account_info
      @auth_token = auth_token
      @google_auth_token = google_auth_token
    end

    attr_reader :account_info, :auth_token, :google_auth_token

    def to_json(_options = {})
      {
        username:,
        email:
      }
    end

    def username
      @account_info ? @account_info['username'] : nil
    end

    def email
      @account_info ? @account_info['email'] : nil
    end

    def logged_out?
      @account_info.nil?
    end

    def logged_in?
      !logged_out?
    end
  end
end
