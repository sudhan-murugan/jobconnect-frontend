import Modal from './Modal.jsx'
import Button from './Button.jsx'
import Alert from './Alert.jsx'

// An "Are you sure?" dialog for destructive actions.
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
  return (
    <Modal open={open} title={title} onClose={onCancel} canClose={!isConfirming}>
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
        <Button variant="danger" onClick={onConfirm} isLoading={isConfirming} loadingText={confirmingLabel}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
