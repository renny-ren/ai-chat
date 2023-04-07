import { get, post, put, patch, destroy } from "../utils/request"

export function fetchNotifications(page, q = "") {
  return get(`/v1/notifications?page=${page}&q=${q}`)
}

export function fetchNotificationUnreadCount() {
  return get("/v1/notifications/unread_count")
}

export function readNotification(ids) {
  return post(`/v1/notifications/read`, { ids: ids })
}

export function fetchConversation(id) {
  return get(`/v1/conversations/${id}`)
}
