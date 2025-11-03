import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { FormRenderer } from "@/components/form-renderer/FormRenderer";
import type { Form } from "@/types";

interface PublicFormPageProps {
  params: Promise<{ slug: string }>;
}

async function getFormBySlug(slug: string): Promise<Form | null> {
  const supabase = await createServerSupabase();
  
  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Form;
}

async function checkFormLimits(form: Form): Promise<{ valid: boolean; reason?: string }> {
  const supabase = await createServerSupabase();

  // Vérifier expiresAt
  if (form.settings_json?.expiresAt) {
    const expiresAt = new Date(form.settings_json.expiresAt as string);
    if (expiresAt < new Date()) {
      return { valid: false, reason: "Ce formulaire a expiré" };
    }
  }

  // Vérifier maxResponses
  if (form.settings_json?.maxResponses) {
    const { count } = await supabase
      .from("responses")
      .select("*", { count: "exact", head: true })
      .eq("form_id", form.id);

    const currentCount = count || 0;
    const maxResponses = form.settings_json.maxResponses as number;
    
    if (currentCount >= maxResponses) {
      return { valid: false, reason: "Ce formulaire a atteint le nombre maximum de réponses" };
    }
  }

  return { valid: true };
}

export default async function PublicFormPage({ params }: PublicFormPageProps) {
  const { slug } = await params;
  
  const form = await getFormBySlug(slug);

  if (!form) {
    notFound();
  }

  const limitsCheck = await checkFormLimits(form);

  if (!limitsCheck.valid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Formulaire indisponible</h1>
          <p className="text-muted-foreground">{limitsCheck.reason}</p>
        </div>
      </div>
    );
  }

  return <FormRenderer form={form} />;
}

