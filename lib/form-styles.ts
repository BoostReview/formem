import { ThemeJSON } from "@/types"

export interface FormStyleConfig {
  containerClass: string
  backgroundClass: string
  cardClass: string
  buttonClass: string
  inputClass: string
  customStyles: React.CSSProperties
  animations?: {
    entrance?: string
    hover?: string
    transition?: string
  }
}

export function getFormStyle(theme: ThemeJSON): FormStyleConfig {
  const style = theme.style || "minimal"
  const backgroundGradient = theme.backgroundGradient
  const cardStyle = theme.cardStyle || "flat"
  const shadowIntensity = theme.shadowIntensity || "medium"
  const glassEffect = theme.glassEffect || false
  const neonEffect = theme.neonEffect || false
  const glowColor = theme.glowColor || theme.colors?.primary || "#3b82f6"

  // Styles de base
  const baseStyles: React.CSSProperties = {
    "--primary-color": theme.colors?.primary || "#3b82f6",
    "--secondary-color": theme.colors?.secondary || "#64748b",
    "--text-color": theme.colors?.text || "#1e293b",
    "--radius": `${theme.radius || 14}px`,
    fontFamily: `"${theme.fonts?.family || "Inter"}", sans-serif`,
  }

  // Déterminer le style du background
  const isGradientBackground = backgroundGradient && backgroundGradient.includes("gradient")
  const backgroundColor = isGradientBackground ? "transparent" : theme.colors?.background || "#ffffff"

  switch (style) {
    case "minimal":
      return {
        containerClass: "bg-white",
        backgroundClass: "minimal-background",
        cardClass: `
          bg-white
          shadow-none
          transition-all duration-200
        `,
        buttonClass: `
          bg-gray-900 text-white
          hover:bg-gray-800
          transition-all duration-200
        `,
        inputClass: `
          bg-white border border-gray-200
          focus:border-gray-900 focus:ring-0
          transition-all duration-200
        `,
        customStyles: {
          ...baseStyles,
          backgroundColor: "#ffffff",
          color: theme.colors?.text || "#1e293b",
        },
        animations: {
          entrance: "fade-in",
          hover: "hover-subtle",
          transition: "smooth",
        },
      }

    case "glassmorphism":
      return {
        containerClass: "",
        backgroundClass: "glass-background",
        cardClass: `
          bg-white/50 backdrop-blur-2xl border border-white/60
          shadow-2xl shadow-gray-900/5
          transition-all duration-300
        `,
        buttonClass: `
          bg-white/60 backdrop-blur-xl text-gray-800 border border-white/80
          hover:bg-white/70 hover:shadow-lg
          transition-all duration-200
        `,
        inputClass: `
          bg-white/40 backdrop-blur-md border border-white/50 text-gray-800
          placeholder:text-gray-500
          focus:bg-white/50 focus:border-white/70 focus:ring-0
          transition-all duration-200
        `,
        customStyles: {
          ...baseStyles,
          background: backgroundGradient || "linear-gradient(135deg, #e0f2fe 0%, #ddd6fe 50%, #fce7f3 100%)",
          color: "#1f2937",
        },
        animations: {
          entrance: "fade-in",
          hover: "hover-subtle",
          transition: "smooth",
        },
      }

    case "elegant":
      return {
        containerClass: "",
        backgroundClass: "elegant-background",
        cardClass: `
          bg-white shadow-2xl shadow-gray-900/5
          border border-gray-200/80
          transition-all duration-400
        `,
        buttonClass: `
          bg-gray-900 text-white
          shadow-lg shadow-gray-900/10
          hover:bg-gray-800 hover:shadow-xl hover:shadow-gray-900/15
          transition-all duration-300
        `,
        inputClass: `
          bg-white border border-gray-300
          focus:border-gray-900 focus:ring-0
          transition-all duration-200
        `,
        customStyles: {
          ...baseStyles,
          background: backgroundGradient || "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
          color: theme.colors?.text || "#1e293b",
        },
        animations: {
          entrance: "fade-in",
          hover: "hover-subtle",
          transition: "smooth",
        },
      }

    case "neon":
      return {
        containerClass: "",
        backgroundClass: "neon-background",
        cardClass: `
          bg-slate-800/50 backdrop-blur-xl border border-slate-700/50
          shadow-2xl shadow-black/20
          ring-1 ring-blue-500/10
          transition-all duration-300
        `,
        buttonClass: `
          bg-blue-600 text-white
          shadow-lg shadow-blue-600/20
          hover:bg-blue-500 hover:shadow-blue-500/30
          transition-all duration-200
        `,
        inputClass: `
          bg-slate-700/50 backdrop-blur-md border border-slate-600 text-slate-100
          placeholder:text-slate-400
          focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20
          transition-all duration-200
        `,
        customStyles: {
          ...baseStyles,
          background: backgroundGradient || "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#f1f5f9",
        },
        animations: {
          entrance: "fade-in",
          hover: "hover-subtle",
          transition: "smooth",
        },
      }

    case "modern":
      return {
        containerClass: "",
        backgroundClass: "modern-background",
        cardClass: `
          bg-white shadow-lg shadow-slate-200/50
          border border-slate-200/60
          transition-all duration-300
        `,
        buttonClass: `
          bg-blue-600 text-white
          shadow-sm hover:shadow-md
          hover:bg-blue-700
          transition-all duration-200
        `,
        inputClass: `
          bg-white border border-slate-200
          focus:border-blue-600 focus:ring-0
          transition-all duration-200
        `,
        customStyles: {
          ...baseStyles,
          background: backgroundGradient || "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #f8fafc 100%)",
          color: theme.colors?.text || "#1e293b",
        },
        animations: {
          entrance: "fade-in",
          hover: "hover-subtle",
          transition: "smooth",
        },
      }

    case "bold":
      return {
        containerClass: "",
        backgroundClass: "bold-background",
        cardClass: `
          bg-white/90 backdrop-blur-sm
          shadow-xl shadow-teal-100/50
          border border-teal-200/40
          transition-all duration-300
        `,
        buttonClass: `
          bg-teal-600 text-white
          shadow-md shadow-teal-600/20
          hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-600/30
          transition-all duration-200
        `,
        inputClass: `
          bg-white border border-teal-200
          focus:border-teal-600 focus:ring-0
          transition-all duration-200
        `,
        customStyles: {
          ...baseStyles,
          background: backgroundGradient || "linear-gradient(135deg, #ecfdf5 0%, #cffafe 50%, #f0fdfa 100%)",
          color: theme.colors?.text || "#1e293b",
        },
        animations: {
          entrance: "fade-in",
          hover: "hover-subtle",
          transition: "smooth",
        },
      }

    default:
      return {
        containerClass: "bg-white",
        backgroundClass: "",
        cardClass: "bg-white border shadow-md",
        buttonClass: "bg-[var(--primary-color)] text-white",
        inputClass: "bg-white border",
        customStyles: baseStyles,
      }
  }
}

