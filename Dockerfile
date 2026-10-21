FROM ruby:3.1.1-slim-bullseye

RUN apt-get update \
 && apt-get install -y --no-install-recommends build-essential libsodium23 \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV RACK_ENV=production BUNDLE_WITHOUT=development:test

COPY Gemfile Gemfile.lock .ruby-version ./
RUN bundle install

# The React frontend is prebuilt into app/presentation/built (see app/presentation/react)
COPY . .

CMD bundle exec puma -t 5:5 -p ${PORT:-9292} -e production
