import { get, post, put, patch, destroy } from "../utils/request"

export function fetchNotifications(page) {
  return get(`/v1/notifications?page=${page}`)
}

export function fetchNotificationUnreadCount() {
  return get("/v1/notifications/unread_count")
}

export function readNotification(ids) {
  return post(`/v1/notifications/read`, { ids: ids })
}
