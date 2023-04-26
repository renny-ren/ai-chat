import { get, post, put, patch, destroy } from "../utils/request"

export function fetchAppMessages(params) {
  return get("/v1/app_messages")
}

export function fetchAppMessage(id) {
  return get(`/v1/app_messages/${id}`)
}

export function createAppMessage(params) {
  return post("/v1/app_messages", params)
}

export function updateAppMessage(id, params) {
  return put(`/v1/app_messages/${id}`, params)
}

export function pushMessage(id) {
  return post(`/v1/app_messages/${id}/push`)
}

export function fetchModels() {
  return get(`/v1/models`)
}

export function createModel(params) {
  return post("/v1/models", params)
}

export function fetchModel(permalink) {
  return get(`/v1/models/${permalink}`)
}
