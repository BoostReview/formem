export interface PhonePrefix {
  code: string;
  country: string;
  flag: string;
  maxLength: number; // Longueur max du numéro (sans le préfixe)
  minLength: number; // Longueur min du numéro (sans le préfixe)
  placeholder: string; // Exemple de format
  formatPattern?: string; // Pattern de formatage (ex: "XX XX XX XX X" pour France)
  countryCode?: string; // Code pays ISO (ex: "FR", "US")
}

// Fonction pour générer un drapeau depuis un code pays ISO (2 lettres)
// Utilise les codes Unicode pour les drapeaux régionaux
function getFlagEmojiFromCode(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return "🌍"
  
  const upperCode = countryCode.toUpperCase()
  
  // Convertir les lettres en codes Unicode pour les drapeaux régionaux
  // Les drapeaux régionaux utilisent la plage U+1F1E6 (🇦) à U+1F1FF (🇿)
  // Chaque lettre est convertie: A = 0x1F1E6, B = 0x1F1E7, etc.
  const codePoints = upperCode
    .split('')
    .map(char => {
      const charCode = char.charCodeAt(0)
      // A = 65, donc 65 - 65 + 0x1F1E6 = 0x1F1E6
      return 0x1F1E6 + (charCode - 65)
    })
  
  try {
    return String.fromCodePoint(...codePoints)
  } catch (e) {
    return "🌍"
  }
}

// Mapping direct des codes pays vers les emojis de drapeaux (générés via Unicode)
const COUNTRY_FLAGS: Record<string, string> = {}
const countryCodes = ["FR", "US", "GB", "DE", "ES", "IT", "NL", "BE", "CH", "PT", "MA", "DZ", 
  "TN", "LU", "RU", "CN", "JP", "KR", "IN", "AU", "BR", "MX", "ZA", "AE", "SA", "EG", "TR", 
  "SE", "NO", "DK", "FI", "IE", "PL", "CZ", "AT", "GR", "HU", "RO", "BG", "HR", "SI", "SK", 
  "LT", "LV", "EE", "MT", "CY", "IS", "GI", "AR", "CL", "CO", "PE", "VE", "SG", "MY", "TH", 
  "ID", "PH", "VN", "HK", "MO", "TW", "PK", "BD", "LK", "QA", "KW", "BH", "OM", "LB", "JO", 
  "IL", "IQ", "IR", "NG", "KE", "GH", "CI", "SN", "NZ"]

// Générer tous les drapeaux dynamiquement
countryCodes.forEach(code => {
  COUNTRY_FLAGS[code] = getFlagEmojiFromCode(code)
})

// Fonction pour obtenir le drapeau depuis un code pays ISO
export function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return "🌍"
  const upperCode = countryCode.toUpperCase()
  return COUNTRY_FLAGS[upperCode] || getFlagEmojiFromCode(upperCode)
}

// Fonction pour trouver un préfixe par son code
export function findPrefixByCode(code: string): PhonePrefix | undefined {
  return PHONE_PREFIXES.find(p => p.code === code)
}

// Mapping des préfixes vers les codes pays (pour les préfixes non listés)
const PREFIX_TO_COUNTRY_CODE: Record<string, string> = {
  "+1": "US", // États-Unis/Canada
  "+7": "RU", // Russie/Kazakhstan
  "+20": "EG", // Égypte
  "+27": "ZA", // Afrique du Sud
  "+30": "GR", // Grèce
  "+31": "NL", // Pays-Bas
  "+32": "BE", // Belgique
  "+33": "FR", // France
  "+34": "ES", // Espagne
  "+39": "IT", // Italie
  "+41": "CH", // Suisse
  "+43": "AT", // Autriche
  "+44": "GB", // Royaume-Uni
  "+45": "DK", // Danemark
  "+46": "SE", // Suède
  "+47": "NO", // Norvège
  "+48": "PL", // Pologne
  "+49": "DE", // Allemagne
  "+52": "MX", // Mexique
  "+55": "BR", // Brésil
  "+61": "AU", // Australie
  "+81": "JP", // Japon
  "+82": "KR", // Corée du Sud
  "+86": "CN", // Chine
  "+90": "TR", // Turquie
  "+91": "IN", // Inde
  "+212": "MA", // Maroc
  "+213": "DZ", // Algérie
  "+216": "TN", // Tunisie
  "+351": "PT", // Portugal
  "+352": "LU", // Luxembourg
  "+353": "IE", // Irlande
  "+358": "FI", // Finlande
  "+420": "CZ", // République tchèque
  "+966": "SA", // Arabie saoudite
  "+971": "AE", // Émirats arabes unis
}

// Fonction pour obtenir le drapeau depuis un préfixe
export function getFlagFromPrefix(prefixCode: string): string {
  // D'abord, chercher dans notre liste de préfixes
  const prefix = findPrefixByCode(prefixCode)
  if (prefix) return prefix.flag
  
  // Ensuite, essayer le mapping direct
  const countryCode = PREFIX_TO_COUNTRY_CODE[prefixCode]
  if (countryCode) {
    return getFlagEmoji(countryCode)
  }
  
  // Si aucun mapping trouvé, retourner le drapeau générique
  return "🌍"
}

// Fonction pour formater un numéro selon le préfixe
// Liste des pays qui utilisent la convention (0) pour le zéro initial
// La plupart des pays européens et certains autres utilisent cette convention
export const COUNTRIES_WITH_ZERO_PARENTHESES = [
  // Europe de l'Ouest
  "FR", "BE", "CH", "LU", "MC", // France, Belgique, Suisse, Luxembourg, Monaco
  "GB", "DE", "ES", "IT", "NL", "PT", // Royaume-Uni, Allemagne, Espagne, Italie, Pays-Bas, Portugal
  "IE", "FI", "SE", "NO", "DK", // Irlande, Finlande, Suède, Norvège, Danemark
  "PL", "CZ", "AT", "GR", "HU", // Pologne, République tchèque, Autriche, Grèce, Hongrie
  "RO", "BG", "HR", "SI", "SK", // Roumanie, Bulgarie, Croatie, Slovénie, Slovaquie
  "LT", "LV", "EE", "MT", "CY", // Lituanie, Lettonie, Estonie, Malte, Chypre
  "IS", "GI", // Islande, Gibraltar
  // Autres pays
  "MA", "DZ", "TN", // Maroc, Algérie, Tunisie
  "TR", // Turquie
]

export function formatPhoneNumber(digits: string, prefix: PhonePrefix): string {
  const cleanDigits = digits.replace(/\D/g, "")
  
  // Si pas de pattern, retourner les chiffres tels quels
  if (!prefix.formatPattern) {
    return cleanDigits
  }
  
  // Détecter si le premier chiffre est un zéro et si le pays utilise la convention (0)
  let hasLeadingZero = false
  let digitsToFormat = cleanDigits
  let zeroPrefix = ""
  
  if (cleanDigits.length > 0 && cleanDigits[0] === "0" && prefix.countryCode && COUNTRIES_WITH_ZERO_PARENTHESES.includes(prefix.countryCode)) {
    hasLeadingZero = true
    digitsToFormat = cleanDigits.slice(1) // Enlever le zéro pour le formatage
    zeroPrefix = "(0)"
  }
  
  let formatted = ""
  let digitIndex = 0
  const patternLength = prefix.formatPattern.length
  const patternXCount = (prefix.formatPattern.match(/X/g) || []).length
  
  // Appliquer le pattern jusqu'à ce qu'on ait formaté tous les chiffres ou atteint la fin du pattern
  for (let i = 0; i < patternLength && digitIndex < digitsToFormat.length; i++) {
    if (prefix.formatPattern[i] === "X") {
      formatted += digitsToFormat[digitIndex]
      digitIndex++
    } else {
      formatted += prefix.formatPattern[i]
    }
  }
  
  // Si on a encore des chiffres après avoir appliqué le pattern complet
  // On continue avec le même formatage (basé sur les derniers groupes du pattern)
  if (digitIndex < digitsToFormat.length) {
    // Extraire le dernier groupe du pattern (après le dernier espace/caractère spécial)
    const lastGroupMatch = prefix.formatPattern.match(/([^X\s()\-]+)?(X+)$/)
    if (lastGroupMatch) {
      const lastSeparator = lastGroupMatch[1] || " "
      const lastGroupSize = lastGroupMatch[2].length
      
      // Continuer le formatage avec le même pattern de groupe
      while (digitIndex < digitsToFormat.length) {
        // Ajouter le séparateur avant chaque nouveau groupe
        formatted += lastSeparator
        for (let j = 0; j < lastGroupSize && digitIndex < digitsToFormat.length; j++) {
          formatted += digitsToFormat[digitIndex]
          digitIndex++
        }
      }
    } else {
      // Fallback : ajouter les chiffres restants avec des espaces tous les 2 chiffres
      const remaining = digitsToFormat.slice(digitIndex)
      for (let i = 0; i < remaining.length; i++) {
        if (i > 0 && i % 2 === 0) {
          formatted += " "
        }
        formatted += remaining[i]
      }
    }
  }
  
  // Ajouter le zéro entre parenthèses au début si présent
  if (hasLeadingZero) {
    // Si le formatage commence déjà par un espace, on l'enlève et on met (0) à la place
    if (formatted.startsWith(" ")) {
      formatted = zeroPrefix + formatted.slice(1)
    } else {
      formatted = zeroPrefix + " " + formatted
    }
  }
  
  return formatted
}

// Fonction helper pour créer un préfixe avec drapeau automatique
function createPrefix(code: string, country: string, countryCode: string, maxLength: number, minLength: number, placeholder: string, formatPattern?: string): PhonePrefix {
  const flag = COUNTRY_FLAGS[countryCode.toUpperCase()] || getFlagEmojiFromCode(countryCode)
  const prefix = {
    code,
    country,
    flag,
    countryCode,
    maxLength,
    minLength,
    placeholder,
    formatPattern,
  }
  return prefix
}

export const PHONE_PREFIXES: PhonePrefix[] = [
  // Europe
  createPrefix("+33", "France", "FR", 9, 9, "6 12 34 56 78", "X XX XX XX XX"),
  createPrefix("+44", "Royaume-Uni", "GB", 10, 10, "20 1234 5678", "XX XXXX XXXX"),
  createPrefix("+49", "Allemagne", "DE", 11, 10, "151 23456789", "XXX XXXXXXXXX"),
  createPrefix("+34", "Espagne", "ES", 9, 9, "612 34 56 78", "XXX XX XX XX"),
  createPrefix("+39", "Italie", "IT", 10, 9, "312 345 6789", "XXX XXX XXXX"),
  createPrefix("+31", "Pays-Bas", "NL", 9, 9, "6 12345678", "X XXXXXXXX"),
  createPrefix("+32", "Belgique", "BE", 9, 9, "470 12 34 56", "XXX XX XX XX"),
  createPrefix("+41", "Suisse", "CH", 9, 9, "79 123 45 67", "XX XXX XX XX"),
  createPrefix("+351", "Portugal", "PT", 9, 9, "912 345 678", "XXX XXX XXX"),
  createPrefix("+352", "Luxembourg", "LU", 9, 9, "621 123 456", "XXX XXX XXX"),
  createPrefix("+353", "Irlande", "IE", 9, 9, "85 123 4567", "XX XXX XXXX"),
  createPrefix("+358", "Finlande", "FI", 9, 9, "50 123 4567", "XX XXX XXXX"),
  createPrefix("+46", "Suède", "SE", 9, 9, "70 123 45 67", "XX XXX XX XX"),
  createPrefix("+47", "Norvège", "NO", 8, 8, "412 34 567", "XXX XX XXX"),
  createPrefix("+45", "Danemark", "DK", 8, 8, "20 12 34 56", "XX XX XX XX"),
  createPrefix("+48", "Pologne", "PL", 9, 9, "512 345 678", "XXX XXX XXX"),
  createPrefix("+420", "République tchèque", "CZ", 9, 9, "601 123 456", "XXX XXX XXX"),
  createPrefix("+43", "Autriche", "AT", 10, 10, "664 1234567", "XXX XXXXXXX"),
  createPrefix("+30", "Grèce", "GR", 10, 10, "694 123 4567", "XXX XXX XXXX"),
  createPrefix("+36", "Hongrie", "HU", 9, 9, "20 123 4567", "XX XXX XXXX"),
  createPrefix("+40", "Roumanie", "RO", 9, 9, "712 345 678", "XXX XXX XXX"),
  createPrefix("+359", "Bulgarie", "BG", 9, 9, "888 123 456", "XXX XXX XXX"),
  createPrefix("+385", "Croatie", "HR", 9, 9, "91 123 4567", "XX XXX XXXX"),
  createPrefix("+386", "Slovénie", "SI", 8, 8, "40 123 456", "XX XXX XXX"),
  createPrefix("+421", "Slovaquie", "SK", 9, 9, "912 123 456", "XXX XXX XXX"),
  createPrefix("+370", "Lituanie", "LT", 8, 8, "612 34567", "XXX XXXXX"),
  createPrefix("+371", "Lettonie", "LV", 8, 8, "21234567", "XXXXXXXX"),
  createPrefix("+372", "Estonie", "EE", 8, 7, "5123456", "XXXXXXX"),
  createPrefix("+356", "Malte", "MT", 8, 8, "2123 4567", "XXXX XXXX"),
  createPrefix("+357", "Chypre", "CY", 8, 8, "9912 3456", "XXXX XXXX"),
  createPrefix("+354", "Islande", "IS", 7, 7, "612 3456", "XXX XXXX"),
  createPrefix("+350", "Gibraltar", "GI", 8, 8, "5712 3456", "XXXX XXXX"),
  
  // Amérique du Nord
  createPrefix("+1", "États-Unis / Canada", "US", 10, 10, "(555) 123-4567", "(XXX) XXX-XXXX"),
  createPrefix("+52", "Mexique", "MX", 10, 10, "55 1234 5678", "XX XXXX XXXX"),
  
  // Amérique du Sud
  createPrefix("+55", "Brésil", "BR", 11, 10, "11 91234 5678", "XX XXXXX XXXX"),
  createPrefix("+54", "Argentine", "AR", 10, 10, "11 1234 5678", "XX XXXX XXXX"),
  createPrefix("+56", "Chili", "CL", 9, 9, "9 1234 5678", "X XXXX XXXX"),
  createPrefix("+57", "Colombie", "CO", 10, 10, "321 123 4567", "XXX XXX XXXX"),
  createPrefix("+51", "Pérou", "PE", 9, 9, "987 654 321", "XXX XXX XXX"),
  createPrefix("+58", "Venezuela", "VE", 10, 10, "412 123 4567", "XXX XXX XXXX"),
  
  // Asie
  createPrefix("+86", "Chine", "CN", 11, 11, "138 0013 8000", "XXX XXXX XXXX"),
  createPrefix("+81", "Japon", "JP", 10, 10, "90 1234 5678", "XX XXXX XXXX"),
  createPrefix("+82", "Corée du Sud", "KR", 10, 10, "10 1234 5678", "XX XXXX XXXX"),
  createPrefix("+91", "Inde", "IN", 10, 10, "98765 43210", "XXXXX XXXXX"),
  createPrefix("+65", "Singapour", "SG", 8, 8, "9123 4567", "XXXX XXXX"),
  createPrefix("+60", "Malaisie", "MY", 9, 9, "12 345 6789", "XX XXX XXXX"),
  createPrefix("+66", "Thaïlande", "TH", 9, 9, "81 234 5678", "XX XXX XXXX"),
  createPrefix("+62", "Indonésie", "ID", 10, 9, "812 345 6789", "XXX XXX XXXX"),
  createPrefix("+63", "Philippines", "PH", 10, 10, "917 123 4567", "XXX XXX XXXX"),
  createPrefix("+84", "Vietnam", "VN", 10, 9, "91 234 5678", "XX XXX XXXX"),
  createPrefix("+852", "Hong Kong", "HK", 8, 8, "9123 4567", "XXXX XXXX"),
  createPrefix("+853", "Macao", "MO", 8, 8, "6612 3456", "XXXX XXXX"),
  createPrefix("+886", "Taïwan", "TW", 9, 9, "912 345 678", "XXX XXX XXX"),
  createPrefix("+92", "Pakistan", "PK", 10, 10, "300 1234567", "XXX XXXXXXX"),
  createPrefix("+880", "Bangladesh", "BD", 10, 10, "1712 345678", "XXXX XXXXXX"),
  createPrefix("+94", "Sri Lanka", "LK", 9, 9, "71 234 5678", "XX XXX XXXX"),
  
  // Moyen-Orient
  createPrefix("+971", "Émirats arabes unis", "AE", 9, 9, "50 123 4567", "XX XXX XXXX"),
  createPrefix("+966", "Arabie saoudite", "SA", 9, 9, "50 123 4567", "XX XXX XXXX"),
  createPrefix("+974", "Qatar", "QA", 8, 8, "3312 3456", "XXXX XXXX"),
  createPrefix("+965", "Koweït", "KW", 8, 8, "5012 3456", "XXXX XXXX"),
  createPrefix("+973", "Bahreïn", "BH", 8, 8, "3612 3456", "XXXX XXXX"),
  createPrefix("+968", "Oman", "OM", 8, 8, "9212 3456", "XXXX XXXX"),
  createPrefix("+961", "Liban", "LB", 8, 7, "3 123 456", "X XXX XXX"),
  createPrefix("+962", "Jordanie", "JO", 9, 9, "7 9123 4567", "X XXXX XXXX"),
  createPrefix("+972", "Israël", "IL", 9, 9, "50 123 4567", "XX XXX XXXX"),
  createPrefix("+90", "Turquie", "TR", 10, 10, "532 123 4567", "XXX XXX XXXX"),
  createPrefix("+964", "Irak", "IQ", 10, 10, "790 123 4567", "XXX XXX XXXX"),
  createPrefix("+98", "Iran", "IR", 10, 10, "912 345 6789", "XXX XXX XXXX"),
  
  // Afrique
  createPrefix("+27", "Afrique du Sud", "ZA", 9, 9, "82 123 4567", "XX XXX XXXX"),
  createPrefix("+20", "Égypte", "EG", 10, 10, "10 1234 5678", "XX XXXX XXXX"),
  createPrefix("+212", "Maroc", "MA", 9, 9, "612 345 678", "XXX XXX XXX"),
  createPrefix("+213", "Algérie", "DZ", 9, 9, "551 23 45 67", "XXX XX XX XX"),
  createPrefix("+216", "Tunisie", "TN", 8, 8, "12 345 678", "XX XXX XXX"),
  createPrefix("+234", "Nigeria", "NG", 10, 10, "802 123 4567", "XXX XXX XXXX"),
  createPrefix("+254", "Kenya", "KE", 9, 9, "712 123456", "XXX XXXXXX"),
  createPrefix("+233", "Ghana", "GH", 9, 9, "24 123 4567", "XX XXX XXXX"),
  createPrefix("+225", "Côte d'Ivoire", "CI", 10, 10, "07 12 34 56 78", "XX XX XX XX XX"),
  createPrefix("+221", "Sénégal", "SN", 9, 9, "77 123 45 67", "XX XXX XX XX"),
  
  // Océanie
  createPrefix("+61", "Australie", "AU", 9, 9, "412 345 678", "XXX XXX XXX"),
  createPrefix("+64", "Nouvelle-Zélande", "NZ", 9, 9, "21 123 4567", "XX XXX XXXX"),
  
  // Autres
  createPrefix("+7", "Russie / Kazakhstan", "RU", 10, 10, "912 345 6789", "XXX XXX XXXX"),
].sort((a, b) => a.country.localeCompare(b.country));

export const DEFAULT_PHONE_PREFIXES = ["+33", "+1", "+44", "+49", "+34", "+39", "+31", "+32", "+41"];

