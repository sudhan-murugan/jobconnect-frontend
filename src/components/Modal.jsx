import { useEffect, useId, useRef } from 'react'

// A modal window built on the native <dialog> element, which gives us focus
// trapping, Esc-to-close and a backdrop for free.
//
// `canClose` = false blocks closing with Esc (e.g. while an upload is running).
export default function Modal({ open, title, onClose, canClose = true, children }) {
  // useRef gives direct access to the DOM element, needed to call showModal().
  const dialogRef = useRef(null)
  const titleId = useId()

  // Sync the `open` prop with the browser's dialog state.
  useEffect(() => {
    const dialog = dialogRef.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  function handleCancel(event) {
    // Esc fires a "cancel" event. Let React state decide whether to close.
    event.preventDefault()
    if (canClose) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      aria-labelledby={titleId}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl backdrop:bg-slate-900/50"
    >
      <h2 id={titleId} className="text-lg font-semibold text-slate-900">
        {title}
      </h2>
      {/* Only render the content while open, so forms start fresh each time. */}
      {open && children}
    </dialog>
  )
}
