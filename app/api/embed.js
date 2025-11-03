// Script pour iframe auto-height
(function () {
  "use strict"

  // Écouter les messages de hauteur depuis les iframes
  window.addEventListener("message", function (event) {
    // Vérifier l'origine pour la sécurité (optionnel, ajustez selon vos besoins)
    // if (event.origin !== "https://votre-domaine.com") return

    if (event.data && event.data.type === "form-height") {
      const { height, iframeId } = event.data

      // Trouver l'iframe par ID ou par src
      let iframe = null

      if (iframeId) {
        iframe = document.getElementById(iframeId)
      }

      // Si pas trouvé par ID, chercher tous les iframes avec data-auto-height
      if (!iframe) {
        const iframes = document.querySelectorAll('iframe[data-auto-height="true"]')
        // Si plusieurs, utiliser le premier (ou améliorer la logique)
        if (iframes.length > 0) {
          iframe = iframes[0]
        }
      }

      // Ajuster la hauteur
      if (iframe && height && typeof height === "number" && height > 0) {
        iframe.style.height = height + "px"
      }
    }
  })

  // Observer les iframes pour détecter les changements de taille avec ResizeObserver (fallback)
  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(function (entries) {
      entries.forEach(function (entry) {
        const iframe = entry.target
        if (iframe.tagName === "IFRAME" && iframe.dataset.autoHeight === "true") {
          // Note: On ne peut pas lire la hauteur du contenu depuis l'extérieur
          // Le postMessage depuis l'iframe est la méthode principale
        }
      })
    })

    // Observer tous les iframes avec data-auto-height quand ils sont ajoutés
    const observeIframes = function () {
      const iframes = document.querySelectorAll('iframe[data-auto-height="true"]')
      iframes.forEach(function (iframe) {
        observer.observe(iframe)
      })
    }

    // Observer au chargement
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", observeIframes)
    } else {
      observeIframes()
    }

    // Observer aussi les nouveaux iframes ajoutés dynamiquement
    const mutationObserver = new MutationObserver(observeIframes)
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }
})()
