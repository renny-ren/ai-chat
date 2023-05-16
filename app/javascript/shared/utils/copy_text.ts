function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea")
  textArea.value = text

  // Avoid scrolling to bottom
  textArea.style.top = "0"
  textArea.style.left = "0"
  textArea.style.position = "fixed"

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    var successful = document.execCommand("copy")
    var msg = successful ? "successful" : "unsuccessful"
  } catch (err) {
    console.error("Oops, unable to copy: ", err)
  }

  document.body.removeChild(textArea)
}

export const copy = (text) => {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text)
    return
  }
  navigator.clipboard.writeText(text).then(
    function () {
      console.log("copied")
    },
    function (err) {
      console.error("Could not copy text: ", err)
    }
  )
}
