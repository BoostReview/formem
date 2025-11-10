"use client";

import { OneByOneRenderer } from "./OneByOneRenderer";
import { AllInOneRenderer } from "./AllInOneRenderer";
import { ThemeWrapper } from "./ThemeWrapper";
import { useIframeHeight } from "@/hooks/useIframeHeight";
import { useGoogleFont } from "@/hooks/useGoogleFont";
import type { Form } from "@/types";

interface FormRendererProps {
  form: Form;
}

export function FormRenderer({ form }: FormRendererProps) {
  // Hook pour auto-height dans iframe
  const containerRef = useIframeHeight();

  // Appliquer le thème global
  const theme = form.theme_json || {};
  const fontFamily = theme.fonts?.family || "Inter";
  
  // Charger dynamiquement la police Google Fonts
  useGoogleFont(fontFamily);

  return (
    <div ref={containerRef}>
      <ThemeWrapper theme={theme}>
        {form.layout === "one" ? (
          <OneByOneRenderer form={form} />
        ) : (
          <AllInOneRenderer form={form} />
        )}
      </ThemeWrapper>
    </div>
  );
}

