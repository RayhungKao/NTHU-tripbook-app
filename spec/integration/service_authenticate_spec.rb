# frozen_string_literal: true

require_relative '../spec_helper'
require 'webmock/minitest'

describe 'Test Service Objects' do
  before do
    @credentials = { username: 'sekurely', password: 'mypa$$w0rd' }
    @mal_credentials = { username: 'sekurely', password: 'wrongpassword' }
    @api_account = { attributes:
                       { username: 'sekurely', email: 'sekurely@nthu.edu.tw' } }
  end

  after do
    WebMock.reset!
  end

  describe 'Find authenticated account' do
    it 'HAPPY: should find an authenticated account' do
      auth_account_file = 'spec/fixtures/auth_account.json'
      # @credentials = { username: 'sekurely', password: 'mypa$$w0rd' }
      # WebMock.allow_net_connect!
      # response = HTTP.post("#{app.config.API_URL}/auth/authenticate",
      #  body: SignedMessage.sign(@credentials).to_json)
      # auth_account_json = response.body.to_s
      # File.write(auth_account_file, auth_account_json)

      auth_return_json = File.read(auth_account_file)

      WebMock.stub_request(:post, "#{API_URL}/auth/authenticate")
             .with(body: SignedMessage.sign(@credentials).to_json)
             .to_return(body: auth_return_json,
                        headers: { 'content-type' => 'application/json' })

      auth = Tripbook::AuthenticateAccount.new(app.config).call(**@credentials)

      account = auth[:account]
      _(account).wont_be_nil
      _(account['username']).must_equal @api_account[:attributes][:username]
      _(account['email']).must_equal @api_account[:attributes][:email]
    end

    it 'BAD: should not find a false authenticated account' do
      WebMock.stub_request(:post, "#{API_URL}/auth/authenticate")
             .with(body: SignedMessage.sign(@mal_credentials).to_json)
             .to_return(status: 403)

      _(proc {
        Tripbook::AuthenticateAccount.new(app.config).call(**@mal_credentials)
      }).must_raise Tripbook::AuthenticateAccount::UnauthorizedError
    end
  end
end
