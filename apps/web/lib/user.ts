export function getInitials(name?: string): string {
  if (!name) return '';

  const parts = name.trim().split(/\s+/); // split on any whitespace
  const first = parts[0]?.charAt(0).toUpperCase() || '';
  const second = parts[1]?.charAt(0).toUpperCase() || '';

  return first + second;
}
