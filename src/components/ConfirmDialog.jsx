import { useEffect, useRef } from 'react'
import Button from './Button.jsx'
import Alert from './Alert.jsx'

// A modal "Are you sure?" dialog built on the native <dialog> element, which
// gives us focus trapping, Esc-to-close and a backdrop for free.
export default function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel = 'Confirm',
  confirmingLabel,
  isConfirming = false,
  error,
  onConfirm,
  onCancel,
}) {
  // useRef gives direct access to the DOM element, needed to call showModal().
  const dialogRef = useRef(null)

  // Sync the `open` prop with the browser's dialog state.
  useEffect(() => {
    const dialog = dialogRef.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  function handleCancel(event) {
    // Esc fires a "cancel" event. Let React state decide whether to close,
    // and don't allow closing while the action is running.
    event.preventDefault()
    if (!isConfirming) onCancel()
  }

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      aria-labelledby="confirm-dialog-title"
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl bg-white p-6 shadow-xl backdrop:bg-slate-900/50"
    >
      <h2 id="confirm-dialog-title" className="text-lg font-semibold text-slate-900">
        {title}
      </h2>
      <div className="mt-2 text-sm text-slate-600">{children}</div>
      {error && (
        <div className="mt-4">
          <Alert>{error}</Alert>
        </div>
      )}
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={isConfirming}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={onConfirm}
          isLoading={isConfirming}
          loadingText={confirmingLabel}
        >
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  )
}
