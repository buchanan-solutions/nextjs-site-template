export function decodeSlugArray(
  slug: string[],
  onError: (error: Error) => void
): string[] {
  return slug.map((segment: string) => {
    try {
      return decodeURIComponent(segment);
    } catch (error) {
      // If decoding fails, return the original segment
      // log.warn("Failed to decode slug segment:", { segment, error });
      onError(
        new Error(`Failed to decode slug segment: ${segment} - ${error}`)
      );
      return segment;
    }
  });
}

export function decodeSlugString(
  slug: string[],
  onError: (error: Error) => void
): string {
  return slug
    .map((segment: string) => {
      try {
        return decodeURIComponent(segment);
      } catch (error) {
        // If decoding fails, return the original segment
        // log.warn("Failed to decode slug segment:", { segment, error });
        onError(
          new Error(`Failed to decode slug segment: ${segment} - ${error}`)
        );
        return segment;
      }
    })
    .join("/");
}
