import { get, post, put, patch, destroy } from "../utils/request"

export function fetchNotifications(page) {
  return get(`/v1/notifications?page=${page}`)
}
