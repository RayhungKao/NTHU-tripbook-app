// In production the React build is served by the Roda web app itself, so API calls are same-origin
export const baseUrl = process.env.REACT_APP_RUBY_ENV === 'develop' ? 'http://localhost:9292' : ''

// Demo mode lets visitors off campus simulate arriving at each spot (set REACT_APP_DEMO_MODE=false to disable)
export const demoMode = process.env.REACT_APP_DEMO_MODE !== 'false'
