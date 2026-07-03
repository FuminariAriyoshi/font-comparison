export interface LocalFontData {
  family: string
  fullName: string
  postscriptName: string
  style: string
}

export interface FontFamily {
  family: string
  styles: LocalFontData[]
  source?: 'local' | 'google'
}

export type FontSource = 'local' | 'google' | 'morisawa'

export interface TypographySettings {
  fontSize: number
  lineHeight: number
  letterSpacing: number
  fontWeight: number
}

declare global {
  interface Window {
    queryLocalFonts?: () => Promise<LocalFontData[]>
  }
}
