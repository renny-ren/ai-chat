import { get, post, put, patch, destroy } from "@rails/request.js"

export function fetchAppMessages(params) {
  return get(`/v1/app_messages`)
}

// const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content")
// const response = await axios.get(`/v1/notifications`, {
//   headers: {
//     "X-CSRF-Token": csrf,
//   },
// })
