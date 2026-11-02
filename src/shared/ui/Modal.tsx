import { useEffect, useId, useRef, type ReactNode } from 'react';

type ModalProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export default function Modal({ open, onClose, title, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-xl bg-white p-0 shadow-xl backdrop:bg-black/50 sm:rounded-2xl"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}>
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-4 sm:mb-5">
          <h2 id={titleId} className="min-w-0 break-words text-lg font-semibold sm:text-xl">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-8 shrink-0 select-none items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:outline-2 focus-visible:outline-indigo-600 active:bg-transparent">
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        {/* Content */}
        {children}
      </div>
    </dialog>
  );
}
