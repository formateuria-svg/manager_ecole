import React from 'react';
import { AlertTriangleIcon } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirmer la suppression',
  message






}: {open: boolean;onClose: () => void;onConfirm: () => void;title?: string;message: string;}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex gap-4">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-coral-soft">
          <AlertTriangleIcon className="h-5 w-5 text-coral" />
        </span>
        <p className="pt-1 text-sm text-ink">{message}</p>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            onConfirm();
            onClose();
          }}>
          
          Supprimer
        </Button>
      </div>
    </Modal>);

}