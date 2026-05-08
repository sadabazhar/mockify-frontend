import { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDeleteApiKey } from '@/hooks/use-api-key';
import type { ApiKeyResponse } from '@/api/types';

interface DeleteKeyDialogProps {
  orgSlug: string;
  apiKey: ApiKeyResponse;
  open: boolean;
  onClose: () => void;
}

/**
 * Hard-delete confirmation.
 * Requires the user to type the key name to confirm, preventing accidental deletion.
 */
export function DeleteKeyDialog({
  orgSlug,
  apiKey,
  open,
  onClose,
}: DeleteKeyDialogProps) {
  const [confirmation, setConfirmation] = useState('');
  const deleteMutation = useDeleteApiKey(orgSlug);

  const isConfirmed = confirmation.trim() === apiKey.name;

  const handleDelete = async () => {
    if (!isConfirmed) return;
    await deleteMutation.mutateAsync(apiKey.id);
    setConfirmation('');
    onClose();
  };

  const handleClose = () => {
    setConfirmation('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-4 w-4" />
            Delete API Key
          </DialogTitle>
          <DialogDescription>
            This will permanently delete <strong>"{apiKey.name}"</strong>. This
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-start gap-3 rounded-lg border border-red-300 bg-red-100 p-3 dark:border-red-700 dark:bg-red-950/60">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-700 dark:text-red-400" />
          <p className="text-sm text-red-900 dark:text-red-200">
            Deleting a key is permanent. All services using{' '}
            <code className="font-mono text-xs">{apiKey.keyPrefix}</code> will
            immediately lose access and the key record will be removed.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Type{' '}
            <span className="font-semibold text-foreground">{apiKey.name}</span>{' '}
            to confirm:
          </p>
          <Input
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder={apiKey.name}
            className="font-mono"
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!isConfirmed || deleteMutation.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {deleteMutation.isPending ? 'Deleting…' : 'Delete Permanently'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
