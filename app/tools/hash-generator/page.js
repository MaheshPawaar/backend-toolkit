"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CopyButton } from "@/components/shared/copy-button";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Wand2, Eraser, Upload, LoaderCircle } from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ---------------------------------------------------------------------------
// HashRow — one row per algorithm in the output card
// Hashes come from worker as { hex, base64 } strings
// ---------------------------------------------------------------------------
function HashRow({ name, hashData, encoding, uppercase, insecure }) {
  const raw = encoding === "Hex" ? hashData.hex : hashData.base64;
  const value = encoding === "Hex" && uppercase ? raw.toUpperCase() : raw;

  return (
    <div className="flex items-start justify-between px-3 py-2.5 hover:bg-muted/40 transition-colors group border-b last:border-b-0">
      <div className="flex items-center gap-2 shrink-0 mr-3 pt-0.5">
        <span className="text-xs font-medium text-muted-foreground w-16">{name}</span>
        {insecure && (
          <Badge className="text-[10px] h-4 bg-amber-500/10 text-amber-500 border-amber-500/20">
            Insecure
          </Badge>
        )}
      </div>
      <span className="flex-1 font-mono text-sm break-all text-right select-all">
        {value}
      </span>
      <CopyButton text={value} className="ml-2 shrink-0" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Algorithm order + metadata
// ---------------------------------------------------------------------------
const ALGORITHMS = [
  { name: "SHA-256", insecure: false },
  { name: "SHA-384", insecure: false },
  { name: "SHA-512", insecure: false },
  { name: "SHA-1", insecure: true },
  { name: "MD5", insecure: true },
];

const SAMPLE_TEXT = "hello world";
const FILE_WARN_SIZE = 100 * 1024 * 1024; // 100 MB
const FILE_MAX_SIZE = 500 * 1024 * 1024; // 500 MB

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function HashGeneratorPage() {
  const [inputMode, setInputMode] = useState("Text");
  const [input, setInput] = useState("");
  const [encoding, setEncoding] = useState("Hex");
  const [uppercase, setUppercase] = useState(false);
  const [hashes, setHashes] = useState(null);
  const [hashing, setHashing] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [fileWarning, setFileWarning] = useState("");
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef(null);
  const workerRef = useRef(null);

  // Spin up worker on mount
  useEffect(() => {
    workerRef.current = new Worker("/workers/hash.worker.js");
    workerRef.current.onmessage = (e) => {
      setHashing(false);
      if (e.data.error) {
        setHashes(null);
      } else {
        setHashes(e.data.hashes);
      }
    };
    return () => workerRef.current?.terminate();
  }, []);

  // Send buffer to worker
  const runHashes = useCallback((buffer) => {
    if (!buffer || buffer.byteLength === 0) {
      setHashes(null);
      setHashing(false);
      return;
    }
    // Recreate worker to cancel any in-flight work
    workerRef.current?.terminate();
    workerRef.current = new Worker("/workers/hash.worker.js");
    workerRef.current.onmessage = (e) => {
      setHashing(false);
      if (e.data.error) {
        setHashes(null);
      } else {
        setHashes(e.data.hashes);
      }
    };
    setHashing(true);
    workerRef.current.postMessage(buffer, [buffer]);
  }, []);

  // Re-hash on text input change
  const handleTextInput = useCallback(
    (text) => {
      setInput(text);
      if (!text) {
        setHashes(null);
        setHashing(false);
        return;
      }
      const buffer = new TextEncoder().encode(text).buffer;
      runHashes(buffer);
    },
    [runHashes]
  );

  // Read file and hash it
  const handleFile = useCallback(
    (file) => {
      if (!file) return;

      setFileWarning("");
      setFileError("");

      // Detect folders by trying to read a tiny slice. Directories fail this.
      const testReader = new FileReader();
      testReader.onerror = () => {
        setFileError("Cannot hash a folder. Please select a file.");
        setFileName(file.name);
        setFileSize(0);
        setHashes(null);
      };
      testReader.onload = () => {
        // Slice read succeeded, it's a real file. Now validate size.
        if (file.size > FILE_MAX_SIZE) {
          setFileError(
            `File is ${formatFileSize(file.size)}. Maximum supported size is ${formatFileSize(FILE_MAX_SIZE)}. Larger files may crash the browser tab.`
          );
          setFileName(file.name);
          setFileSize(file.size);
          setHashes(null);
          return;
        }

        if (file.size > FILE_WARN_SIZE) {
          setFileWarning(
            `Large file (${formatFileSize(file.size)}). Hashing may take a moment and use significant memory.`
          );
        }

        setFileName(file.name);
        setFileSize(file.size);
        const reader = new FileReader();
        reader.onload = (e) => {
          runHashes(e.target.result);
        };
        reader.readAsArrayBuffer(file);
      };
      testReader.readAsArrayBuffer(file.slice(0, 1));
    },
    [runHashes]
  );

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleSample = () => {
    if (inputMode === "File") {
      setInputMode("Text");
    }
    handleTextInput(SAMPLE_TEXT);
  };

  const handleClear = () => {
    handleTextInput("");
    setFileName("");
    setFileSize(0);
    setFileWarning("");
    setFileError("");
    workerRef.current?.terminate();
    workerRef.current = new Worker("/workers/hash.worker.js");
    workerRef.current.onmessage = (e) => {
      setHashing(false);
      if (e.data.error) {
        setHashes(null);
      } else {
        setHashes(e.data.hashes);
      }
    };
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleModeSwitch = (mode) => {
    setInputMode(mode);
    handleTextInput("");
    setFileName("");
    setFileSize(0);
    setFileWarning("");
    setFileError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const byteCount = input ? new TextEncoder().encode(input).length : 0;

  return (
    <ToolLayout
      name="Hash Generator"
      description="Compute SHA-256, SHA-384, SHA-512, SHA-1 and MD5 hashes from text or files. All processing runs entirely in your browser. Nothing is sent to a server."
      category="data"
    >
      {/* Controls bar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Input mode toggle */}
        <div className="flex gap-1">
          <Button
            variant={inputMode === "Text" ? "default" : "outline"}
            size="sm"
            onClick={() => handleModeSwitch("Text")}
            className="h-8 text-xs"
          >
            Text
          </Button>
          <Button
            variant={inputMode === "File" ? "default" : "outline"}
            size="sm"
            onClick={() => handleModeSwitch("File")}
            className="h-8 text-xs"
          >
            File
          </Button>
        </div>

        {/* Encoding select */}
        <Select value={encoding} onValueChange={setEncoding}>
          <SelectTrigger className="h-8 w-28 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Hex">Hex</SelectItem>
            <SelectItem value="Base64">Base64</SelectItem>
          </SelectContent>
        </Select>

        {/* Uppercase toggle — only relevant for Hex */}
        {encoding === "Hex" && (
          <Button
            variant={uppercase ? "default" : "outline"}
            size="sm"
            onClick={() => setUppercase((p) => !p)}
            className="h-8 text-xs"
          >
            UPPERCASE
          </Button>
        )}

        {/* Sample + Clear */}
        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSample}
            className="h-8 text-xs gap-1.5"
          >
            <Wand2 className="h-3 w-3" />
            Sample
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="h-8 text-xs gap-1.5"
          >
            <Eraser className="h-3 w-3" />
            Clear
          </Button>
        </div>
      </div>

      {/* Input section */}
      {inputMode === "Text" ? (
        <Card className="p-0 !py-0 !gap-0 overflow-hidden mb-4">
          <div className="flex items-center justify-between border-b px-3 h-10">
            <span className="text-xs font-medium text-muted-foreground">
              Input
            </span>
            {input && (
              <Badge variant="secondary" className="text-[10px] h-5">
                {byteCount} {byteCount === 1 ? "byte" : "bytes"}
              </Badge>
            )}
          </div>
          <Textarea
            placeholder="Type or paste text to hash…"
            value={input}
            onChange={(e) => handleTextInput(e.target.value)}
            className="h-[200px] resize-none rounded-none border-0 font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0 overflow-auto"
          />
        </Card>
      ) : (
        <Card className="p-0 !py-0 !gap-0 overflow-hidden mb-4">
          <div className="flex items-center justify-between border-b px-3 h-10">
            <span className="text-xs font-medium text-muted-foreground">
              File Input
            </span>
            {fileName && (
              <div className="flex items-center gap-1.5">
                <Badge variant="secondary" className="text-[10px] h-5 max-w-[180px] truncate">
                  {fileName}
                </Badge>
                <Badge variant="secondary" className="text-[10px] h-5">
                  {formatFileSize(fileSize)}
                </Badge>
              </div>
            )}
          </div>

          {/* Drop zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-3 min-h-[140px] cursor-pointer transition-colors ${
              isDragging
                ? "bg-orange-500/5 border-orange-500/40"
                : "hover:bg-muted/40"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileInputChange}
            />
            <div className={`rounded-full p-3 transition-colors ${isDragging ? "bg-orange-500/10" : "bg-muted"}`}>
              <Upload className={`h-5 w-5 transition-colors ${isDragging ? "text-orange-500" : "text-muted-foreground"}`} />
            </div>
            {fileName ? (
              <div className="text-center">
                <p className="text-sm font-medium">{fileName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatFileSize(fileSize)} · Click or drop to replace
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Drop a file here or click to browse
                </p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">
                  Any file type · Max {formatFileSize(FILE_MAX_SIZE)} · Processed entirely in your browser
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* File size alerts */}
      {fileError && (
        <div className="rounded-md border border-destructive/20 bg-destructive/5 p-3 mb-4">
          <p className="text-xs text-destructive">{fileError}</p>
        </div>
      )}
      {fileWarning && !fileError && (
        <div className="rounded-md border border-amber-500/20 bg-amber-500/5 p-3 mb-4">
          <p className="text-xs text-amber-500">{fileWarning}</p>
        </div>
      )}

      {/* Output — all hashes in one card */}
      <Card className="p-0 !py-0 !gap-0 overflow-hidden">
        <div className="flex items-center justify-between border-b px-3 h-10">
          <span className="text-xs font-medium text-muted-foreground">
            Hashes
          </span>
          <Badge variant="secondary" className="text-[10px] h-5">
            {encoding}{encoding === "Hex" && uppercase ? " · uppercase" : ""}
          </Badge>
        </div>

        {hashing ? (
          <div className="flex items-center justify-center gap-2 min-h-[180px]">
            <LoaderCircle className="h-4 w-4 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground/50">
              Hashing…
            </p>
          </div>
        ) : hashes ? (
          <div>
            {ALGORITHMS.map(({ name, insecure }) => (
              <HashRow
                key={name}
                name={name}
                hashData={hashes[name]}
                encoding={encoding}
                uppercase={uppercase}
                insecure={insecure}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[180px]">
            <p className="text-sm text-muted-foreground/50">
              {inputMode === "Text"
                ? "Start typing to see hashes…"
                : "Select or drop a file to see hashes…"}
            </p>
          </div>
        )}
      </Card>

      <p className="mt-4 text-xs text-muted-foreground/60">
        SHA-256 and above are recommended for integrity verification. SHA-1 and
        MD5 are cryptographically broken. Use only for legacy compatibility or
        non-security checksums.
      </p>
    </ToolLayout>
  );
}
