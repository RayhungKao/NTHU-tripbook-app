# frozen_string_literal: true

# require 'delegate'
require 'roda'
require 'figaro'
require 'logger'
# require 'rack/ssl-enforcer'
require 'rack/session/redis'
require_relative '../require_app'

require_app('lib')

module Tripbook
  # Configuration for the API
  class App < Roda
    plugin :environments

    # Environment variables setup
    Figaro.application = Figaro::Application.new(
      environment:,
      path: File.expand_path('config/secrets.yml')
    )
    Figaro.load
    def self.config = Figaro.env

    # Logger setup
    LOGGER = Logger.new($stderr)
    def self.logger = LOGGER

    ONE_MONTH = 30 * 24 * 60 * 60

    configure do
      SecureSession.setup(ENV.fetch('REDIS_TLS_URL', nil)) # REDIS_TLS_URL used again below
      SecureMessage.setup(ENV.delete('MSG_KEY'))
      SignedMessage.setup(config)
    end

    configure :production do
      # use Rack::SslEnforcer, hsts: true
      use Rack::Session::Redis,
          expire_after: ONE_MONTH,
          httponly: true,
          same_site: :strict,
          redis_server: {
            url: ENV.delete('REDIS_TLS_URL'),
            ssl_params: { verify_mode: OpenSSL::SSL::VERIFY_NONE }
          }
    end

    configure :development, :test do
      SecureSession.setup(ENV.fetch('REDIS_URL', nil)) # REDIS_URL used again below
      use Rack::Session::Pool, expire_after: ONE_MONTH

      # Allows running reload! in pry to restart entire app
      def self.reload!
        exec 'pry -r ./spec/test_load_all'
      end
    end
  end
end
