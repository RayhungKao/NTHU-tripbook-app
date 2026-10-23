FROM ruby:3.1.1-slim-bullseye

# Debian 11 (bullseye) is end of life and its packages moved to archive.debian.org
RUN sed -i -e 's|deb.debian.org|archive.debian.org|g' -e 's|security.debian.org|archive.debian.org|g' /etc/apt/sources.list \
 && apt-get update \
 && apt-get install -y --no-install-recommends build-essential libsodium23 \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV RACK_ENV=production BUNDLE_WITHOUT=development:test

COPY Gemfile Gemfile.lock .ruby-version ./
RUN bundle install

# The React frontend is prebuilt into app/presentation/built (see app/presentation/react)
COPY . .

CMD bundle exec puma -t 5:5 -p ${PORT:-9292} -e production
