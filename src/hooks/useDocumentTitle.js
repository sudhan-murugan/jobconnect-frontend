import { useEffect } from 'react'

// Sets the browser tab title, e.g. useDocumentTitle('Jobs') -> "Jobs · JobConnect".
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · JobConnect` : 'JobConnect'
  }, [title])
}
