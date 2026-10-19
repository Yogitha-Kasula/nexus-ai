import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://ekhgmdwfsfaffamcgikr.supabase.co";

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVraGdtZHdmc2ZhZmZhbWNnaWtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzOTYyNDMsImV4cCI6MjEwNzk3MjI0M30.eN_SSbaEMLA4SPYn8jW8L2AHJGlNb0t8HFQ70ApiGJs";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface InquiryRecord {
  id?: string | number;
  name: string;
  email: string;
  company: string;
  phone?: string | null;
  service_type: string;
  message: string;
  created_at?: string;
}

/**
 * Saves an inquiry to Supabase.
 * Tries the 'inquiries' table first; if not found, tries 'leads' table.
 */
export async function submitInquiry(data: {
  name: string;
  email: string;
  company: string;
  phone?: string;
  serviceType: string;
  message: string;
}) {
  const payload = {
    name: data.name.trim(),
    email: data.email.trim(),
    company: data.company.trim(),
    phone: data.phone?.trim() || null,
    service_type: data.serviceType,
    message: data.message.trim(),
  };

  // Attempt insert into 'inquiries'
  const firstAttempt = await supabase.from("inquiries").insert([payload]);

  if (!firstAttempt.error) {
    return { success: true, table: "inquiries" };
  }

  // If table 'inquiries' does not exist (relation error 42P01), attempt 'leads'
  if (firstAttempt.error.code === "42P01" || firstAttempt.error.message?.includes("does not exist")) {
    const secondAttempt = await supabase.from("leads").insert([payload]);
    if (!secondAttempt.error) {
      return { success: true, table: "leads" };
    }
  }

  // If there's an error, throw it so UI handles it
  throw new Error(firstAttempt.error.message || "Failed to save inquiry to database");
}
