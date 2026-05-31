"use client";

import { Select } from "@base-ui/react/select";
import { ChevronDown, Check } from "lucide-react";
import { ESTADOS } from "@/types";
import type { EstadoProyecto } from "@/types";

interface Props {
  value: EstadoProyecto;
  onChange: (value: EstadoProyecto) => void;
}

export function StatusSelect({ value, onChange }: Props) {
  const current = ESTADOS.find(e => e.value === value);

  return (
    <Select.Root
      value={value}
      onValueChange={(v) => v && onChange(v as EstadoProyecto)}
    >
      <Select.Trigger style={triggerStyle}>
        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0 }}>
          <StatusDot color={current?.color} />
          <Select.Value style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} />
        </span>
        <Select.Icon style={{ color: "var(--color-muted)", flexShrink: 0, display: "flex" }}>
          <ChevronDown size={14} />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Positioner sideOffset={4} align="start">
          <Select.Popup style={popupStyle}>
            <Select.List style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
              {ESTADOS.map(e => (
                <Select.Item
                  key={e.value}
                  value={e.value}
                  className="select-item"
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1 }}>
                    <StatusDot color={e.color} />
                    <Select.ItemText style={{ fontSize: "var(--text-sm)", color: "var(--color-foreground)" }}>
                      {e.label}
                    </Select.ItemText>
                  </span>
                  <Select.ItemIndicator style={{ color: "var(--color-accent)", display: "flex" }}>
                    <Check size={12} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}

function StatusDot({ color }: { color?: string }) {
  return (
    <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0, display: "inline-block" }} />
  );
}

const triggerStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.5rem",
  background: "var(--color-background)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius)",
  color: "var(--color-foreground)",
  fontSize: "var(--text-sm)",
  padding: "0.625rem 0.875rem",
  cursor: "pointer",
  outline: "none",
  textAlign: "left",
};

const popupStyle: React.CSSProperties = {
  background: "var(--color-surface-elevated)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius)",
  boxShadow: "0 8px 24px oklch(0% 0 0 / 0.4)",
  padding: "0.25rem",
  minWidth: "200px",
  zIndex: 50,
};
