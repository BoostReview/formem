"use client";

const features = [
  {
    icon: "⚡",
    title: "Création ultra-rapide",
    description: "Créez des formulaires professionnels en quelques minutes grâce à notre éditeur drag & drop intuitif.",
    color: "text-yellow-500"
  },
  {
    icon: "🎨",
    title: "Personnalisation totale",
    description: "Adaptez chaque aspect de vos formulaires : couleurs, polices, mise en page pour correspondre à votre marque.",
    color: "text-purple-500"
  },
  {
    icon: "📊",
    title: "Analyses détaillées",
    description: "Suivez les performances de vos formulaires en temps réel avec des statistiques complètes.",
    color: "text-blue-500"
  },
  {
    icon: "🔒",
    title: "Sécurité renforcée",
    description: "Protection anti-spam intégrée et conformité RGPD pour garantir la sécurité de vos données.",
    color: "text-green-500"
  },
  {
    icon: "📱",
    title: "100% Responsive",
    description: "Vos formulaires s'adaptent parfaitement à tous les écrans : mobile, tablette et desktop.",
    color: "text-pink-500"
  },
  {
    icon: "🔌",
    title: "Intégration facile",
    description: "Intégrez vos formulaires partout : embed, lien direct, QR code... vous choisissez !",
    color: "text-orange-500"
  }
];

export function Features() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Une solution complète pour gérer tous vos formulaires en un seul endroit
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 text-2xl">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

