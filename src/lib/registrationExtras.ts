import { supabase } from "@/lib/supabase";

export interface LanguageRow {
  name: string;
  proficiency: "Beginner" | "Intermediate" | "Expert" | "Native";
}

export async function saveLanguagesKnown(applicantId: string, languages: LanguageRow[]) {
  await supabase
    .from("applicants")
    .update({ languages_known: languages, updated_at: new Date().toISOString() })
    .eq("id", applicantId);
}

export async function saveEducationLevel(applicantId: string, level: string) {
  await supabase
    .from("applicants")
    .update({ education_level: level, highest_qualification: level, updated_at: new Date().toISOString() })
    .eq("id", applicantId);
}
