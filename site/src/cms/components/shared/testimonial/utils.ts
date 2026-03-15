import type { TemplatePageProps } from "@/cms/types/template-page-props";

import type { Testimonial } from "./type";

/**
 * Safely extracts and transforms testimonials from singleItem data.
 * Returns transformed testimonials or falls back to default TESTIMONIALS.
 */
export function extractTestimonials(key: string,singleItem: TemplatePageProps["singleItem"]): Testimonial[] {
  // Check if singleItem exists and has testimonials array
  if (!singleItem || !(`${key}` in singleItem)) {
    throw new Error(`No singleItem found for key: ${key}`);
  }
  
  const rawTestimonials = singleItem[key];
    
  // Validate testimonials is an array
  if (!Array.isArray(rawTestimonials) || rawTestimonials?.length === 0) {
    throw new Error(`No testimonials found for key: ${key}`);
  }
  
  // Transform and validate each testimonial
  const transformedTestimonials: Testimonial[] = rawTestimonials
    .map((item) => {
      // Validate required fields
      if (!item || typeof item !== "object") {
        return null;
      }
  
      const title = typeof item.title === "string" ? item.title : undefined;
      const testimonial = typeof item.testimonial === "string" ? item.testimonial : undefined;
      const author = typeof item.author === "string" ? item.author : undefined;
        
      // Both title and testimonial are required
      if (!title || !testimonial) {
        return null;
      }
  
      // Parse date if provided
      let date: Date | undefined;
      if (item.date) {
        if (typeof item.date === "string") {
          const parsedDate = new Date(item.date);
          // Validate date is valid
          if (!isNaN(parsedDate.getTime())) {
            date = parsedDate;
          }
        } else if (item.date instanceof Date && !isNaN(item.date.getTime())) {
          date = item.date;
        }
      }
  
      return {
        title,
        testimonial,
        ...(author && { author }),
        ...(date && { date }),
      };
    })
    .filter((testimonial): testimonial is Testimonial => testimonial !== null);
  
  // Return transformed testimonials if valid, otherwise fallback
  return transformedTestimonials.length > 0 ? transformedTestimonials : [];
}
