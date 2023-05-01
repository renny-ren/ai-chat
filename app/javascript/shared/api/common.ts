import { get, post, put, patch, destroy } from "../utils/request"
import queryString from "query-string"

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

export function fetchModels(queryParams) {
  return get(`/v1/models?${queryString.stringify(queryParams)}`)
}

export function createModel(params) {
  return post("/v1/models", params)
}

export function updateModel(permalink, params) {
  return put(`/v1/models/${permalink}`, params)
}

export function likeModel(permalink) {
  return post(`/v1/models/${permalink}/like`)
}

export function unlikeModel(permalink) {
  return post(`/v1/models/${permalink}/unlike`)
}

export function starModel(permalink) {
  return post(`/v1/models/${permalink}/star`)
}

export function unstarModel(permalink) {
  return post(`/v1/models/${permalink}/unstar`)
}

export function fetchModel(permalink) {
  return get(`/v1/models/${permalink}`)
}

export function deleteModel(permalink) {
  return destroy(`/v1/models/${permalink}`)
}
