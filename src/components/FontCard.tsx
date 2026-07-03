import type { FontFamily, TypographySettings } from '../types'
import { cn } from '../lib/cn'

interface FontCardProps {
  font: FontFamily
  text: string
  settings: TypographySettings
  picked: boolean
  overlaid: boolean
  overlayColor?: string
  onClick: (e: React.MouseEvent) => void
}

export function FontCard({
  font,
  text,
  settings,
  picked,
  overlaid,
  overlayColor,
  onClick,
}: FontCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group w-full overflow-hidden rounded-md px-3 py-2 text-left transition-colors',
        overlaid
          ? 'bg-amber-500/10'
          : picked
            ? 'bg-indigo-500/15'
            : 'hover:bg-zinc-100 dark:hover:bg-zinc-900',
      )}
    >
      <div className="mb-0.5 flex items-center gap-1.5">
        {overlaid && overlayColor && (
          <span
            className="inline-block h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: overlayColor }}
          />
        )}
        <span
          className={cn(
            'truncate text-[10px] leading-tight',
            picked ? 'text-indigo-500 dark:text-indigo-300' : 'text-zinc-500',
          )}
        >
          {font.family}
        </span>
      </div>
      <p
        className="overflow-hidden whitespace-nowrap text-zinc-900 dark:text-zinc-100"
        style={{
          fontFamily: `"${font.family}"`,
          fontSize: `${settings.fontSize}px`,
          lineHeight: settings.lineHeight,
          letterSpacing: `${settings.letterSpacing}em`,
          fontWeight: settings.fontWeight,
        }}
      >
        {text || 'Type text to compare'}
      </p>
    </button>
  )
}
