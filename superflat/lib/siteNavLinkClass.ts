/** Shared styles for home footer nav and thought article top nav. */
export function siteNavLinkClass(active: boolean) {
  const base =
    'inline-block border-0 bg-transparent p-0 cursor-pointer font-sans text-2xl font-semibold leading-tight transition-colors duration-150 text-left'
  if (active) return `${base} text-[var(--brand)]`
  return `${base} text-[var(--muted)] hover:text-[var(--gray)]`
}
