# Tripbook App

Geofenced campus tour web app for NTHU (清華八景): visit the 8 campus spots to unlock them and draw collectible cards.

Please also note the Web API that it uses: https://github.com/RayhungKao/NTHU-tripbook-api

## Install

Install this application by cloning the *relevant branch* and use bundler to install specified gems from `Gemfile.lock`:

```shell
bundle install
```

## Test

This web app does not contain any tests yet :(

## Execute

Copy `config/secrets_example.yml` to `config/secrets.yml` (its keys pair with the API's example secrets), then launch using:

```shell
rake run:dev
```

The application expects the API application to also be running (see `config/secrets.yml` for specifying its URL).
Log in with the demo account `demo` / `tripbook-demo`. On the map, open any spot and press
**Demo：模擬抵達此處** to simulate arriving there without being on campus.

## Frontend

The React app lives in `app/presentation/react` and is built into `app/presentation/built`, which this app serves:

```shell
cd app/presentation/react && npm ci && npm run build
```

Build with `REACT_APP_DEMO_MODE=false` to hide the simulated-arrival buttons. Images are served from
`public/assets` as compressed WebP files.

## Deploy (Render free plan)

`render.yaml` is a Render Blueprint that deploys this app and [the API](https://github.com/RayhungKao/NTHU-tripbook-api)
as two Docker web services. In Render choose **New > Blueprint**, select this repo, and fill in the secrets it asks for:

- API: `DB_KEY` (`rake newkey:db`), `MSG_KEY` (`rake newkey:msg`), `SIGNING_KEY` and `VERIFY_KEY` (`rake newkey:signing`) — run in the API repo
- App: `SESSION_SECRET` (`rake generate:session_secret`), `MSG_KEY` (`rake generate:msg_key`), the API's `SIGNING_KEY`,
  `API_URL` (`https://<api-service>.onrender.com/api/v1`) and `APP_URL` (`https://<app-service>.onrender.com`)

Without Redis the session is kept in an encrypted cookie. Free services sleep when idle, so the first request
after a while can take up to a minute, and the demo data resets on each restart.
