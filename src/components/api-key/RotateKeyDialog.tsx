import { useState } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRotateApiKey } from '@/hooks/use-api-key';
import { KeyReveal } from './KeyReveal';
import type { ApiKeyResponse, CreateApiKeyResult } from '@/api/types';
import { toast } from 'sonner';

interface RotateKeyDialogProps {
  orgSlug: string;
  apiKey: ApiKeyResponse;
  open: boolean;
  onClose: () => void;
}

export function RotateKeyDialog({
  orgSlug,
  apiKey,
  open,
  onClose,
}: RotateKeyDialogProps) {
  const [revealResult, setRevealResult] = useState<CreateApiKeyResult | null>(
    null,
  );
  const rotateMutation = useRotateApiKey(orgSlug);

  const handleRotate = async () => {
    const result = await rotateMutation.mutateAsync(apiKey.id);
    setRevealResult(result);
    toast.success('API key rotated — old key is now invalid');
  };

  const handleClose = () => {
    setRevealResult(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-lg">
        {revealResult ? (
          /* Step 2: show new key */
          <>
            <DialogHeader>
              <DialogTitle>Key Rotated</DialogTitle>
              <DialogDescription>
                <strong>{apiKey.name}</strong> now uses a new secret. The old
                key is invalid.
              </DialogDescription>
            </DialogHeader>
            <KeyReveal
              plainTextKey={revealResult.apiKey}
              label="New API key — copy it now"
            />
            <DialogFooter>
              <Button onClick={handleClose}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          /* Step 1: confirmation */
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Rotate API Key
              </DialogTitle>
              <DialogDescription>
                You are about to rotate <strong>"{apiKey.name}"</strong>.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-start gap-3 rounded-lg border border-orange-300 bg-orange-100 p-3 dark:border-orange-700 dark:bg-orange-950/60">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-700 dark:text-orange-400" />
              <div className="text-sm text-orange-900 dark:text-orange-200 space-y-1">
                <p className="font-semibold">This action is immediate.</p>
                <p>
                  The current key (
                  <code className="font-mono text-xs">{apiKey.keyPrefix}</code>)
                  will stop working instantly. Any service using this key must
                  be updated with the new value.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={rotateMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRotate}
                disabled={rotateMutation.isPending}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {rotateMutation.isPending ? 'Rotating…' : 'Rotate Key'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
