/**
 * Editorial date line: "03 Apr 2026" — used on thought detail and homepage list.
 */
export function formatPublishedDate(
  iso: string | undefined | null,
): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
