
export default function download( filename, href ) {
  const anchor = document.createElement( `a` )
  anchor.href = href
  anchor.download = ``
  anchor.click()
}
