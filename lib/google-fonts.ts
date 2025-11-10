/**
 * Liste des polices Google Fonts populaires
 * Format: { name: "Nom de la police", value: "Nom pour CSS", googleFont: "Nom Google Fonts" }
 */
export const GOOGLE_FONTS = [
  // Sans-serif populaires
  { name: "Inter", value: "Inter", googleFont: "Inter:wght@300;400;500;600;700;800" },
  { name: "Roboto", value: "Roboto", googleFont: "Roboto:wght@300;400;500;700" },
  { name: "Open Sans", value: "Open Sans", googleFont: "Open+Sans:wght@300;400;600;700" },
  { name: "Lato", value: "Lato", googleFont: "Lato:wght@300;400;700" },
  { name: "Poppins", value: "Poppins", googleFont: "Poppins:wght@300;400;500;600;700" },
  { name: "Montserrat", value: "Montserrat", googleFont: "Montserrat:wght@300;400;500;600;700" },
  { name: "Raleway", value: "Raleway", googleFont: "Raleway:wght@300;400;500;600;700" },
  { name: "Ubuntu", value: "Ubuntu", googleFont: "Ubuntu:wght@300;400;500;700" },
  { name: "Nunito", value: "Nunito", googleFont: "Nunito:wght@300;400;600;700" },
  { name: "Source Sans Pro", value: "Source Sans Pro", googleFont: "Source+Sans+Pro:wght@300;400;600;700" },
  { name: "Work Sans", value: "Work Sans", googleFont: "Work+Sans:wght@300;400;500;600;700" },
  { name: "DM Sans", value: "DM Sans", googleFont: "DM+Sans:wght@300;400;500;700" },
  { name: "Noto Sans", value: "Noto Sans", googleFont: "Noto+Sans:wght@300;400;500;600;700" },
  { name: "Lexend", value: "Lexend", googleFont: "Lexend:wght@300;400;500;600;700" },
  { name: "Figtree", value: "Figtree", googleFont: "Figtree:wght@300;400;500;600;700" },
  
  // Serif populaires
  { name: "Merriweather", value: "Merriweather", googleFont: "Merriweather:wght@300;400;700" },
  { name: "Playfair Display", value: "Playfair Display", googleFont: "Playfair+Display:wght@400;500;600;700" },
  { name: "Lora", value: "Lora", googleFont: "Lora:wght@400;500;600;700" },
  { name: "Crimson Text", value: "Crimson Text", googleFont: "Crimson+Text:wght@400;600;700" },
  { name: "Libre Baskerville", value: "Libre Baskerville", googleFont: "Libre+Baskerville:wght@400" },
  { name: "PT Serif", value: "PT Serif", googleFont: "PT+Serif:wght@400;700" },
  
  // Display/Decorative
  { name: "Oswald", value: "Oswald", googleFont: "Oswald:wght@300;400;500;600;700" },
  { name: "Bebas Neue", value: "Bebas Neue", googleFont: "Bebas+Neue" },
  { name: "Righteous", value: "Righteous", googleFont: "Righteous" },
  { name: "Fredoka One", value: "Fredoka One", googleFont: "Fredoka+One" },
  { name: "Bangers", value: "Bangers", googleFont: "Bangers" },
  { name: "Lobster", value: "Lobster", googleFont: "Lobster" },
  
  // Modernes/Minimalistes
  { name: "Outfit", value: "Outfit", googleFont: "Outfit:wght@300;400;500;600;700" },
  { name: "Plus Jakarta Sans", value: "Plus Jakarta Sans", googleFont: "Plus+Jakarta+Sans:wght@300;400;500;600;700" },
  { name: "Space Grotesk", value: "Space Grotesk", googleFont: "Space+Grotesk:wght@300;400;500;600;700" },
  { name: "Sora", value: "Sora", googleFont: "Sora:wght@300;400;500;600;700" },
  { name: "Manrope", value: "Manrope", googleFont: "Manrope:wght@300;400;500;600;700" },
  { name: "Palanquin", value: "Palanquin", googleFont: "Palanquin:wght@300;400;500;600;700" },
  
  // Géométriques
  { name: "Fira Sans", value: "Fira Sans", googleFont: "Fira+Sans:wght@300;400;500;600;700" },
  { name: "Comfortaa", value: "Comfortaa", googleFont: "Comfortaa:wght@300;400;600;700" },
  { name: "Quicksand", value: "Quicksand", googleFont: "Quicksand:wght@300;400;500;600;700" },
  { name: "Varela Round", value: "Varela Round", googleFont: "Varela+Round" },
  
  // Handwriting/Script
  { name: "Dancing Script", value: "Dancing Script", googleFont: "Dancing+Script:wght@400;600;700" },
  { name: "Pacifico", value: "Pacifico", googleFont: "Pacifico" },
  { name: "Kalam", value: "Kalam", googleFont: "Kalam:wght@300;400;700" },
  
  // Mono (pour variété)
  { name: "JetBrains Mono", value: "JetBrains Mono", googleFont: "JetBrains+Mono:wght@300;400;500;600;700" },
  { name: "Source Code Pro", value: "Source Code Pro", googleFont: "Source+Code+Pro:wght@300;400;600;700" },
] as const;

export type GoogleFont = typeof GOOGLE_FONTS[number];

/**
 * Obtient l'URL Google Fonts pour une police donnée
 */
export function getGoogleFontUrl(fontValue: string): string | null {
  const font = GOOGLE_FONTS.find((f) => f.value === fontValue);
  if (!font) return null;
  return `https://fonts.googleapis.com/css2?family=${font.googleFont}&display=swap`;
}

/**
 * Obtient toutes les valeurs de polices disponibles
 */
export function getFontValues(): string[] {
  return GOOGLE_FONTS.map((font) => font.value);
}

/**
 * Obtient le nom d'affichage d'une police
 */
export function getFontDisplayName(fontValue: string): string {
  const font = GOOGLE_FONTS.find((f) => f.value === fontValue);
  return font ? font.name : fontValue;
}




