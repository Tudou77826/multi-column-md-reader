export interface Heading {
  id: string;
  level: number;
  text: string;
}

/**
 * Extract headings from markdown content
 * Parses markdown to find h1-h6 headings and generates anchor IDs
 */
export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  const lines = markdown.split('\n');

  for (const line of lines) {
    // Match heading syntax: # Heading, ## Heading, etc.
    const match = line.match(/^#{1,6}\s+(.+)$/);
    if (match) {
      const level = match[0].match(/^#+/)?.[0]?.length || 1;
      const text = match[1].trim();
      // Generate slug for ID (remove special chars, lowercase, replace spaces)
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);

      headings.push({ id, level, text });
    }
  }

  return headings;
}

/**
 * Generate unique IDs by appending counter for duplicates
 */
export function uniqueHeadings(headings: Heading[]): Heading[] {
  const seenIds = new Map<string, number>();

  return headings.map(h => {
    const count = seenIds.get(h.id) || 0;
    seenIds.set(h.id, count + 1);

    return {
      ...h,
      id: count > 0 ? `${h.id}-${count}` : h.id
    };
  });
}