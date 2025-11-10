"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0F0F0F] antialiased">
      {/* Navbar Ultra Minimaliste - Style Tally/Notion */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-[#FAFAFA]/95 dark:bg-[#0F0F0F]/95 backdrop-blur-sm border-b border-black/5 dark:border-white/5" 
          : "bg-transparent"
      }`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-gradient-to-br from-[#A78BFA] to-[#EC4899] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-black/90 dark:text-white/90">
                FormBuilder
              </span>
            </a>

            <div className="hidden md:flex items-center gap-1">
              <a href="#features" className="px-3 py-2 text-sm text-black/60 dark:text-white/60 hover:text-black/90 dark:hover:text-white/90 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                Fonctionnalités
              </a>
              <a href="#pricing" className="px-3 py-2 text-sm text-black/60 dark:text-white/60 hover:text-black/90 dark:hover:text-white/90 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                Tarifs
              </a>
              <a href="/dashboard" className="px-3 py-2 text-sm text-black/60 dark:text-white/60 hover:text-black/90 dark:hover:text-white/90 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                Dashboard
              </a>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <a href="/signin" className="px-4 py-2 text-sm font-medium text-black/70 dark:text-white/70 hover:text-black/90 dark:hover:text-white/90 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                Connexion
              </a>
              <a href="/signup" className="px-4 py-2 text-sm font-medium bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-all">
                Commencer
              </a>
            </div>

            <div className="md:hidden">
              <a href="/signup" className="px-4 py-2 text-sm font-medium bg-black dark:bg-white text-white dark:text-black rounded-lg">
                Commencer
              </a>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero Section - Ultra Épuré */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full mb-8">
            <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-black/60 dark:text-white/60">
              Nouvelle version disponible
            </span>
          </div>

          {/* Titre */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black/90 dark:text-white/90 mb-6 tracking-tight leading-[1.2]">
            Créez des formulaires
            <span className="block mt-2 pb-2 bg-gradient-to-r from-[#A78BFA] via-[#EC4899] to-[#F59E0B] bg-clip-text text-transparent">
              magnifiques
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-black/60 dark:text-white/60 mb-10 leading-relaxed max-w-2xl mx-auto">
            Concevez, publiez et analysez vos formulaires en quelques minutes.
            <br />Simple, rapide et sans code.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <a href="/signup" className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-all">
              Commencer gratuitement
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-black/50 dark:text-white/50">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Gratuit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Sans carte bancaire</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Setup 2 min</span>
            </div>
          </div>
        </div>

        {/* Screenshot/Demo */}
        <div className="max-w-5xl mx-auto mt-20" id="demo">
          <div className="relative rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden shadow-2xl shadow-black/5">
            <div className="bg-white/50 dark:bg-white/5 px-4 py-3 flex items-center gap-2 border-b border-black/5 dark:border-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-black/10 dark:bg-white/10"></div>
                <div className="w-3 h-3 rounded-full bg-black/10 dark:bg-white/10"></div>
                <div className="w-3 h-3 rounded-full bg-black/10 dark:bg-white/10"></div>
              </div>
              <div className="flex-1 mx-4 bg-white dark:bg-white/5 rounded-lg px-3 py-1.5 text-xs text-black/40 dark:text-white/40 border border-black/5 dark:border-white/5">
                formbuilder.app/demo
              </div>
            </div>
            <div className="relative bg-white dark:bg-[#1A1A1A] h-[600px] overflow-hidden">
              <iframe
                src="https://customer-t2wn38pifpdrg3p2.cloudflarestream.com/5b090faaead08b6bf4e6d4b838f9ce39/iframe?poster=https%3A%2F%2Fcustomer-t2wn38pifpdrg3p2.cloudflarestream.com%2F5b090faaead08b6bf4e6d4b838f9ce39%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600&autoplay=true&controls=false&muted=true&loop=true"
                loading="lazy"
                className="w-full h-full"
                style={{ 
                  border: 'none',
                  transform: 'scale(1.5)',
                  transformOrigin: 'center center'
                }}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen={true}
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-6 border-y border-black/5 dark:border-white/5">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs text-black/40 dark:text-white/40 mb-10">
            Utilisé par plus de 10 000 professionnels
          </p>
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-black/90 dark:text-white/90 mb-1">10K+</div>
              <div className="text-xs text-black/50 dark:text-white/50">Utilisateurs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-black/90 dark:text-white/90 mb-1">50K+</div>
              <div className="text-xs text-black/50 dark:text-white/50">Réponses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-black/90 dark:text-white/90 mb-1">99.9%</div>
              <div className="text-xs text-black/50 dark:text-white/50">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-black/90 dark:text-white/90 mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-base text-black/60 dark:text-white/60">
              Une plateforme complète pour créer et gérer vos formulaires
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                emoji: "⚡",
                title: "Création rapide",
                description: "Drag & drop intuitif pour créer vos formulaires en quelques minutes"
              },
              {
                emoji: "🎨",
                title: "Personnalisation",
                description: "Adaptez les couleurs, polices et mise en page à votre marque"
              },
              {
                emoji: "📊",
                title: "Analyses",
                description: "Suivez les performances en temps réel avec des statistiques détaillées"
              },
              {
                emoji: "🔒",
                title: "Sécurité",
                description: "Conformité RGPD et protection anti-spam intégrée"
              },
              {
                emoji: "📱",
                title: "Responsive",
                description: "Vos formulaires s'adaptent parfaitement à tous les écrans"
              },
              {
                emoji: "🔌",
                title: "Intégrations",
                description: "Connectez vos outils favoris : Zapier, Slack, Google Sheets..."
              }
            ].map((feature, index) => (
              <div key={index} className="p-6 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 hover:border-black/20 dark:hover:border-white/20 transition-all">
                <div className="text-3xl mb-4">{feature.emoji}</div>
                <h3 className="text-base font-semibold text-black/90 dark:text-white/90 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-black/60 dark:text-white/60 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-white/50 dark:bg-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-black/90 dark:text-white/90 mb-4">
              Tarifs simples et transparents
            </h2>
            <p className="text-base text-black/60 dark:text-white/60">
              Commencez gratuitement, évoluez quand vous êtes prêt
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: "Gratuit",
                price: "0€",
                description: "Pour découvrir",
                features: ["3 formulaires", "100 réponses/mois", "Design basique", "Support email"]
              },
              {
                name: "Pro",
                price: "19€",
                description: "Pour les pros",
                features: ["Formulaires illimités", "1000 réponses/mois", "Personnalisation complète", "Support prioritaire", "Analyses avancées"],
                popular: true
              },
              {
                name: "Entreprise",
                price: "49€",
                description: "Pour les équipes",
                features: ["Tout Pro inclus", "Réponses illimitées", "Multi-utilisateurs", "Support 24/7", "API complète"]
              }
            ].map((plan, index) => (
              <div key={index} className={`relative p-6 rounded-xl border ${plan.popular ? 'border-black/20 dark:border-white/20 shadow-lg' : 'border-black/10 dark:border-white/10'} bg-white dark:bg-white/5 hover:border-black/20 dark:hover:border-white/20 transition-all`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-black dark:bg-white text-white dark:text-black text-xs font-medium px-3 py-1 rounded-full">
                      Populaire
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-black/60 dark:text-white/60 mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-bold text-black/90 dark:text-white/90">
                      {plan.price}
                    </span>
                    <span className="text-sm text-black/50 dark:text-white/50">/mois</span>
                  </div>
                  <p className="text-xs text-black/50 dark:text-white/50">
                    {plan.description}
                  </p>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-black/70 dark:text-white/70">
                      <svg className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a href="/signup" className={`block text-center py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${plan.popular ? 'bg-black dark:bg-white text-white dark:text-black hover:opacity-90' : 'bg-white dark:bg-white/5 text-black/70 dark:text-white/70 border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20'}`}>
                  Commencer
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-black/90 dark:text-white/90 mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-base text-black/60 dark:text-white/60 mb-8">
            Créez votre premier formulaire en quelques minutes
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/signup" className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-all">
              Commencer gratuitement
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a href="/signin" className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-black/70 dark:text-white/70 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg hover:border-black/20 dark:hover:border-white/20 transition-all">
              Se connecter
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-black/5 dark:border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#A78BFA] to-[#EC4899] rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-lg font-semibold text-black/90 dark:text-white/90">
                  FormBuilder
                </span>
              </div>
              <p className="text-sm text-black/50 dark:text-white/50 mb-6 max-w-xs">
                La plateforme moderne pour créer et gérer vos formulaires en ligne
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-black/90 dark:text-white/90 mb-4">
                Produit
              </h3>
              <ul className="space-y-2.5">
                {["Fonctionnalités", "Tarifs", "Templates"].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-sm text-black/50 dark:text-white/50 hover:text-black/90 dark:hover:text-white/90 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-black/90 dark:text-white/90 mb-4">
                Légal
              </h3>
              <ul className="space-y-2.5">
                {["Confidentialité", "Conditions", "RGPD"].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-sm text-black/50 dark:text-white/50 hover:text-black/90 dark:hover:text-white/90 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-black/40 dark:text-white/40">
              © 2024 FormBuilder. Tous droits réservés.
            </p>
            <div className="flex items-center gap-4 text-xs text-black/40 dark:text-white/40">
              <span>99.9% Uptime</span>
              <span>•</span>
              <span>RGPD Compliant</span>
              <span>•</span>
              <span>Support 24/7</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

