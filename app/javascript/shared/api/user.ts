import { get, post, put, patch, destroy } from "../utils/request"

export function fetchNotifications(page, q = "") {
  return get(`/v1/notifications?page=${page}&q=${q}`)
}

export function fetchMessages(conversationId) {
  return get(`/v1/messages?conversation_id=${conversationId}`)
}

export function fetchImages(userId) {
  return get(`/v1/users/${userId}/images`)
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

export function fetchUser(id) {
  return get(`/v1/users/${id}`)
}

export function updateUser(id, data) {
  return put(`/v1/users/${id}`, data)
}
