# frozen_string_literal: true

require_relative 'form_base'

module Tripbook
  module Form
    class MemberEmail < Dry::Validation::Contract
      config.messages.load_paths << File.join(__dir__, 'errors/account_details.yml')

      params do
        required(:email).filled(format?: EMAIL_REGEX)
      end
    end
  end
end
