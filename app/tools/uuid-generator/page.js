"use client";

import { useState, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CopyButton } from "@/components/shared/copy-button";
import { ToolLayout } from "@/components/shared/tool-layout";
import { useClipboard } from "@/hooks/use-clipboard";
import { RefreshCw, Copy, Plus, Trash2 } from "lucide-react";

function generateUUIDv4() {
  return crypto.randomUUID();
}

function generateUUIDv7() {
  // UUID v7: timestamp-based, sortable
  const now = Date.now();
  const timestamp = now.toString(16).padStart(12, "0");

  const randomBytes = new Uint8Array(10);
  crypto.getRandomValues(randomBytes);

  // Set version (7) and variant (10xx)
  const hex = Array.from(randomBytes, (b) =>
    b.toString(16).padStart(2, "0")
  ).join("");

  return [
    timestamp.slice(0, 8),
    timestamp.slice(8, 12),
    "7" + hex.slice(0, 3),
    ((parseInt(hex.slice(3, 5), 16) & 0x3f) | 0x80)
      .toString(16)
      .padStart(2, "0") + hex.slice(5, 7),
    hex.slice(7, 19),
  ].join("-");
}

export default function UuidGeneratorPage() {
  const [uuids, setUuids] = useState(() => [generateUUIDv4()]);
  const [version, setVersion] = useState("v4");
  const [count, setCount] = useState("1");
  const [uppercase, setUppercase] = useState(false);
  const { copy } = useClipboard();
  const [spinning, setSpinning] = useState(false);

  const generate = useCallback(() => {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 400);
    const num = Math.min(Math.max(1, parseInt(count) || 1), 50);
    const newUuids = Array.from({ length: num }, () => {
      const id = version === "v4" ? generateUUIDv4() : generateUUIDv7();
      return uppercase ? id.toUpperCase() : id;
    });
    setUuids(newUuids);
  }, [version, count, uppercase]);

  const copyAll = () => {
    copy(uuids.join("\n"));
  };

  return (
    <ToolLayout
      name="UUID Generator"
      description="Generate UUID v4 (random) and v7 (timestamp-sortable) identifiers. All generated client-side using Web Crypto API."
      category="data"
    >
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Select value={version} onValueChange={setVersion}>
          <SelectTrigger className="h-8 w-24 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="v4">UUID v4</SelectItem>
            <SelectItem value="v7">UUID v7</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Count:</span>
          <Input
            type="number"
            min="1"
            max="50"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="h-8 w-16 text-xs font-mono"
          />
        </div>

        <button
          onClick={() => setUppercase((p) => !p)}
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
            uppercase
              ? "border-orange-500/30 bg-orange-500/10 text-orange-500"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          UPPERCASE
        </button>

        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyAll}
            className="h-8 text-xs gap-1.5"
            disabled={uuids.length === 0}
          >
            <Copy className="h-3 w-3" />
            Copy All
          </Button>
          <Button
            size="sm"
            onClick={generate}
            className="h-8 text-xs gap-1.5"
          >
            <RefreshCw className={`h-3 w-3 transition-transform ${spinning ? "animate-spin" : ""}`} />
            Generate
          </Button>
        </div>
      </div>

      {/* UUID list */}
      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <span className="text-xs font-medium text-muted-foreground">
            Generated UUIDs
          </span>
          <Badge variant="secondary" className="text-[10px] h-5">
            {version.toUpperCase()} · {uuids.length}{" "}
            {uuids.length === 1 ? "id" : "ids"}
          </Badge>
        </div>
        <div className="divide-y">
          {uuids.map((uuid, i) => (
            <div
              key={`${uuid}-${i}`}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/50 transition-colors group"
            >
              <code className="font-mono text-sm select-all">{uuid}</code>
              <CopyButton text={uuid} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </Card>

      {/* Version info */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-1">UUID v4</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Random-based UUID. 122 bits of randomness from Web Crypto API.
            Best for general-purpose unique identifiers where ordering doesn&apos;t matter.
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-1">UUID v7</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Timestamp-based UUID (RFC 9562). Millisecond precision, naturally
            sortable by creation time. Great for database primary keys.
          </p>
        </Card>
      </div>

      <p className="mt-4 text-xs text-muted-foreground/60">
        Use when you need unique IDs for database records, API keys, or request tracing. v4 for randomness, v7 for sortable timestamps.
      </p>
    </ToolLayout>
  );
}
