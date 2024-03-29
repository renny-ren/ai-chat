import { get, post, put, patch, destroy } from "../utils/request"

export function fetchNotifications(page, q = "") {
  return get(`/v1/notifications?page=${page}&q=${q}`)
}

export function fetchMessages(conversationId, page) {
  return get(`/v1/messages?conversation_id=${conversationId}&page=${page}`)
}

export function fetchImages(userId) {
  return get(`/v1/users/${userId}/images`)
}

export function fetchReferrals(userId) {
  return get(`/v1/users/${userId}/referrals`)
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

export function clearConversations() {
  return destroy(`/v1/conversations/clear`)
}

export function fetchUser(id) {
  return get(`/v1/users/${id}`)
}

export function updateUser(id, data) {
  return put(`/v1/users/${id}`, data)
}

export function fetchFakeName() {
  return get("/v1/users/fake_name")
}
