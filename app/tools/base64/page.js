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
      name="Base64 Encode & Decode Online"
      description="Free online Base64 encoder and decoder. Encode text to Base64 or decode Base64 to text instantly in your browser - full Unicode support, no server, no tracking."
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
            "@graph": [
              {
                "@type": "WebApplication",
                name: "Base64 Encode & Decode - BackendKit",
                description:
                  "Encode and decode Base64 strings instantly in your browser. Full Unicode support. No data sent to any server.",
                url: "https://backendkit.maheshpawar.me/tools/base64",
                applicationCategory: "DeveloperApplication",
                operatingSystem: "Any",
                offers: { "@type": "Offer", price: "0" },
                featureList: "Free, No signup, Client-side only, Privacy-first",
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "BackendKit",
                    item: "https://backendkit.maheshpawar.me",
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Base64 Encode & Decode",
                    item: "https://backendkit.maheshpawar.me/tools/base64",
                  },
                ],
              },
              {
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "Is Base64 encryption?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "No. Base64 is an encoding scheme, not encryption. Anyone can decode a Base64 string without a key, so never use it to protect sensitive data - use real encryption such as AES-256 instead.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Why is my Base64 output larger than the input?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Base64 encodes every 3 bytes of input into 4 ASCII characters, which adds roughly 33% size overhead. That is the cost of representing binary data in a text-safe format.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Does this Base64 tool send my data to a server?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "No. All encoding and decoding runs entirely in your browser using JavaScript. No data is transmitted over the network - you can verify this in your browser's Network tab.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "What is the difference between Base64 and Base64URL?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Standard Base64 uses + and / and pads with =. Base64URL replaces + and / with - and _ and drops the padding so the result is safe to use in URLs, filenames, and query parameters. JWT tokens use Base64URL.",
                    },
                  },
                ],
              },
            ],
          }),
        }}
      />

      <section className="mt-8 space-y-4 border-t border-border pt-6">
        <h2 className="text-lg font-semibold text-foreground">
          What is Base64 Encoding?
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Base64 is a binary-to-text encoding scheme that represents binary data
          using 64 ASCII characters: the uppercase letters A–Z, the lowercase
          letters a–z, the digits 0–9, and the symbols <code>+</code> and{" "}
          <code>/</code>. It was designed to carry data stored in binary formats
          across channels that only reliably support plain text. This online
          Base64 encoder and decoder converts text to Base64 and decodes Base64
          back to readable text entirely in your browser, with full Unicode
          (UTF-8) support so accented characters, emoji, and non-Latin scripts
          all round-trip correctly.
        </p>

        <h3 className="text-sm font-semibold text-foreground">
          How Base64 Encoding Works
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Base64 splits the input into groups of 3 bytes (24 bits) and then
          re-groups those bits into four 6-bit chunks. Each 6-bit chunk indexes
          into the 64-character alphabet to produce one output character, so
          every 3 bytes become 4 characters - roughly a 33% size increase. When
          the input length is not a multiple of 3, the final group is padded with
          one or two <code>=</code> characters so the output length stays a
          multiple of four.
        </p>

        <h3 className="text-sm font-semibold text-foreground">
          When Do Backend Developers Use Base64?
        </h3>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
          <li>Encoding credentials for HTTP Basic Authentication headers</li>
          <li>Embedding small images or files as data URIs in JSON or HTML</li>
          <li>Decoding Base64-encoded API responses and webhook payloads</li>
          <li>Inspecting the header and payload sections of JWT tokens</li>
          <li>Transmitting binary data through text-only protocols like SMTP</li>
          <li>Storing config values in environment variables or YAML</li>
        </ul>

        <h3 className="text-sm font-semibold text-foreground">
          Base64 vs Base64URL
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Standard Base64 uses <code>+</code> and <code>/</code> as the 63rd and
          64th characters and <code>=</code> for padding. Base64URL replaces
          these with <code>-</code> and <code>_</code> and omits the padding,
          making the output safe to drop into URLs, filenames, and query
          parameters without escaping. JWT tokens encode their header and payload
          segments with Base64URL.
        </p>

        <h3 className="text-sm font-semibold text-foreground">
          Encode &amp; Decode Base64 in Code
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The same conversions this tool performs are one-liners in most
          languages:
        </p>
        <pre className="overflow-auto rounded-md border bg-muted/40 p-3 font-mono text-xs leading-relaxed text-muted-foreground">
          <code>{`# Python
import base64
base64.b64encode(b"hello").decode()      # 'aGVsbG8='
base64.b64decode("aGVsbG8=").decode()    # 'hello'

// Node.js
Buffer.from("hello").toString("base64")           // 'aGVsbG8='
Buffer.from("aGVsbG8=", "base64").toString()      // 'hello'

# Shell (coreutils)
echo -n hello | base64        # aGVsbG8=
echo aGVsbG8= | base64 -d     # hello`}</code>
        </pre>

        <h3 className="text-sm font-semibold text-foreground">How to Use This Tool</h3>
        <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
          <li>
            Choose <strong>Encode</strong> to convert plain text to Base64, or{" "}
            <strong>Decode</strong> to convert Base64 back to text
          </li>
          <li>Paste your input - the result appears instantly as you type</li>
          <li>
            Click <strong>Copy</strong> to grab the output, or{" "}
            <strong>Swap</strong> to reverse the operation
          </li>
        </ol>

        <h3 className="text-sm font-semibold text-foreground">
          Frequently Asked Questions
        </h3>
        <details className="text-sm text-muted-foreground">
          <summary className="font-medium text-foreground cursor-pointer">
            Is Base64 encryption?
          </summary>
          <p className="mt-1 leading-relaxed">
            No. Base64 is an encoding, not encryption. Anyone can decode a Base64
            string without a key. Never use Base64 to protect sensitive data - use
            proper encryption (AES-256, etc.) instead.
          </p>
        </details>
        <details className="text-sm text-muted-foreground">
          <summary className="font-medium text-foreground cursor-pointer">
            Why is my Base64 output larger than the input?
          </summary>
          <p className="mt-1 leading-relaxed">
            Base64 encodes every 3 bytes of input into 4 ASCII characters,
            resulting in roughly 33% size overhead. This is the trade-off for
            representing binary data in a text-safe format.
          </p>
        </details>
        <details className="text-sm text-muted-foreground">
          <summary className="font-medium text-foreground cursor-pointer">
            Does this tool send my data to a server?
          </summary>
          <p className="mt-1 leading-relaxed">
            No. All encoding and decoding runs entirely in your browser using
            JavaScript. No data is transmitted over the network. You can verify
            this by opening your browser&apos;s Network tab.
          </p>
        </details>
        <details className="text-sm text-muted-foreground">
          <summary className="font-medium text-foreground cursor-pointer">
            What is the difference between Base64 and Base64URL?
          </summary>
          <p className="mt-1 leading-relaxed">
            Standard Base64 uses <code>+</code> and <code>/</code> and pads with{" "}
            <code>=</code>. Base64URL replaces them with <code>-</code> and{" "}
            <code>_</code> and drops the padding, making it safe for URLs,
            filenames, and query parameters. JWT tokens use Base64URL.
          </p>
        </details>
      </section>
    </ToolLayout>
  );
}
