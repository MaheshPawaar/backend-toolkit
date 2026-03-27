'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ToolLayout } from '@/components/shared/tool-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, Upload, Wand2, Eraser } from 'lucide-react';
import { CopyButton } from '@/components/shared/copy-button';

const SAMPLE = `[
  { "id": 1, "name": "Alice", "role": "engineer", "active": true },
  { "id": 2, "name": "Bob", "role": "designer", "active": false },
  { "id": 3, "name": "Carol", "role": "engineer", "active": true }
]`;

export default function JsonCsvPage() {
  const [input, setInput] = useState('');
  const [csv, setCsv] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const workerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    workerRef.current = new Worker('/workers/json-to-csv.worker.js');
    workerRef.current.onmessage = (e) => {
      setLoading(false);
      if (e.data.error) {
        setError(e.data.error);
        setCsv('');
      } else {
        setCsv(e.data.csv);
        setError('');
      }
    };
    return () => workerRef.current.terminate();
  }, []);

  const handleInput = useCallback((val) => {
    setInput(val);
    setError('');
    setCsv('');

    if (!val.trim()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    workerRef.current.terminate();
    workerRef.current = new Worker('/workers/json-to-csv.worker.js');
    workerRef.current.onmessage = (e) => {
      setLoading(false);
      if (e.data.error) {
        setError(e.data.error);
        setCsv('');
      } else {
        setCsv(e.data.csv);
        setError('');
      }
    };
    workerRef.current.postMessage(val);
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => handleInput(ev.target.result);
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDownload = () => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      name="JSON to CSV"
      category="data"
      description="Convert JSON arrays to CSV instantly. Paste or upload a file — handles large datasets without freezing."
    >
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleUpload}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current.click()}
          className="h-8 text-xs gap-1.5"
        >
          <Upload className="h-3 w-3" />
          Upload JSON
        </Button>
        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleInput(SAMPLE)}
            className="h-8 text-xs gap-1.5"
          >
            <Wand2 className="h-3 w-3" />
            Sample
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleInput('')}
            className="h-8 text-xs gap-1.5"
          >
            <Eraser className="h-3 w-3" />
            Clear
          </Button>
        </div>
      </div>

      {/* Input / Output */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Input */}
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b px-3 h-10">
            <span className="text-xs font-medium text-muted-foreground">
              JSON Input
            </span>
            {input && (
              <Badge variant="secondary" className="text-[10px] h-5">
                {new Blob([input]).size} bytes
              </Badge>
            )}
          </div>
          <Textarea
            placeholder={'Paste a JSON array here...\n\n[{"key": "value"}]'}
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            className="h-[500px] resize-none rounded-none border-0 font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0 overflow-auto"
          />
        </Card>

        {/* Output */}
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b px-3 h-10">
            <span className="text-xs font-medium text-muted-foreground">
              CSV Output
            </span>
            <div className="flex items-center gap-1">
              {csv && (
                <>
                  <Badge variant="secondary" className="text-[10px] h-5 mr-1">
                    {new Blob([csv]).size} bytes
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownload}
                    className="h-7 text-xs gap-1.5 px-2"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </Button>
                  <CopyButton text={csv} />
                </>
              )}
            </div>
          </div>

          {loading ? (
            <div className="h-[500px] p-4 space-y-2.5">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : error ? (
            <div className="p-4">
              <div className="rounded-md border border-destructive/20 bg-destructive/5 p-3">
                <p className="font-mono text-xs text-destructive">{error}</p>
              </div>
            </div>
          ) : (
            <pre className="h-[500px] overflow-auto p-4 font-mono text-sm text-foreground whitespace-pre-wrap">
              {csv || (
                <span className="text-muted-foreground/50">
                  CSV output will appear here...
                </span>
              )}
            </pre>
          )}
        </Card>
      </div>
      <p className="mt-4 text-xs text-muted-foreground/60">
        Use when exporting API responses to spreadsheets, converting database dumps, or sharing structured data with non-technical teammates.
      </p>
    </ToolLayout>
  );
}
