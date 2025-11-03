export default function Home() {

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navbar Pro avec Menu Mobile */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                FormBuilder
              </span>
            </a>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Fonctionnalités
              </a>
              <a href="#pricing" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Tarifs
              </a>
              <a href="#testimonials" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Témoignages
              </a>
              <a href="/dashboard" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Dashboard
              </a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <a 
                href="/signin"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-4 py-2 transition-colors"
              >
                Connexion
              </a>
              <a 
                href="/signup"
                className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Commencer
              </a>
            </div>

            {/* Mobile menu button - simple version */}
            <div className="md:hidden">
              <a href="/signup" className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                Commencer
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Premium */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background with rounded shapes - Overkill style */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Left side rounded blobs */}
          <div className="absolute -left-20 -top-20 w-96 h-96 bg-gradient-to-br from-blue-200/40 to-purple-200/30 dark:from-blue-900/20 dark:to-purple-900/15 rounded-full blur-3xl"></div>
          <div className="absolute left-0 top-1/4 w-80 h-80 bg-gradient-to-br from-blue-300/30 to-pink-300/20 dark:from-blue-800/15 dark:to-pink-800/10 rounded-full blur-2xl"></div>
          <div className="absolute -left-10 bottom-20 w-64 h-64 bg-gradient-to-br from-purple-200/30 to-blue-200/20 dark:from-purple-800/15 dark:to-blue-800/10 rounded-full blur-2xl"></div>
          
          {/* Right side rounded blobs */}
          <div className="absolute -right-20 top-10 w-[500px] h-[500px] bg-gradient-to-bl from-purple-200/40 to-blue-200/30 dark:from-purple-900/20 dark:to-blue-900/15 rounded-full blur-3xl"></div>
          <div className="absolute right-0 top-1/3 w-96 h-96 bg-gradient-to-bl from-pink-200/30 to-purple-200/20 dark:from-pink-800/15 dark:to-purple-800/10 rounded-full blur-2xl"></div>
          <div className="absolute -right-10 bottom-10 w-72 h-72 bg-gradient-to-bl from-blue-300/30 to-cyan-200/20 dark:from-blue-800/15 dark:to-cyan-800/10 rounded-full blur-2xl"></div>
          
          {/* Center accent */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-100/20 via-purple-100/15 to-pink-100/20 dark:from-blue-900/10 dark:via-purple-900/8 dark:to-pink-900/10 rounded-full blur-3xl"></div>
          
          {/* Bottom rounded shapes */}
          <div className="absolute left-1/4 bottom-0 w-96 h-96 bg-gradient-to-t from-blue-200/25 to-transparent dark:from-blue-900/15 dark:to-transparent rounded-full blur-2xl"></div>
          <div className="absolute right-1/4 bottom-0 w-96 h-96 bg-gradient-to-t from-purple-200/25 to-transparent dark:from-purple-900/15 dark:to-transparent rounded-full blur-2xl"></div>
          
          {/* Additional accent shapes */}
          <div className="absolute left-1/3 top-10 w-72 h-72 bg-gradient-to-r from-cyan-200/20 to-blue-200/20 dark:from-cyan-800/10 dark:to-blue-800/10 rounded-full blur-2xl"></div>
          <div className="absolute right-1/3 bottom-32 w-80 h-80 bg-gradient-to-l from-pink-200/20 to-purple-200/20 dark:from-pink-800/10 dark:to-purple-800/10 rounded-full blur-2xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-full mb-6">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Nouvelle version v2.0 disponible
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-[1.1]">
              Créez des formulaires 
              <span className="block text-blue-600">professionnels</span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Une plateforme moderne pour concevoir, publier et analyser vos formulaires. 
              <span className="font-semibold text-gray-900 dark:text-white"> Simple, rapide et sans code.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a 
                href="/signup"
                className="group inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30"
              >
                Commencer gratuitement
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Gratuit pour commencer</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Sans carte bancaire</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Installation 2 min</span>
              </div>
            </div>
          </div>

          {/* Video Demo - macOS Frame */}
          <div className="mt-16" id="demo">
            <div className="relative group max-w-5xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 overflow-hidden shadow-2xl">
                {/* macOS Window Bar */}
                <div className="bg-gray-200 dark:bg-gray-800 px-4 py-3 flex items-center gap-3 border-b border-gray-300 dark:border-gray-700">
                  {/* macOS Traffic Lights */}
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors cursor-pointer"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors cursor-pointer"></div>
                  </div>
                  {/* Optional: URL bar simulation */}
                  <div className="flex-1 mx-4 bg-white dark:bg-gray-700 rounded-md px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400 font-mono opacity-75">
                    formbuilder.app/demo
                  </div>
                </div>
                
                {/* Video Container */}
                <div className="relative bg-black" style={{ paddingTop: '45.16129032258064%' }}>
                  <iframe
                    src="https://customer-t2wn38pifpdrg3p2.cloudflarestream.com/5b090faaead08b6bf4e6d4b838f9ce39/iframe?poster=https%3A%2F%2Fcustomer-t2wn38pifpdrg3p2.cloudflarestream.com%2F5b090faaead08b6bf4e6d4b838f9ce39%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600&autoplay=true&controls=false&muted=true&loop=true"
                    loading="lazy"
                    style={{ border: 'none', position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }}
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen={true}
                    className="rounded-b-xl"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By - Social Proof */}
      <section className="py-12 px-4 border-y border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-8">
            Utilisé par plus de 10 000 professionnels dans le monde
          </p>
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">10K+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Utilisateurs actifs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">50K+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Réponses collectées</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">99.9%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Uptime SLA</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Enhanced Grid */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-full mb-4">
              FONCTIONNALITÉS
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Une plateforme complète pour créer et gérer vos formulaires efficacement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Création rapide",
                description: "Éditeur drag & drop intuitif. Créez des formulaires en quelques minutes sans code."
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                ),
                title: "Personnalisation totale",
                description: "Personnalisez chaque détail : couleurs, polices, mise en page et branding complet."
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "Analyses en temps réel",
                description: "Tableaux de bord détaillés. Suivez les performances et optimisez vos conversions."
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: "Sécurité & RGPD",
                description: "Chiffrement SSL, conformité RGPD complète et protection anti-spam avancée."
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ),
                title: "100% Responsive",
                description: "Design adaptatif parfait. Vos formulaires fonctionnent sur tous les appareils."
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                ),
                title: "Intégrations puissantes",
                description: "Connectez vos outils favoris. Zapier, Slack, Google Sheets, Webhook et plus."
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="h-full p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-800 hover:border-blue-600 dark:hover:border-blue-600 transition-all bg-white dark:bg-gray-900 hover:shadow-lg">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works - Refined */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 text-sm font-semibold rounded-full mb-4">
              COMMENT ÇA MARCHE
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Trois étapes simples
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Créez votre premier formulaire en moins de 5 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: "1",
                title: "Créez votre formulaire",
                description: "Utilisez l'éditeur drag & drop pour ajouter des champs. Plus de 15 types de champs disponibles."
              },
              {
                step: "2",
                title: "Personnalisez le design",
                description: "Adaptez les couleurs, polices et mise en page pour correspondre parfaitement à votre marque."
              },
              {
                step: "3",
                title: "Publiez et partagez",
                description: "Partagez via lien, intégrez sur votre site ou générez un QR code. Collectez les réponses en temps réel."
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center text-xl font-bold mb-6 shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-7 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 opacity-30"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Enhanced */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 text-sm font-semibold rounded-full mb-4">
              TARIFS
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Tarifs simples et transparents
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Commencez gratuitement. Évoluez quand vous en avez besoin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Gratuit",
                price: "0€",
                description: "Pour découvrir et tester",
                features: [
                  "3 formulaires",
                  "100 réponses/mois",
                  "Design basique",
                  "Support email",
                  "Export CSV"
                ]
              },
              {
                name: "Pro",
                price: "19€",
                description: "Pour les professionnels",
                features: [
                  "Formulaires illimités",
                  "1000 réponses/mois",
                  "Personnalisation complète",
                  "Support prioritaire",
                  "Analyses avancées",
                  "Suppression du branding",
                  "Intégrations"
                ],
                popular: true
              },
              {
                name: "Entreprise",
                price: "49€",
                description: "Pour les équipes",
                features: [
                  "Tout Pro inclus",
                  "Réponses illimitées",
                  "Multi-utilisateurs",
                  "Support dédié 24/7",
                  "API complète",
                  "SLA 99.9%",
                  "Onboarding personnalisé"
                ]
              }
            ].map((plan, index) => (
              <div 
                key={index} 
                className={`relative p-8 rounded-2xl border-2 ${
                  plan.popular 
                    ? 'border-blue-600 dark:border-blue-500 shadow-xl shadow-blue-600/10' 
                    : 'border-gray-200 dark:border-gray-800'
                } bg-white dark:bg-gray-900 hover:shadow-lg transition-all`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                      LE PLUS POPULAIRE
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">/mois</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {plan.description}
                  </p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a 
                  href="/signup"
                  className={`block text-center py-3.5 px-6 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  Commencer
                </a>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Tous les plans incluent un essai gratuit de 14 jours. Aucune carte bancaire requise.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials - Premium */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 bg-yellow-100 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400 text-sm font-semibold rounded-full mb-4">
              TÉMOIGNAGES
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Découvrez pourquoi nos clients adorent FormBuilder.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Marie Dubois",
                role: "Directrice Marketing",
                company: "TechCorp",
                text: "FormBuilder a transformé notre processus de collecte de données. Nous avons réduit notre temps de création de 80% et amélioré notre taux de réponse de 45%.",
                rating: 5
              },
              {
                name: "Pierre Martin",
                role: "CEO & Fondateur",
                company: "StartupXYZ",
                text: "Sans compétences techniques, j'ai pu créer des formulaires magnifiques et professionnels. L'interface est vraiment intuitive et les analyses sont précieuses.",
                rating: 5
              },
              {
                name: "Sophie Laurent",
                role: "Chef de projet",
                company: "AgenceWeb",
                text: "Nous utilisons FormBuilder pour tous nos clients. La personnalisation est excellente et le support client répond toujours en moins d'une heure.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="group p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-800 hover:border-blue-600 dark:hover:border-blue-600 bg-white dark:bg-gray-900 transition-all hover:shadow-xl">
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role} • {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ - Enhanced */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-semibold rounded-full mb-4">
              FAQ
            </span>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Questions fréquentes
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Tout ce que vous devez savoir sur FormBuilder.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Puis-je utiliser FormBuilder gratuitement ?",
                a: "Oui, notre plan gratuit vous permet de créer jusqu'à 3 formulaires et de collecter 100 réponses par mois. Aucune carte bancaire n'est requise pour commencer."
              },
              {
                q: "Comment intégrer un formulaire sur mon site web ?",
                a: "Vous pouvez intégrer vos formulaires via un code embed (iframe), un lien direct partageable ou un QR code téléchargeable. L'intégration prend moins de 2 minutes."
              },
              {
                q: "Mes données sont-elles sécurisées ?",
                a: "Absolument. Nous utilisons le chiffrement SSL/TLS, sommes 100% conformes au RGPD, et stockons vos données sur des serveurs sécurisés en Europe avec des sauvegardes quotidiennes."
              },
              {
                q: "Puis-je personnaliser complètement mes formulaires ?",
                a: "Oui ! Vous pouvez personnaliser les couleurs, polices, espacements, ajouter votre logo et même du CSS personnalisé. Les formulaires peuvent parfaitement correspondre à votre identité de marque."
              },
              {
                q: "Y a-t-il une limite au nombre de champs par formulaire ?",
                a: "Non, vous pouvez ajouter autant de champs que nécessaire. Plus de 15 types de champs sont disponibles : texte, email, téléphone, fichiers, choix multiples, notation, date, et bien plus."
              },
              {
                q: "Puis-je exporter mes données et réponses ?",
                a: "Oui, vous pouvez exporter vos réponses au format CSV ou Excel à tout moment depuis votre dashboard. Vous gardez toujours le contrôle total de vos données."
              },
              {
                q: "Quel support proposez-vous ?",
                a: "Nous offrons un support email pour tous les plans (réponse sous 24h), un support prioritaire pour les plans Pro (réponse sous 4h), et un support dédié 24/7 pour les plans Entreprise."
              },
              {
                q: "Puis-je annuler mon abonnement à tout moment ?",
                a: "Oui, vous pouvez annuler votre abonnement à tout moment en un clic depuis votre dashboard. Aucun frais d'annulation, aucune question posée."
              }
            ].map((faq, index) => (
              <details key={index} className="group rounded-2xl border-2 border-gray-200 dark:border-gray-800 hover:border-blue-600 dark:hover:border-blue-600 bg-white dark:bg-gray-900 transition-all">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-semibold text-gray-900 dark:text-white pr-8">
                    {faq.q}
                  </span>
                  <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </details>
            ))}
          </div>

          <div className="mt-12 text-center p-8 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800">
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">
              Vous avez une autre question ?
            </p>
            <a href="mailto:support@formbuilder.app" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline text-lg">
              Contactez notre équipe support →
            </a>
          </div>
        </div>
      </section>

      {/* CTA Final - Premium */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-black dark:from-black dark:to-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyNTYzZWIiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
        
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Prêt à transformer vos formulaires ?
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Rejoignez plus de 10 000 professionnels qui utilisent FormBuilder pour collecter et gérer leurs données efficacement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a 
              href="/signup"
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-900 bg-white hover:bg-gray-100 rounded-xl transition-all shadow-2xl hover:shadow-white/20"
            >
              Commencer gratuitement
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a 
              href="/signin"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-gray-600 hover:border-gray-500 rounded-xl transition-all hover:bg-white/5"
            >
              Se connecter
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Essai gratuit 14 jours</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Sans carte bancaire</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Annulation en un clic</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Enhanced */}
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <a href="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  FormBuilder
                </span>
              </a>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-xs leading-relaxed">
                Créez, publiez et gérez vos formulaires en ligne. La plateforme moderne pour collecter vos données efficacement.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: "𝕏", label: "Twitter" },
                  { icon: "in", label: "LinkedIn" },
                  { icon: "f", label: "Facebook" }
                ].map((social, i) => (
                  <a 
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-900 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 flex items-center justify-center text-gray-600 dark:text-gray-400 transition-colors font-bold"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
                Produit
              </h3>
              <ul className="space-y-2.5">
                {["Fonctionnalités", "Tarifs", "Templates", "Changelog", "Roadmap"].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
                Entreprise
              </h3>
              <ul className="space-y-2.5">
                {["À propos", "Blog", "Carrières", "Contact", "Partenaires"].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
                Légal
              </h3>
              <ul className="space-y-2.5">
                {["Confidentialité", "Conditions", "Cookies", "RGPD", "Sécurité"].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 FormBuilder. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                99.9% Uptime
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Données sécurisées
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
                Support 24/7
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
