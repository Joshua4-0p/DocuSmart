import { Check } from "lucide-react"
import { ACCENT_COLORS } from "../../lib/templates/templateSettings"

interface Props {
  value: string
  onChange: (color: string) => void
}

export function AccentColorPicker({ value, onChange }: Props) {
  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {ACCENT_COLORS.map((color) => (
        <button
          key={color.id}
          type="button"
          title={color.label}
          aria-label={color.label}
          aria-pressed={value === color.id ? "true" : "false"}
          onClick={() => onChange(color.id)}
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: color.hex,
            border:
              value === color.id
                ? `2px solid ${color.hex}`
                : "2px solid transparent",
            outline: value === color.id ? `2px solid #fff` : "none",
            outlineOffset: "-4px",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow:
              value === color.id
                ? `0 0 0 3px ${color.hex}55`
                : "0 1px 3px rgba(0,0,0,0.2)",
            transition: "box-shadow 0.15s, outline 0.15s",
          }}
        >
          {value === color.id && (
            <Check size={12} color="#fff" strokeWidth={3} />
          )}
        </button>
      ))}
    </div>
  )
}
