export function formatRelativeTime(dateIso: string): string {
  const diffMs = Date.now() - new Date(dateIso).getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function isWithinHours(dateIso: string, hours: number): boolean {
  const eventTime = new Date(dateIso).getTime();
  const cutoff = Date.now() - hours * 60 * 60 * 1000;
  return eventTime >= cutoff;
}

export function formatTimeUTC(dateIso: string): string {
  try {
    const d = new Date(dateIso);
    return d.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  } catch {
    return dateIso;
  }
}
