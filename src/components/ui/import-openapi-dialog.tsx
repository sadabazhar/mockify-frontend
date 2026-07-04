import { useRef, useState } from 'react';
import { Upload, FileText, X, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useImportOpenApi } from '@/hooks/use-open-api';
import type { ImportedSchema, OpenApiImportResponse, SkippedComponent } from '@/api/types';
import { toast } from 'sonner';

interface ImportOpenApiDialogProps {
  orgSlug: string;
  projectSlug: string;
}

export function ImportOpenApiDialog({ orgSlug, projectSlug }: ImportOpenApiDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [importResult, setImportResult] = useState<OpenApiImportResponse | null>(null);
  const [isSkippedExpanded, setIsSkippedExpanded] = useState(false);
  const [isImportedExpanded, setIsImportedExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const importMutation = useImportOpenApi();

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset state on close
      setSelectedFile(null);
      setImportResult(null);
      setIsSkippedExpanded(false);
    }
  };

  const handleFileSelect = (file: File) => {

    const MAX_SIZE = 2 * 1024 * 1024;
    const validTypes = ['.yml', '.yaml', '.json'];
    const isValid = validTypes.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (file.size > MAX_SIZE) {
        toast.error("Maximum file size is 2 MB.");
        return;
    }

    if (!isValid) {
        toast.error(
            "Please select a .yml, .yaml or .json OpenAPI file."
        );
        return;
    }
    
    setSelectedFile(file);
    setImportResult(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleImport = async () => {
    if (!selectedFile) return;
    try {
        const result = await importMutation.mutateAsync({
            file: selectedFile,
            orgSlug,
            projectSlug,
        });

        setImportResult(result);
    } catch {
        // Toast is already handled by the hook if you add onError there.
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setImportResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const hasResult = importResult !== null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Import OpenAPI
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Import OpenAPI Spec</DialogTitle>
          <DialogDescription>
            Upload a <code className="text-xs bg-muted px-1 py-0.5 rounded">.yml</code>,{' '}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">.yaml</code>, or{' '}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">.json</code> OpenAPI file.
            Each component schema will become a Mockify schema.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {!hasResult ? (
            <>
              {/* Drop zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => !selectedFile && fileInputRef.current?.click()}
                className={`
                  relative border-2 border-dashed rounded-lg transition-colors
                  ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50'}
                  ${selectedFile ? 'cursor-default' : 'cursor-pointer'}
                  p-6
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".yml,.yaml,.json"
                  className="hidden"
                  onChange={handleInputChange}
                />

                {selectedFile ? (
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearFile();
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Drop your file here</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        or click to browse
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Result summary */
            <ImportResultSummary
                result={importResult}
                isImportedExpanded={isImportedExpanded}
                isSkippedExpanded={isSkippedExpanded}
                onToggleImported={() =>
                    setIsImportedExpanded(v => !v)
                }
                onToggleSkipped={() =>
                    setIsSkippedExpanded(v => !v)
                }
            />
          )}
        </div>

        <DialogFooter>
          {!hasResult ? (
            <>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={!selectedFile || importMutation.isPending}
              >
                {importMutation.isPending ? 'Importing…' : 'Import'}
              </Button>
            </>
          ) : (
            <Button onClick={() => handleOpenChange(false)}>Done</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Result Summary ────────────────────────────────────────────────────────────

interface ImportResultSummaryProps {
  result: OpenApiImportResponse;
  isImportedExpanded: boolean;
  isSkippedExpanded: boolean;
  onToggleImported: () => void;
  onToggleSkipped: () => void;
}

function ImportResultSummary({
    result,
    isImportedExpanded,
    isSkippedExpanded,
    onToggleImported,
    onToggleSkipped,
}: ImportResultSummaryProps) {
  const {imported, skipped, totalImported, totalSkipped,} = result;

  return (
    <div className="space-y-3">

        {/* Imported count */}
        <div className="rounded-lg border border-green-200 dark:border-green-900 overflow-hidden">
        <button
            className="w-full flex items-center justify-between px-4 py-3 bg-green-50 dark:bg-green-950/30"
            onClick={onToggleImported}
        >
            <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <p className="text-sm font-medium">
                {totalImported} schema{totalImported !== 1 ? "s" : ""} imported successfully
            </p>
            </div>

            {isImportedExpanded ? (
            <ChevronUp className="h-4 w-4" />
            ) : (
            <ChevronDown className="h-4 w-4" />
            )}
        </button>

        {isImportedExpanded && (
            <ImportedList items={imported} />
        )}
        </div>

      {/* Skipped (if any) */}
      {totalSkipped > 0 && (
        <div className="rounded-lg border border-amber-200 dark:border-amber-900 overflow-hidden">
          <button
            className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/50 transition-colors text-left"
            onClick={onToggleSkipped}
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                {totalSkipped} component{totalSkipped !== 1 ? 's' : ''} skipped
              </p>
            </div>
            {isSkippedExpanded ? (
              <ChevronUp className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            ) : (
              <ChevronDown className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            )}
          </button>

          {isSkippedExpanded && (
            <SkippedList items={skipped} />
          )}
        </div>
      )}
    </div>
  );
}

interface ImportedListProps {
  items: ImportedSchema[];
}

function ImportedList({ items }: ImportedListProps) {
  return (
    <ul className="divide-y divide-border max-h-48 overflow-y-auto">
      {items.map((item) => (
        <li
          key={item.id}
          className="px-4 py-2.5 flex items-center gap-3"
        >
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
            {item.name}
          </code>
        </li>
      ))}
    </ul>
  );
}

function SkippedList({ items }: { items: SkippedComponent[] }) {
  return (
    <ul className="divide-y divide-border max-h-48 overflow-y-auto">
      {items.map((item, i) => (
        <li key={i} className="px-4 py-2.5 flex items-start gap-3">
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono mt-0.5 shrink-0">
            {item.component}
          </code>
          <span className="text-xs text-muted-foreground">{item.reason}</span>
        </li>
      ))}
    </ul>
  );
}