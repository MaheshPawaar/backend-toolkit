"use client";

import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/shared/copy-button";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Eraser, ArrowRightLeft, Wand2 } from "lucide-react";

export default function Base64Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("encode");
  const [error, setError] = useState("");

  const process = useCallback((text, currentMode) => {
    if (!text.trim()) {
      setOutput("");
      setError("");
      return;
    }

    try {
      if (currentMode === "encode") {
        // Handle unicode properly
        const bytes = new TextEncoder().encode(text);
        let binary = "";
        bytes.forEach((b) => (binary += String.fromCharCode(b)));
        setOutput(btoa(binary));
      } else {
        const binary = atob(text.trim());
        const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
        setOutput(new TextDecoder().decode(bytes));
      }
      setError("");
    } catch (e) {
      setError(
        currentMode === "decode"
          ? "Invalid Base64 string"
          : "Failed to encode input"
      );
      setOutput("");
    }
  }, []);

  const handleInputChange = (value) => {
    setInput(value);
    process(value, mode);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    // Swap: put output into input and re-process
    if (output) {
      setInput(output);
      process(output, newMode);
    }
  };

  const handleSwap = () => {
    const newMode = mode === "encode" ? "decode" : "encode";
    setMode(newMode);
    if (output) {
      setInput(output);
      process(output, newMode);
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const handleSample = () => {
    const sample =
      mode === "encode"
        ? '{"api_key": "sk-backendkit-2024", "environment": "production"}'
        : "eyJhcGlfa2V5IjogInNrLWJhY2tlbmRraXQtMjAyNCIsICJlbnZpcm9ubWVudCI6ICJwcm9kdWN0aW9uIn0=";
    setInput(sample);
    process(sample, mode);
  };

  return (
    <ToolLayout
      name="Base64 Codec"
      description="Encode and decode Base64 strings instantly. Supports Unicode characters."
      category="data"
    >
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Tabs value={mode} onValueChange={handleModeChange}>
          <TabsList className="h-8">
            <TabsTrigger value="encode" className="text-xs px-3 h-6">
              Encode
            </TabsTrigger>
            <TabsTrigger value="decode" className="text-xs px-3 h-6">
              Decode
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSwap}
          className="h-8 text-xs gap-1.5"
          disabled={!output}
        >
          <ArrowRightLeft className="h-3 w-3" />
          Swap
        </Button>

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

      {/* Input / Output */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b px-3 py-2">
            <span className="text-xs font-medium text-muted-foreground">
              {mode === "encode" ? "Plain Text" : "Base64 Input"}
            </span>
            {input && (
              <Badge variant="secondary" className="text-[10px] h-5">
                {new Blob([input]).size} bytes
              </Badge>
            )}
          </div>
          <Textarea
            placeholder={
              mode === "encode"
                ? "Type or paste text to encode..."
                : "Paste Base64 string to decode..."
            }
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            className="min-h-[350px] resize-none rounded-none border-0 font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b px-3 py-2">
            <span className="text-xs font-medium text-muted-foreground">
              {mode === "encode" ? "Base64 Output" : "Decoded Text"}
            </span>
            <div className="flex items-center gap-1">
              {output && (
                <Badge variant="secondary" className="text-[10px] h-5 mr-1">
                  {new Blob([output]).size} bytes
                </Badge>
              )}
              <CopyButton text={output} />
            </div>
          </div>
          {error ? (
            <div className="p-4">
              <div className="rounded-md border border-destructive/20 bg-destructive/5 p-3">
                <p className="font-mono text-xs text-destructive">{error}</p>
              </div>
            </div>
          ) : (
            <pre className="min-h-[350px] overflow-auto p-4 font-mono text-sm whitespace-pre-wrap break-all">
              {output || (
                <span className="text-muted-foreground/50">
                  {mode === "encode"
                    ? "Encoded output will appear here..."
                    : "Decoded output will appear here..."}
                </span>
              )}
            </pre>
          )}
        </Card>
      </div>
    </ToolLayout>
  );
}
