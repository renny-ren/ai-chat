const currentUser = {
  userMeta() {
    return gon.user_meta
  },

  id() {
    return gon.user_meta.id
  },

  nickname() {
    return gon.user_meta.nickname
  },

  avatarUrl() {
    return gon.user_meta.avatar_url
  },
}

export default currentUser
