"use client";

import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CopyButton } from "@/components/shared/copy-button";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Eraser, Wand2, AlertTriangle, CheckCircle, Clock } from "lucide-react";

function base64UrlDecode(str) {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  try {
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

function getExpiryStatus(payload) {
  if (!payload || !payload.exp) return null;
  const now = Math.floor(Date.now() / 1000);
  const exp = payload.exp;
  const diff = exp - now;

  if (diff < 0) {
    return {
      status: "expired",
      label: `Expired ${formatTimeDiff(Math.abs(diff))} ago`,
    };
  }
  return {
    status: "valid",
    label: `Expires in ${formatTimeDiff(diff)}`,
  };
}

function formatTimeDiff(seconds) {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

function formatTimestamp(ts) {
  if (!ts) return "—";
  return new Date(ts * 1000).toLocaleString();
}

export default function JwtDecoderPage() {
  const [input, setInput] = useState("");
  const [header, setHeader] = useState(null);
  const [payload, setPayload] = useState(null);
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");

  const decode = useCallback((token) => {
    setInput(token);

    if (!token.trim()) {
      setHeader(null);
      setPayload(null);
      setSignature("");
      setError("");
      return;
    }

    const parts = token.trim().split(".");
    if (parts.length !== 3) {
      setError("Invalid JWT: expected 3 parts (header.payload.signature)");
      setHeader(null);
      setPayload(null);
      setSignature("");
      return;
    }

    const decodedHeader = base64UrlDecode(parts[0]);
    const decodedPayload = base64UrlDecode(parts[1]);

    if (!decodedHeader) {
      setError("Failed to decode JWT header");
      return;
    }
    if (!decodedPayload) {
      setError("Failed to decode JWT payload");
      return;
    }

    setHeader(decodedHeader);
    setPayload(decodedPayload);
    setSignature(parts[2]);
    setError("");
  }, []);

  const handleSample = () => {
    // Sample JWT (expired, for demo purposes)
    const sampleHeader = btoa(
      JSON.stringify({ alg: "HS256", typ: "JWT" })
    ).replace(/=/g, "");
    const samplePayload = btoa(
      JSON.stringify({
        sub: "1234567890",
        name: "Mahesh Pawar",
        iat: Math.floor(Date.now() / 1000) - 3600,
        exp: Math.floor(Date.now() / 1000) + 3600,
        iss: "backendkit.dev",
        role: "admin",
      })
    ).replace(/=/g, "");
    const sampleToken = `${sampleHeader}.${samplePayload}.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`;
    decode(sampleToken);
  };

  const handleClear = () => {
    setInput("");
    setHeader(null);
    setPayload(null);
    setSignature("");
    setError("");
  };

  const expiry = getExpiryStatus(payload);

  return (
    <ToolLayout
      name="JWT Decoder"
      description="Decode JWT tokens, inspect header & payload claims, and check expiry — entirely client-side."
      category="auth"
    >
      {/* Controls */}
      <div className="flex items-center gap-2 mb-4">
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

      {/* Token input */}
      <Card className="p-0 overflow-hidden mb-4">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <span className="text-xs font-medium text-muted-foreground">
            JWT Token
          </span>
          {expiry && (
            <Badge
              variant="secondary"
              className={`text-[10px] gap-1 ${
                expiry.status === "expired"
                  ? "border-destructive/20 bg-destructive/10 text-destructive"
                  : "border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400"
              }`}
            >
              {expiry.status === "expired" ? (
                <AlertTriangle className="h-2.5 w-2.5" />
              ) : (
                <CheckCircle className="h-2.5 w-2.5" />
              )}
              {expiry.label}
            </Badge>
          )}
        </div>
        <Textarea
          placeholder="Paste your JWT token here...&#10;&#10;eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0..."
          value={input}
          onChange={(e) => decode(e.target.value)}
          className="min-h-[120px] resize-none rounded-none border-0 font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </Card>

      {error && (
        <div className="mb-4 rounded-md border border-destructive/20 bg-destructive/5 p-3">
          <p className="font-mono text-xs text-destructive">{error}</p>
        </div>
      )}

      {/* Decoded output */}
      {header && payload && (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Header */}
          <Card className="p-0 overflow-hidden">
            <div className="flex items-center justify-between border-b px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Header
                </span>
                <Badge variant="outline" className="text-[10px] h-5">
                  {header.alg || "—"}
                </Badge>
              </div>
              <CopyButton text={JSON.stringify(header, null, 2)} />
            </div>
            <pre className="overflow-auto p-4 font-mono text-sm whitespace-pre-wrap">
              {JSON.stringify(header, null, 2)}
            </pre>
          </Card>

          {/* Payload */}
          <Card className="p-0 overflow-hidden">
            <div className="flex items-center justify-between border-b px-3 py-2">
              <span className="text-xs font-medium text-muted-foreground">
                Payload
              </span>
              <CopyButton text={JSON.stringify(payload, null, 2)} />
            </div>
            <pre className="overflow-auto p-4 font-mono text-sm whitespace-pre-wrap">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </Card>

          {/* Claims summary */}
          <Card className="p-0 overflow-hidden lg:col-span-2">
            <div className="flex items-center border-b px-3 py-2">
              <Clock className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
              <span className="text-xs font-medium text-muted-foreground">
                Token Claims
              </span>
            </div>
            <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
              {[
                { label: "Issued At (iat)", value: formatTimestamp(payload.iat) },
                { label: "Expires (exp)", value: formatTimestamp(payload.exp) },
                { label: "Issuer (iss)", value: payload.iss || "—" },
                { label: "Subject (sub)", value: payload.sub || "—" },
              ].map((claim) => (
                <div
                  key={claim.label}
                  className="bg-card p-3"
                >
                  <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">
                    {claim.label}
                  </p>
                  <p className="font-mono text-xs truncate">{claim.value}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Signature */}
          <Card className="p-0 overflow-hidden lg:col-span-2">
            <div className="flex items-center justify-between border-b px-3 py-2">
              <span className="text-xs font-medium text-muted-foreground">
                Signature
              </span>
              <CopyButton text={signature} />
            </div>
            <pre className="overflow-auto p-4 font-mono text-xs text-muted-foreground break-all whitespace-pre-wrap">
              {signature}
            </pre>
          </Card>
        </div>
      )}
    </ToolLayout>
  );
}
