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
          <div className="flex items-center justify-between border-b px-3 h-10">
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
          <div className="flex items-center justify-between border-b px-3 h-10">
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Base64 Encode & Decode — BackendKit",
            description:
              "Encode and decode Base64 strings instantly in your browser. Full Unicode support. No data sent to any server.",
            url: "https://backendkit.maheshpawar.me/tools/base64",
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0" },
            featureList:
              "Free, No signup, Client-side only, Privacy-first",
          }),
        }}
      />

      <section className="mt-8 space-y-4 border-t border-border pt-6">
        <h2 className="text-lg font-semibold text-foreground">
          What is Base64 Encoding?
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Base64 converts binary data into a text-safe format using 64 ASCII
          characters. This tool encodes plain text to Base64 and decodes Base64
          back to text, with full Unicode support. Useful whenever you need to
          embed binary data in text-only formats like JSON, XML, or HTTP headers.
        </p>

        <h3 className="text-sm font-semibold text-foreground">
          Common Use Cases
        </h3>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
          <li>Encoding credentials for HTTP Basic Auth headers</li>
          <li>Decoding Base64-encoded API responses or webhook payloads</li>
          <li>Embedding small files or images in JSON or data URIs</li>
          <li>Manually inspecting Base64 parts of a JWT token</li>
        </ul>

        <h3 className="text-sm font-semibold text-foreground">How to Use</h3>
        <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
          <li>Choose Encode or Decode mode</li>
          <li>Paste your text or Base64 string into the input</li>
          <li>Copy the result or use Swap to reverse the operation</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
