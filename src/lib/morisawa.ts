// モリサワ（MORISAWA PASSPORT）で配布される代表的な書体名のパターン。
// queryLocalFonts() はメーカー情報を返さないため、名前ベースの推測になる。
const MORISAWA_PATTERNS = [
  // OpenType 命名規則のベンダープレフィックス（モリサワ製 OTF の慣例）
  /^A-OTF\b/i,
  /^A\s?P-OTF\b/i,
  /^G-OTF\b/i,
  /^U-OTF\b/i,
  // 定番和文書体
  /リュウミン|ryumin/i,
  /新ゴ|shin\s?go/i,
  /中ゴシック|chu\s?go(?!thic)/i,
  /太ゴ|futo\s?go/i,
  /ゴシックMB101|gothic\s?mb101/i,
  /見出ゴ|midashi\s?go/i,
  /見出ミン|midashi\s?min/i,
  /A1明朝|a1\s?mincho/i,
  /じゅん\s?101|jun\s?101/i,
  /解ミン|kaimin/i,
  /秀英/i,
  /shuei/i,
  /筑紫|tsukushi/i,
  /はんなり/i,
  /りょう|ryo\b/i,
  /toppan|凸版/i,
  /丸フォーク|maru\s?folk/i,
  /クレー|klee/i,
  /パルラム|parlam/i,
  /ゴシックMB101/i,
  /タイポス|typos/i,
  /ロダン|rodin/i,
  /スーラ|soulful|soura/i,
  /マティス|matisse/i,
  /セザンヌ|cezanne/i,
  /ゴーシャ|gosha/i,
  /エレガント|elegant\s?min/i,
  /恒星|kosei/i,
  /勘亭流|kanteiryu/i,
  /正楷書|sei\s?kaisho/i,
  /行書|gyosho/i,
  /隷書|reisho/i,
  /毎日|mainichi/i,
  /UD新ゴ|ud\s?shin\s?go/i,
  /UD黒|ud\s?kuro/i,
  /UD明朝|ud\s?mincho/i,
  /UDデジタル|ud\s?digital/i,
  // 欧文書体
  /morisawa/i,
  /\bfolk\b/i,
  /\bbroad\b/i,
  /\btazugane\b|タズガネ/i,
]

export function isMorisawaFont(family: string): boolean {
  return MORISAWA_PATTERNS.some((re) => re.test(family))
}
