"use client";

import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CopyButton } from "@/components/shared/copy-button";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Eraser, Wand2 } from "lucide-react";

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState("format");
  const [indent, setIndent] = useState("2");

  const processJson = useCallback(
    (text, currentMode, currentIndent) => {
      if (!text.trim()) {
        setOutput("");
        setError("");
        return;
      }

      try {
        const parsed = JSON.parse(text);
        setError("");

        if (currentMode === "format") {
          setOutput(JSON.stringify(parsed, null, Number(currentIndent)));
        } else {
          setOutput(JSON.stringify(parsed));
        }
      } catch (e) {
        setError(e.message);
        setOutput("");
      }
    },
    []
  );

  const handleInputChange = (value) => {
    setInput(value);
    processJson(value, mode, indent);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    processJson(input, newMode, indent);
  };

  const handleIndentChange = (newIndent) => {
    setIndent(newIndent);
    processJson(input, mode, newIndent);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const handleSample = () => {
    const sample = JSON.stringify(
      {
        user: {
          id: "usr_2f8a9b3c",
          name: "Mahesh Pawar",
          email: "mahesh@example.com",
          roles: ["admin", "developer"],
          metadata: {
            created_at: "2025-01-15T10:30:00Z",
            last_login: null,
            preferences: { theme: "dark", notifications: true },
          },
        },
      }
    );
    setInput(sample);
    processJson(sample, mode, indent);
  };

  return (
    <ToolLayout
      name="JSON Formatter"
      description="Format, minify & validate JSON payloads instantly. Paste your JSON and get formatted output in real-time."
      category="format"
    >
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Tabs value={mode} onValueChange={handleModeChange}>
          <TabsList className="h-8">
            <TabsTrigger value="format" className="text-xs px-3 h-6">
              Format
            </TabsTrigger>
            <TabsTrigger value="minify" className="text-xs px-3 h-6">
              Minify
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {mode === "format" && (
          <Select value={indent} onValueChange={handleIndentChange}>
            <SelectTrigger className="h-8 w-28 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 spaces</SelectItem>
              <SelectItem value="4">4 spaces</SelectItem>
              <SelectItem value="1">Tab</SelectItem>
            </SelectContent>
          </Select>
        )}

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
              Input
            </span>
            {input && (
              <Badge variant="secondary" className="text-[10px] h-5">
                {new Blob([input]).size} bytes
              </Badge>
            )}
          </div>
          <Textarea
            placeholder='Paste your JSON here...&#10;&#10;{"key": "value"}'
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            className="min-h-[400px] resize-none rounded-none border-0 font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b px-3 py-2">
            <span className="text-xs font-medium text-muted-foreground">
              Output
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
            <pre className="min-h-[400px] overflow-auto p-4 font-mono text-sm text-foreground whitespace-pre-wrap">
              {output || (
                <span className="text-muted-foreground/50">
                  Formatted output will appear here...
                </span>
              )}
            </pre>
          )}
        </Card>
      </div>
    </ToolLayout>
  );
}
