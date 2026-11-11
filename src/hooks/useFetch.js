import { useCallback, useEffect, useState } from 'react'

/**
 * Loads data when a component mounts, and again whenever `fetcher` changes.
 *
 *   const fetchJob = useCallback((signal) => getJob(id, { signal }), [id])
 *   const { data, error, isLoading, reload } = useFetch(fetchJob)
 *
 * Wrap `fetcher` in useCallback (as above) so it only changes when its inputs
 * change; otherwise it would be a new function on every render and refetch forever.
 *
 * Handles two classic bugs:
 * - Race conditions: if the inputs change while a request is in flight, the old
 *   request is cancelled (AbortController) so a slow, outdated response can
 *   never overwrite newer data.
 * - Updating state after the component has gone: cancelled on unmount too.
 */
export function useFetch(fetcher) {
  const [reloadCount, setReloadCount] = useState(0)
  // Remember WHICH request each result belongs to. While the latest request is
  // still running, the stored result belongs to an older one, so we're loading.
  // (This avoids calling setState synchronously inside the effect.)
  const [result, setResult] = useState({ fetcher: null, reloadCount: -1, data: undefined, error: null })

  useEffect(() => {
    const controller = new AbortController()

    fetcher(controller.signal)
      .then((data) => setResult({ fetcher, reloadCount, data, error: null }))
      .catch((error) => {
        // A cancelled request isn't an error the user needs to see.
        if (controller.signal.aborted) return
        setResult({ fetcher, reloadCount, data: undefined, error })
      })

    // Cleanup runs before the next fetch and on unmount: cancel this request.
    return () => controller.abort()
  }, [fetcher, reloadCount])

  const reload = useCallback(() => setReloadCount((count) => count + 1), [])
  const isLoading = result.fetcher !== fetcher || result.reloadCount !== reloadCount

  // While loading, `data` still holds the previous result, so a list can stay
  // on screen (e.g. dimmed) while the next page loads instead of flashing empty.
  return { data: result.data, error: result.error, isLoading, reload }
}
