# frozen_string_literal: true

module Tripbook
  # Behaviors of the currently logged in account
  class Calendar
    attr_reader :id, :title, # basic info
                :owner, :members, :events, :policies # full details

    def initialize(calendar_info)
      process_attributes(calendar_info['data']['attributes'])
      process_relationships(calendar_info['relationships'])
      process_policies(calendar_info['policies'])
    end

    def to_json(_options = {})
      if members && owner
        {
          id:,
          title:,
          owner: owner.to_json,
          members: members.map(&:to_json),
          events: events.map(&:to_json),
          policies:
        }
      else
        {
          id:,
          title:,
          owner: nil,
          members: nil,
          events: events.map(&:to_json),
          policies:
        }
      end
    end

    private

    def process_attributes(attributes)
      @id = attributes['id']
      @title = attributes['title']
    end

    def process_relationships(relationships)
      return unless relationships

      @owner = Account.new(relationships['owner']['data']['attributes'], '') if relationships['owner']
      @members = process_members(relationships['members']) if relationships['members']
      @events = process_events(relationships['events'])
    end

    def process_policies(policies)
      @policies = policies
    end

    def process_events(events_info)
      return nil unless events_info

      events_info.map { |event_info| Event.new(event_info) }
    end

    def process_members(members)
      return nil unless members

      members.map { |account_info| Account.new(account_info['data']['attributes'], '') }
    end
  end
end
