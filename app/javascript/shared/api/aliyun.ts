import { get, post, put, patch, destroy } from "../utils/request"
import CryptoJS from "crypto-js"

export function fetchToken() {
  const parameters = {
    AccessKeyId: process.env.NLSAccessKeyId,
    Action: "CreateToken",
    Format: "JSON",
    RegionId: "cn-shanghai",
    SignatureMethod: "HMAC-SHA1",
    SignatureNonce: URL.createObjectURL(new Blob([])).slice(-36),
    SignatureVersion: "1.0",
    Timestamp: encodeURIComponent(new Date().toISOString()),
    Version: "2019-02-28",
  }
  const requestString = Object.keys(parameters)
    .sort()
    .map((key) => `${key}=${parameters[key]}`)
    .join("&")
  const signatureString = "GET&%2F&" + encodeURIComponent(requestString)
  const signature = CryptoJS.HmacSHA1(signatureString, process.env.NLSAccessKeySecret + "&")
  const signatureBase64 = CryptoJS.enc.Base64.stringify(signature)

  return get(`http://nls-meta.cn-shanghai.aliyuncs.com/?Signature=${encodeURIComponent(signatureBase64)}&${requestString}`)
}
