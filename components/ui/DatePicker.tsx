"use client";

import { Popover } from "@base-ui/react/popover";
import { useState } from "react";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  value: string; // YYYY-MM-DD o ""
  onChange: (value: string) => void;
  placeholder?: string;
}

const MONTHS_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const DAYS_ES = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

function buildCalendarGrid(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay  = new Date(year, month + 1, 0);
  // Monday-first: Sun=6, Mon=0, ..., Sat=5
  const startOffset = (firstDay.getDay() + 6) % 7;
  const days: (Date | null)[] = Array(startOffset).fill(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function DatePicker({ value, onChange, placeholder = "Seleccionar fecha" }: Props) {
  const parsed = value ? parseLocalDate(value) : null;
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Date>(() => {
    if (parsed) return new Date(parsed.getFullYear(), parsed.getMonth(), 1);
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const displayValue = parsed
    ? parsed.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })
    : "";

  const days = buildCalendarGrid(view.getFullYear(), view.getMonth());
  const today = toISO(new Date());

  function prevMonth() {
    setView(v => new Date(v.getFullYear(), v.getMonth() - 1, 1));
  }

  function nextMonth() {
    setView(v => new Date(v.getFullYear(), v.getMonth() + 1, 1));
  }

  function selectDay(date: Date) {
    onChange(toISO(date));
    setOpen(false);
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger style={triggerStyle}>
        <CalendarIcon size={14} style={{ color: "var(--color-muted)", flexShrink: 0 }} />
        <span style={{ color: value ? "var(--color-foreground)" : "var(--color-muted)", fontSize: "var(--text-sm)" }}>
          {displayValue || placeholder}
        </span>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner sideOffset={4} align="start">
          <Popover.Popup style={popupStyle}>
            {/* Header mes/año */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <button type="button" onClick={prevMonth} style={navBtnStyle} aria-label="Mes anterior">
                <ChevronLeft size={14} />
              </button>
              <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-foreground)" }}>
                {MONTHS_ES[view.getMonth()]} {view.getFullYear()}
              </span>
              <button type="button" onClick={nextMonth} style={navBtnStyle} aria-label="Mes siguiente">
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Cabeceras de día */}
            <div style={gridStyle}>
              {DAYS_ES.map(d => (
                <span key={d} style={{ textAlign: "center", fontSize: "var(--text-xs)", color: "var(--color-muted)", padding: "2px 0" }}>
                  {d}
                </span>
              ))}
            </div>

            {/* Grid de días */}
            <div style={gridStyle}>
              {days.map((date, i) => {
                if (!date) return <span key={`empty-${i}`} />;
                const iso      = toISO(date);
                const selected = iso === value;
                const isToday  = iso === today;
                return (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => selectDay(date)}
                    className="datepicker-day"
                    data-selected={selected || undefined}
                    data-today={isToday || undefined}
                    aria-label={date.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
                    aria-pressed={selected}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

const triggerStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  background: "var(--color-background)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius)",
  padding: "0.625rem 0.875rem",
  cursor: "pointer",
  outline: "none",
  textAlign: "left",
};

const popupStyle: React.CSSProperties = {
  background: "var(--color-surface-elevated)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-lg)",
  boxShadow: "0 8px 24px oklch(0% 0 0 / 0.4)",
  padding: "1rem",
  width: "256px",
  zIndex: 50,
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: "2px",
  marginBottom: "2px",
};

const navBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "1.75rem",
  height: "1.75rem",
  borderRadius: "var(--radius-sm)",
  border: "none",
  background: "transparent",
  color: "var(--color-muted)",
  cursor: "pointer",
  padding: 0,
};
