import { get as _get, post as _post, put as _put, patch, destroy } from "@rails/request.js"

export function get(url, options = {}) {
  return _get(url, { ...options, headers: { Accept: "application/json" } })
}

export function post(url, body, options = {}) {
  return _post(url, { body: body }, options)
}

export function put(url, body, options = {}) {
  return _put(url, { body: body }, options)
}

export { patch, destroy }
