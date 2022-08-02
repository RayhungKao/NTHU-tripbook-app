# frozen_string_literal: true

require 'roda'
require 'rack/cors'
require 'json'

module Tripbook
  # Web App
  class App < Roda
    # if app is in production mode should not allow cross origin request
    configure :development, :test do
      use Rack::Cors, debug: true, logger: Logger.new($stdout) do
        allowed_methods = %i[get post put delete options head]
        allow do
          origins 'localhost:3001'
          resource '*', headers: :any, methods: allowed_methods, credentials: true
        end
      end
    end
    plugin :public, root: 'app/presentation/built', gzip: true
    plugin :halt
    plugin :multi_route
    plugin :request_headers
    plugin :flash

    route do |routing|
      response['Content-Type'] = 'text/html; charset=utf-8'
      @current_account = CurrentSession.new(session).current_account
      routing.public

      # GET /
      routing.root do
        File.read('app/presentation/built/index.html')
      end

      routing.on ['login', 'register', 'Account', 'logout', 'poi', 'account'] do
        File.read('app/presentation/built/index.html')
      end

      routing.on 'api/v1' do
        routing.multi_route
      end
    end
  end
end
