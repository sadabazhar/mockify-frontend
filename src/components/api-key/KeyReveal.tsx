import { useState } from 'react';
import { Copy, CheckCheck, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface KeyRevealProps {
  plainTextKey: string;
  label?: string;
}

/**
 * Renders the full API key once (as returned by create/rotate).
 * The key is displayed in a styled box with a copy button.
 * After copying, a "Copied!" state is shown briefly.
 *
 * UX contract: this component must only be mounted once per key lifecycle.
 * Once closed/unmounted, the key is gone. The warning reinforces this.
 */
export function KeyReveal({
  plainTextKey,
  label = 'Your new API key',
}: KeyRevealProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(plainTextKey);
      setCopied(true);
      toast.success('API key copied to clipboard');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Could not copy — please select and copy manually');
    }
  };

  return (
    <div className="space-y-3">
      {/* Warning banner */}
      <div className="flex items-start gap-2.5 rounded-lg border bg-amber-100 border-amber-300 p-3 dark:border-amber-700 dark:bg-amber-950/60">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400" />
        <div className="text-sm text-amber-900 dark:text-amber-200">
          <span className="font-semibold">Copy this key now.</span> For
          security, it will never be shown again after you close this dialog.
        </div>
      </div>

      {/* Key display */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <div className="group relative flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2.5">
          <code className="flex-1 break-all font-mono text-xs leading-relaxed select-all text-foreground">
            {plainTextKey}
          </code>
          <Button
            size="sm"
            variant={copied ? 'secondary' : 'outline'}
            className="shrink-0 h-7 px-2 gap-1.5 text-xs"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <CheckCheck className="h-3 w-3 text-green-600" />
                <span className="text-green-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copy
              </>
            )}
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Use this key in the{' '}
          <code className="font-mono bg-muted px-1 rounded">X-API-Key</code>{' '}
          header or{' '}
          <code className="font-mono bg-muted px-1 rounded">
            Authorization: ApiKey &lt;key&gt;
          </code>
        </p>
      </div>
    </div>
  );
}
