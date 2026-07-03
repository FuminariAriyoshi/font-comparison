interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit?: string
  onChange: (value: number) => void
}

export function Slider({ label, value, min, max, step, unit = '', onChange }: SliderProps) {
  return (
    <label className="flex min-w-40 flex-col gap-1">
      <span className="flex items-baseline justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <span>{label}</span>
        <span className="tabular-nums text-zinc-800 dark:text-zinc-200">
          {value}
          {unit}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-zinc-300 accent-indigo-500 dark:bg-zinc-700 dark:accent-indigo-400"
      />
    </label>
  )
}
