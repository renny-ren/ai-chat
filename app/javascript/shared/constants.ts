const { env } = gon.global_config

export const CDN_HOST = `${env === "production" ? "https://aii-assets.renny.ren" : ""}`
