"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/shared/tool-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CopyButton } from "@/components/shared/copy-button";
import { Wand2, Eraser } from "lucide-react";

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

/** Returns the day number within the year (1–366). */
function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/** Returns the ISO 8601 week number (1–53). */
function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number, Sunday = 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

/** Returns true if the given year is a leap year. */
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** Returns a human-readable relative time string using Intl.RelativeTimeFormat. */
function getRelativeTime(date) {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const diffMs = date.getTime() - Date.now();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHr / 24);
  const diffWeek = Math.round(diffDay / 7);
  const diffMonth = Math.round(diffDay / 30.44);
  const diffYear = Math.round(diffDay / 365.25);

  if (Math.abs(diffSec) < 60) return rtf.format(diffSec, "second");
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, "minute");
  if (Math.abs(diffHr) < 24) return rtf.format(diffHr, "hour");
  if (Math.abs(diffDay) < 7) return rtf.format(diffDay, "day");
  if (Math.abs(diffWeek) < 5) return rtf.format(diffWeek, "week");
  if (Math.abs(diffMonth) < 12) return rtf.format(diffMonth, "month");
  return rtf.format(diffYear, "year");
}

/** Returns the total number of days in the year for a given date. */
function getDaysInYear(year) {
  return isLeapYear(year) ? 366 : 365;
}

/** Returns the user's local timezone name (IANA string, e.g. "America/New_York"). */
function getUserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/** Formats a Date object with timezone abbreviation shown in parentheses. */
function formatLocalTime(date) {
  const formatted = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  }).format(date);
  return formatted;
}

/** Detects whether an input string likely represents milliseconds. */
function detectUnit(raw) {
  const trimmed = raw.trim().replace(/^-/, "");
  // 13+ digit number → milliseconds; <= 10 digits → seconds
  return trimmed.length >= 13 ? "ms" : "s";
}

/** Returns padded zero string. */
function pad(n, len = 2) {
  return String(n).padStart(len, "0");
}

const MONTHS = [
  { value: "1", label: "01 – Jan" },
  { value: "2", label: "02 – Feb" },
  { value: "3", label: "03 – Mar" },
  { value: "4", label: "04 – Apr" },
  { value: "5", label: "05 – May" },
  { value: "6", label: "06 – Jun" },
  { value: "7", label: "07 – Jul" },
  { value: "8", label: "08 – Aug" },
  { value: "9", label: "09 – Sep" },
  { value: "10", label: "10 – Oct" },
  { value: "11", label: "11 – Nov" },
  { value: "12", label: "12 – Dec" },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** A single output row: label on the left, monospace value + copy button right. */
function OutputRow({ label, value, mono = true }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 hover:bg-muted/40 transition-colors group border-b last:border-b-0">
      <span className="text-xs text-muted-foreground shrink-0 mr-3">{label}</span>
      <span className={`flex-1 text-sm truncate text-right ${mono ? "font-mono" : ""}`}>
        {value}
      </span>
      <CopyButton text={value} className="ml-2 shrink-0" />
    </div>
  );
}

/** Info row without copy button (for supplementary metadata). */
function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 border-b last:border-b-0">
      <span className="text-xs text-muted-foreground shrink-0 mr-3">{label}</span>
      <span className="flex-1 text-sm font-mono text-right">{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export default function TimestampPage() {
  // -- Live clock --
  const [now, setNow] = useState(() => new Date());

  // -- Timestamp → Date section --
  const [tsInput, setTsInput] = useState("");
  // "Auto" | "Seconds" | "Milliseconds"
  const [unitOverride, setUnitOverride] = useState("Auto");

  // -- Date → Timestamp section --
  const [userTz, setUserTz] = useState("");

  useEffect(() => {
    setUserTz(getUserTimezone());
  }, []);
  const [dtYear, setDtYear] = useState(() => String(new Date().getFullYear()));
  const [dtMonth, setDtMonth] = useState(() => String(new Date().getMonth() + 1));
  const [dtDay, setDtDay] = useState(() => String(new Date().getDate()));
  const [dtHour, setDtHour] = useState("0");
  const [dtMinute, setDtMinute] = useState("0");
  const [dtSecond, setDtSecond] = useState("0");
  const [dtTimezone, setDtTimezone] = useState("UTC");

  // -- Tick the live clock every second --
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const autoDetectedUnit = useMemo(
    () => (tsInput.trim() ? detectUnit(tsInput.trim()) : null),
    [tsInput]
  );

  // Validate and compute error
  const tsResult = useMemo(() => {
    if (!tsInput.trim()) return { error: null, date: null };

    const raw = tsInput.trim();
    if (!raw.match(/^-?\d+(\.\d+)?$/)) {
      return { error: "Invalid input: enter a numeric Unix timestamp.", date: null };
    }

    const num = Number(raw);
    if (isNaN(num)) {
      return { error: "Invalid input: enter a numeric Unix timestamp.", date: null };
    }

    const effectiveUnit =
      unitOverride === "Auto" ? detectUnit(raw) : (unitOverride === "Milliseconds" ? "ms" : "s");
    const ms = effectiveUnit === "ms" ? num : num * 1000;
    const date = new Date(ms);

    if (isNaN(date.getTime())) {
      return { error: "Timestamp is out of range or invalid.", date: null };
    }

    return { error: null, date, effectiveUnit };
  }, [tsInput, unitOverride]);

  // ---------------------------------------------------------------------------
  // Derived: Date → Timestamp conversion
  // ---------------------------------------------------------------------------
  const dtResult = useMemo(() => {
    const year = parseInt(dtYear, 10);
    const month = parseInt(dtMonth, 10) - 1; // 0-indexed
    const day = parseInt(dtDay, 10);
    const hour = parseInt(dtHour, 10);
    const minute = parseInt(dtMinute, 10);
    const second = parseInt(dtSecond, 10);

    if (
      isNaN(year) ||
      isNaN(month) ||
      isNaN(day) ||
      isNaN(hour) ||
      isNaN(minute) ||
      isNaN(second)
    ) {
      return null;
    }

    let ms;
    if (!dtTimezone || dtTimezone === "UTC") {
      ms = Date.UTC(year, month, day, hour, minute, second);
    } else {
      // Local timezone: construct via string with timezone name
      // Use Intl to get the UTC offset for the user's tz at this date
      const dateStr = `${pad(year, 4)}-${pad(month + 1)}-${pad(day)}T${pad(hour)}:${pad(minute)}:${pad(second)}`;
      // Create a date string that we interpret as local time
      const localDate = new Date(dateStr);
      ms = localDate.getTime();
    }

    if (isNaN(ms)) return null;

    const epochSeconds = Math.floor(ms / 1000);
    const epochMs = ms;
    return { epochSeconds, epochMs };
  }, [dtYear, dtMonth, dtDay, dtHour, dtMinute, dtSecond, dtTimezone]);

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------
  const handleSample = useCallback(() => {
    setTsInput("1711612800");
    setUnitOverride("Auto");
  }, []);

  const handleClear = useCallback(() => {
    setTsInput("");
    setUnitOverride("Auto");
    const d = new Date();
    setDtYear(String(d.getFullYear()));
    setDtMonth(String(d.getMonth() + 1));
    setDtDay(String(d.getDate()));
    setDtHour("0");
    setDtMinute("0");
    setDtSecond("0");
    setDtTimezone("UTC");
  }, []);

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------

  // Is the timestamp the Y2K38 sentinel?
  const isY2K38 = tsInput.trim() !== "" && Math.abs(Number(tsInput.trim()) - 2147483647) <= 100;

  const isNegative =
    tsInput.trim().startsWith("-") && !tsResult.error && tsResult.date !== null;

  const autoSwitchedToMs =
    unitOverride === "Auto" && autoDetectedUnit === "ms" && tsInput.trim() !== "";

  // ---------------------------------------------------------------------------
  return (
    <ToolLayout
      name="Unix Timestamp Converter"
      description="Convert Unix timestamps to human-readable dates and vice versa. All conversions run client-side in your browser."
      category="data"
    >
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
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

      {/* ------------------------------------------------------------------ */}
      {/* Section 1: Live Now Clock                                            */}
      {/* ------------------------------------------------------------------ */}
      <Card className="p-0 !py-0 !gap-0 overflow-hidden mb-6">
        <div className="flex items-center justify-between border-b px-3 h-10">
          <span className="text-xs font-medium text-muted-foreground">
            Current Unix Time
          </span>
          <Badge variant="secondary" className="text-[10px] h-5">
            Live
          </Badge>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 px-4 py-3">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-semibold tabular-nums text-orange-500">
              {Math.floor(now.getTime() / 1000)}
            </span>
            <span className="text-xs text-muted-foreground">seconds</span>
            <CopyButton text={String(Math.floor(now.getTime() / 1000))} />
          </div>
          <div className="flex items-baseline gap-2 text-muted-foreground">
            <span className="font-mono text-sm tabular-nums">
              {now.toUTCString()}
            </span>
          </div>
        </div>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* Section 2: Timestamp → Date                                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <span>Timestamp to Date</span>
          <span className="flex-1 h-px bg-border" />
        </h2>

        {/* Input row */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Input
            type="text"
            inputMode="numeric"
            placeholder="Paste a Unix timestamp, e.g. 1711612800"
            value={tsInput}
            onChange={(e) => setTsInput(e.target.value)}
            className={`h-9 font-mono text-sm flex-1 min-w-0 ${
              tsResult.error
                ? "border-destructive/40 bg-destructive/5 focus-visible:ring-destructive/30"
                : ""
            }`}
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs text-muted-foreground">Unit:</span>
            <Select value={unitOverride} onValueChange={setUnitOverride}>
              <SelectTrigger className="h-9 w-32 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Auto">Auto</SelectItem>
                <SelectItem value="Seconds">Seconds</SelectItem>
                <SelectItem value="Milliseconds">Milliseconds</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Contextual alerts */}
        {tsResult.error && (
          <div className="rounded-md border border-destructive/20 bg-destructive/5 p-3 mb-3">
            <p className="font-mono text-xs text-destructive">{tsResult.error}</p>
          </div>
        )}
        {!tsResult.error && autoSwitchedToMs && (
          <div className="rounded-md border border-blue-500/20 bg-blue-500/5 p-3 mb-3">
            <p className="text-xs text-blue-500">
              Auto-detected as <strong>milliseconds</strong> (13+ digits). Toggle the unit selector to override.
            </p>
          </div>
        )}
        {!tsResult.error && isNegative && (
          <div className="rounded-md border border-amber-500/20 bg-amber-500/5 p-3 mb-3">
            <p className="text-xs text-amber-500">
              Negative timestamp. This date is before the Unix epoch (January 1, 1970 UTC).
            </p>
          </div>
        )}
        {!tsResult.error && isY2K38 && (
          <div className="rounded-md border border-amber-500/20 bg-amber-500/5 p-3 mb-3">
            <p className="text-xs text-amber-500">
              <strong>Y2K38 sentinel:</strong> 2147483647 is the maximum value for a 32-bit signed integer.
              Systems storing timestamps in a 32-bit int will overflow on January 19, 2038 at 03:14:07 UTC.
            </p>
          </div>
        )}

        {/* Output: formatted dates */}
        {tsResult.date && !tsResult.error && (
          <>
            <Card className="p-0 !py-0 !gap-0 overflow-hidden mb-3">
              <div className="flex items-center justify-between border-b px-3 h-10">
                <span className="text-xs font-medium text-muted-foreground">
                  Formatted Date
                </span>
                <Badge variant="secondary" className="text-[10px] h-5">
                  {tsResult.effectiveUnit === "ms" ? "Milliseconds" : "Seconds"}
                </Badge>
              </div>
              <div>
                <OutputRow label="ISO 8601" value={tsResult.date.toISOString()} />
                <OutputRow label="RFC 2822" value={tsResult.date.toUTCString()} />
                <OutputRow
                  label={`Local (${userTz})`}
                  value={formatLocalTime(tsResult.date)}
                />
                <OutputRow
                  label="Relative"
                  value={getRelativeTime(tsResult.date)}
                  mono={false}
                />
              </div>
            </Card>

            {/* Additional info card */}
            <Card className="p-0 !py-0 !gap-0 overflow-hidden">
              <div className="flex items-center border-b px-3 h-10">
                <span className="text-xs font-medium text-muted-foreground">
                  Additional Info
                </span>
              </div>
              <div>
                <InfoRow
                  label="Day of week"
                  value={tsResult.date.toLocaleDateString("en-US", {
                    weekday: "long",
                    timeZone: "UTC",
                  })}
                />
                <InfoRow
                  label="Day of year"
                  value={`${getDayOfYear(tsResult.date)} / ${getDaysInYear(
                    tsResult.date.getUTCFullYear()
                  )}`}
                />
                <InfoRow
                  label="ISO week"
                  value={`Week ${getISOWeek(tsResult.date)}`}
                />
                <InfoRow
                  label="Leap year"
                  value={
                    isLeapYear(tsResult.date.getUTCFullYear()) ? "Yes" : "No"
                  }
                />
              </div>
            </Card>
          </>
        )}

        {/* Empty state */}
        {!tsInput.trim() && (
          <div className="rounded-md border border-dashed px-4 py-8 text-center">
            <p className="text-xs text-muted-foreground/60">
              Enter a Unix timestamp above to see the formatted date, relative time, and more.
            </p>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Section 3: Date → Timestamp                                          */}
      {/* ------------------------------------------------------------------ */}
      <div>
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <span>Date to Timestamp</span>
          <span className="flex-1 h-px bg-border" />
        </h2>

        {/* Date input grid */}
        <Card className="p-0 !py-0 !gap-0 overflow-hidden mb-3">
          <div className="flex items-center justify-between border-b px-3 h-10">
            <span className="text-xs font-medium text-muted-foreground">
              Date &amp; Time
            </span>
          </div>
          <div className="p-3">
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 mb-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-muted-foreground px-0.5">Year</label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={dtYear}
                  onChange={(e) => setDtYear(e.target.value)}
                  className="h-8 font-mono text-xs text-center"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-muted-foreground px-0.5">Month</label>
                <Select value={dtMonth} onValueChange={setDtMonth}>
                  <SelectTrigger className="h-8 text-xs font-mono w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-muted-foreground px-0.5">Day</label>
                <Select value={dtDay} onValueChange={setDtDay}>
                  <SelectTrigger className="h-8 text-xs font-mono w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>{String(i + 1).padStart(2, "0")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-muted-foreground px-0.5">Hour</label>
                <Select value={dtHour} onValueChange={setDtHour}>
                  <SelectTrigger className="h-8 text-xs font-mono w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={String(i)}>{String(i).padStart(2, "0")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-muted-foreground px-0.5">Minute</label>
                <Select value={dtMinute} onValueChange={setDtMinute}>
                  <SelectTrigger className="h-8 text-xs font-mono w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 60 }, (_, i) => (
                      <SelectItem key={i} value={String(i)}>{String(i).padStart(2, "0")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-muted-foreground px-0.5">Second</label>
                <Select value={dtSecond} onValueChange={setDtSecond}>
                  <SelectTrigger className="h-8 text-xs font-mono w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 60 }, (_, i) => (
                      <SelectItem key={i} value={String(i)}>{String(i).padStart(2, "0")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-muted-foreground px-0.5">Timezone</label>
                <Select value={dtTimezone} onValueChange={setDtTimezone}>
                  <SelectTrigger className="h-8 text-xs w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    {userTz && <SelectItem value={userTz}>{userTz}</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Date → Timestamp output */}
        {dtResult && (
          <Card className="p-0 !py-0 !gap-0 overflow-hidden">
            <div className="flex items-center border-b px-3 h-10">
              <span className="text-xs font-medium text-muted-foreground">
                Epoch Output
              </span>
            </div>
            <div>
              <OutputRow
                label="Epoch (seconds)"
                value={String(dtResult.epochSeconds)}
              />
              <OutputRow
                label="Epoch (ms)"
                value={String(dtResult.epochMs)}
              />
            </div>
          </Card>
        )}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Unix Timestamp Converter — BackendKit",
            description:
              "Convert Unix timestamps to human-readable dates and back. Supports seconds and milliseconds, multiple timezones, and real-time clock.",
            url: "https://backendkit.maheshpawar.me/tools/timestamp",
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
          What is Unix Timestamp Converter?
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Unix timestamps count the seconds (or milliseconds) since January 1,
          1970 UTC. This tool converts epoch timestamps to human-readable dates
          and lets you build timestamps from a date picker. It auto-detects
          seconds vs. milliseconds and shows ISO 8601, RFC 2822, relative time,
          and more.
        </p>

        <h3 className="text-sm font-semibold text-foreground">
          Common Use Cases
        </h3>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
          <li>Decoding epoch timestamps from logs and database records</li>
          <li>Generating timestamps for cron jobs and scheduled tasks</li>
          <li>Comparing timestamps across different timezones</li>
          <li>Checking token expiry times from JWT or OAuth responses</li>
        </ul>

        <h3 className="text-sm font-semibold text-foreground">How to Use</h3>
        <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
          <li>Paste a Unix timestamp to see the formatted date</li>
          <li>Or use the date picker to generate a timestamp</li>
          <li>Copy any output value with one click</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
