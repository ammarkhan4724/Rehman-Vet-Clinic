/**
 * Helpers for the JSON-LD schema components in src/components/schema/.
 */

/**
 * Serialize a schema.org object for a <script type="application/ld+json">
 * block. Escapes `<` so a value cannot close the surrounding script tag.
 */
export function serializeJsonLd(schema: Record<string, unknown>): string {
  return JSON.stringify(schema).replace(/</g, '\\u003c');
}

/**
 * Drop keys whose values are undefined / null / empty arrays. Schema.org
 * validators prefer omitted fields over `"foo": null`.
 */
export function compact<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    if (typeof value === 'object' && !Array.isArray(value)) {
      const nested = compact(value as Record<string, unknown>);
      if (Object.keys(nested).length > 0) result[key] = nested;
      continue;
    }
    result[key] = value;
  }
  return result as Partial<T>;
}
