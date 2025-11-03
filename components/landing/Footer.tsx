"use client";

import Link from "next/link";

const footerLinks = {
  product: [
    { label: "Fonctionnalités", href: "#features" },
    { label: "Tarifs", href: "#pricing" },
    { label: "Documentation", href: "/docs" },
    { label: "API", href: "/api" }
  ],
  company: [
    { label: "À propos", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Carrières", href: "/careers" },
    { label: "Contact", href: "/contact" }
  ],
  legal: [
    { label: "Confidentialité", href: "/privacy" },
    { label: "Conditions", href: "/terms" },
    { label: "Cookies", href: "/cookies" },
    { label: "RGPD", href: "/gdpr" }
  ]
};

const socialLinks = [
  { icon: "𝕏", href: "https://twitter.com", label: "Twitter" },
  { icon: "💻", href: "https://github.com", label: "GitHub" },
  { icon: "💼", href: "https://linkedin.com", label: "LinkedIn" }
];

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-lg">
                📝
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                FormBuilder
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-sm">
              La plateforme tout-en-un pour créer, publier et gérer vos formulaires 
              en ligne. Simple, puissant et intuitif.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white transition-colors text-lg"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Produit
            </h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Entreprise
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Légal
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} FormBuilder. Tous droits réservés.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Fait avec ❤️ pour simplifier la collecte de données
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

