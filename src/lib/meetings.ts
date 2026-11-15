import type { MeetingKind, StudyMode } from "@prisma/client";

const JOIN_WINDOW_MS = 2 * 60 * 60 * 1000;

export function meetingKindLabel(kind: MeetingKind): string {
  switch (kind) {
    case "online":
      return "أونلاين";
    case "hall":
      return "قاعة";
    default: {
      const neverKind: never = kind;
      return neverKind;
    }
  }
}

export function courseAllowsHall(attendance: string): boolean {
  return attendance.includes("حضور");
}

export function studyMode(value: string, allowsHall: boolean): StudyMode {
  return value === "hall" && allowsHall ? "hall" : "online";
}

export function studyModeLabel(mode: StudyMode): string {
  switch (mode) {
    case "online":
      return "أونلاين";
    case "hall":
      return "حضوري";
    default: {
      const neverMode: never = mode;
      return neverMode;
    }
  }
}

export function parseCairoDateTime(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    return null;
  }
  const date = new Date(`${value}:00+02:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function cairoInputValue(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`;
}

export function formatCairo(date: Date): string {
  return new Intl.DateTimeFormat("ar-EG", {
    timeZone: "Africa/Cairo",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function groupSentence(input: {
  groupStartsAt?: string;
  attendance: string;
  seats?: number;
  seatsTaken?: number;
}): string | null {
  if (!input.groupStartsAt) {
    return null;
  }
  const starts = new Date(input.groupStartsAt);
  if (Number.isNaN(starts.getTime())) {
    return null;
  }
  const when = formatCairo(starts);
  const head = `المجموعة الجاية ${when}`;
  if (input.seats == null) {
    return `${head}، ${input.attendance}.`;
  }
  const left = Math.max(0, input.seats - (input.seatsTaken ?? 0));
  if (left === 0) {
    return `${head}، ${input.attendance}. المقاعد اكتملت.`;
  }
  return `${head}، ${input.attendance}. فاضل ${left} من ${input.seats} مقعد.`;
}

export function canJoinMeeting(startsAt: Date, now = new Date()): boolean {
  return now.getTime() <= startsAt.getTime() + JOIN_WINDOW_MS;
}

export function meetLink(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:" || url.hostname !== "meet.google.com" || url.href.length > 300) {
      return null;
    }
    return url.href;
  } catch {
    return null;
  }
}

export function phoneValue(value: string): string | null {
  const compact = value.trim().replace(/[\s-]/g, "");
  if (!compact) {
    return null;
  }
  return /^\+?[0-9]{8,15}$/.test(compact) ? compact : null;
}
