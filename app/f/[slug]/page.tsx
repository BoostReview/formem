import { notFound } from "next/navigation";
import { Metadata } from "next";
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

// Fonction pour extraire la description depuis les blocs welcome
function getFormDescription(form: Form): string {
  const schema = Array.isArray(form.schema_json) ? form.schema_json : [];
  const welcomeBlock = schema.find((block: any) => block.type === "welcome");
  
  if (welcomeBlock?.description) {
    return welcomeBlock.description as string;
  }
  
  if (welcomeBlock?.label) {
    return welcomeBlock.label as string;
  }
  
  // Essayer de trouver un bloc heading ou paragraph
  const headingBlock = schema.find((block: any) => block.type === "heading");
  if (headingBlock?.label) {
    return headingBlock.label as string;
  }
  
  const paragraphBlock = schema.find((block: any) => block.type === "paragraph");
  if (paragraphBlock?.label) {
    return paragraphBlock.label as string;
  }
  
  return `Formulaire: ${form.title}`;
}

// Générer les meta tags pour le SEO et le partage social
export async function generateMetadata({ params }: PublicFormPageProps): Promise<Metadata> {
  const { slug } = await params;
  const form = await getFormBySlug(slug);
  
  if (!form) {
    return {
      title: "Formulaire introuvable",
      description: "Le formulaire que vous recherchez n'existe pas ou n'est plus disponible.",
    };
  }
  
  const title = form.title || "Formulaire";
  const description = getFormDescription(form);
  
  // Construire l'URL du site
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    // En production Vercel, utiliser VERCEL_URL
    if (process.env.VERCEL_URL) {
      siteUrl = `https://${process.env.VERCEL_URL}`;
    } else {
      // Fallback pour le développement
      siteUrl = "http://localhost:3000";
    }
  }
  const formUrl = `${siteUrl}/f/${slug}`;
  
  // Essayer de trouver une image dans le formulaire
  const schema = Array.isArray(form.schema_json) ? form.schema_json : [];
  const imageBlock = schema.find((block: any) => block.type === "image" && block.imageUrl);
  const ogImage = imageBlock?.imageUrl 
    ? (imageBlock.imageUrl as string)
    : `${siteUrl}/og-image.png`; // Image par défaut si disponible
  
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: formUrl,
      siteName: "FormBuilder",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [ogImage],
    },
    alternates: {
      canonical: formUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
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

