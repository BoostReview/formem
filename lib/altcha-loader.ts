// Chargeur Altcha pour Next.js
export async function loadAltcha() {
  if (typeof window === "undefined") {
    console.warn("[Altcha] Window is undefined, cannot load");
    return false;
  }

  // Vérifier si Altcha est déjà chargé
  if (customElements.get("altcha-widget")) {
    console.log("[Altcha] Already loaded");
    return true;
  }

  // Vérifier si le script est déjà en cours de chargement
  const existingScript = document.querySelector('script[src*="altcha"]');
  if (existingScript) {
    console.log("[Altcha] Script already loading, waiting...");
    // Attendre que le web component soit défini
    let attempts = 0;
    const maxAttempts = 150;
    while (attempts < maxAttempts) {
      if (customElements.get("altcha-widget")) {
        console.log("[Altcha] Widget defined after waiting");
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    console.warn("[Altcha] Timeout waiting for widget definition");
    return false;
  }

  try {
    console.log("[Altcha] Attempting to import from npm package...");
    
    // Essayer d'importer directement depuis le package npm
    try {
      // Utiliser dynamic import pour charger le module
      const altchaModule = await import("altcha");
      console.log("[Altcha] Successfully imported from npm package", altchaModule);
      
      // Attendre que le web component soit défini
      let attempts = 0;
      const maxAttempts = 100; // Augmenter le nombre de tentatives
      while (attempts < maxAttempts) {
        if (customElements.get("altcha-widget")) {
          console.log("[Altcha] Widget successfully defined after import");
          return true;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      console.warn("[Altcha] Import succeeded but widget not defined after", maxAttempts, "attempts");
    } catch (importError) {
      console.warn("[Altcha] Direct import failed, trying CDN:", importError);
    }

    // Si l'import direct échoue, essayer les CDN
    console.log("[Altcha] Loading script from CDN...");
    const cdnUrls = [
      "https://cdn.jsdelivr.net/npm/altcha@2.2.4/dist/altcha.umd.cjs",
      "https://unpkg.com/altcha@2.2.4/dist/altcha.umd.cjs",
      "https://cdn.jsdelivr.net/gh/altcha-org/altcha@main/dist/altcha.min.js",
    ];

    let lastError: Error | null = null;

    for (const url of cdnUrls) {
      try {
        const script = document.createElement("script");
        script.src = url;
        // Ne pas utiliser type="module" pour les fichiers .cjs
        if (!url.includes(".cjs")) {
          script.type = "module";
        }
        script.async = true;
        script.defer = true;

        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error(`Timeout loading ${url}`));
          }, 10000);

          script.onload = () => {
            clearTimeout(timeout);
            console.log(`[Altcha] Script loaded from ${url}`);
            resolve();
          };
          
          script.onerror = (error) => {
            clearTimeout(timeout);
            console.warn(`[Altcha] Failed to load from ${url}`, error);
            reject(new Error(`Failed to load from ${url}`));
          };
          
          document.head.appendChild(script);
        });

        // Attendre que le web component soit défini
        let attempts = 0;
        const maxAttempts = 150;
        while (attempts < maxAttempts) {
          if (customElements.get("altcha-widget")) {
            console.log("[Altcha] Widget successfully defined");
            return true;
          }
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }

        console.warn("[Altcha] Script loaded but widget not defined");
        lastError = new Error("Widget not defined after script load");
        // Retirer le script et essayer l'URL suivante
        const failedScript = document.querySelector(`script[src="${url}"]`);
        if (failedScript) {
          failedScript.remove();
        }
        continue;
      } catch (error) {
        console.warn(`[Altcha] Error with ${url}:`, error);
        lastError = error instanceof Error ? error : new Error(String(error));
        const failedScript = document.querySelector(`script[src="${url}"]`);
        if (failedScript) {
          failedScript.remove();
        }
        continue;
      }
    }

    // Si toutes les méthodes ont échoué
    if (lastError) {
      console.error("[Altcha] All loading methods failed:", lastError);
      return false;
    }

    return false;
  } catch (error) {
    console.error("[Altcha] Unexpected error:", error);
    return false;
  }
}

