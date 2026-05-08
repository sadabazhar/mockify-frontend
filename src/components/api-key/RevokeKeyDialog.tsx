import { Ban, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRevokeApiKey } from '@/hooks/use-api-key';
import type { ApiKeyResponse } from '@/api/types';

interface RevokeKeyDialogProps {
  orgSlug: string;
  apiKey: ApiKeyResponse;
  open: boolean;
  onClose: () => void;
}

export function RevokeKeyDialog({
  orgSlug,
  apiKey,
  open,
  onClose,
}: RevokeKeyDialogProps) {
  const revokeMutation = useRevokeApiKey(orgSlug);

  const handleRevoke = async () => {
    await revokeMutation.mutateAsync(apiKey.id);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ban className="h-4 w-4 text-destructive" />
            Revoke API Key
          </DialogTitle>
          <DialogDescription>
            Revoke <strong>"{apiKey.name}"</strong>?
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-start gap-3 rounded-lg border border-red-300 bg-red-100 p-3 dark:border-red-700 dark:bg-red-950/60">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-700 dark:text-red-400" />
          <div className="text-sm text-red-900 dark:text-red-200 space-y-1">
            <p className="font-semibold">
              The key will stop working immediately.
            </p>
            <p>
              The key{' '}
              <code className="font-mono text-xs">{apiKey.keyPrefix}</code> will
              be deactivated. It will remain visible in this list but can no
              longer authenticate requests.
            </p>
            <p className="text-red-800/70 dark:text-red-300/70">
              Tip: if this is a leaked key, consider deleting it entirely after
              revoking.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={revokeMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleRevoke}
            disabled={revokeMutation.isPending}
          >
            <Ban className="mr-2 h-4 w-4" />
            {revokeMutation.isPending ? 'Revoking…' : 'Revoke Key'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
