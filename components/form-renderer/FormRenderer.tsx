"use client";

import { OneByOneRenderer } from "./OneByOneRenderer";
import { AllInOneRenderer } from "./AllInOneRenderer";
import { useIframeHeight } from "@/hooks/useIframeHeight";
import { useGoogleFont } from "@/hooks/useGoogleFont";
import { getFormStyle } from "@/lib/form-styles";
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

  // Obtenir les styles dynamiques basés sur le style du template
  const styleConfig = getFormStyle(theme);

  const style = {
    ...styleConfig.customStyles,
    fontFamily: `"${fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
  } as React.CSSProperties;

  return (
    <div 
      ref={containerRef} 
      className={`min-h-screen ${styleConfig.containerClass} ${styleConfig.backgroundClass}`}
      style={style}
    >
      {form.layout === "one" ? (
        <OneByOneRenderer form={form} />
      ) : (
        <AllInOneRenderer form={form} />
      )}
    </div>
  );
}

