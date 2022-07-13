# frozen_string_literal: true

require_relative './app'
require 'roda'
require 'rack/ssl-enforcer'
require 'secure_headers'

module Tripbook
  # Configuration for the API
  class App < Roda
    plugin :environments
    plugin :multi_route

    FONT_SRC = %w[https://cdn.jsdelivr.net].freeze
    SCRIPT_SRC = %w[https://cdn.jsdelivr.net].freeze
    STYLE_SRC = %w[https://bootswatch.com https://cdn.jsdelivr.net https://maxcdn.bootstrapcdn.com].freeze
    GOOGLE_SSO_SRC = %w[https://accounts.google.com/o/oauth2/v2/auth].freeze

    configure :production do
      use Rack::SslEnforcer, hsts: true
    end

    ## Uncomment to drop the login session in case of any violation
    # use Rack::Protection, reaction: :drop_session
    use SecureHeaders::Middleware

    SecureHeaders::Configuration.default do |config|
      config.cookies = {
        secure: true,
        httponly: true,
        samesite: {
          lax: true
        }
      }

      config.x_frame_options = 'DENY'
      config.x_content_type_options = 'nosniff'
      config.x_xss_protection = '1'
      config.x_permitted_cross_domain_policies = 'none'
      config.referrer_policy = 'origin-when-cross-origin'

      # NOTE: single-quotes needed around 'self' and 'none' in CSPs
      # rubocop:disable Lint/PercentStringArray
      config.csp = {
        report_only: false,
        preserve_schemes: true,
        default_src: %w['self'],
        child_src: %w['self'],
        connect_src: %w['self'],
        img_src: %w['self'],
        font_src: %w['self'] + FONT_SRC,
        script_src: %w['self'] + SCRIPT_SRC,
        style_src: %w['self'] + STYLE_SRC,
        form_action: %w['self'] + GOOGLE_SSO_SRC,
        frame_ancestors: %w['none'],
        object_src: %w['none'],
        block_all_mixed_content: true,
        report_uri: %w[api/v1/security/report_csp_violation]
      }
      # rubocop:enable Lint/PercentStringArray
    end

    route('security') do |routing|
      # POST security/report_csp_violation
      routing.post 'report_csp_violation' do
        App.logger.warn "CSP VIOLATION: #{request.body.read}"
        { message: 'report_csp_violation receive' }.to_json
      end
    end
  end
end
