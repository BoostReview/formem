"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const benefits = [
  "Aucune carte de crédit requise",
  "Installation en 2 minutes",
  "Support client réactif",
  "Annulation à tout moment"
];

export function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Prêt à créer votre premier formulaire ?
          </h2>

          <p className="text-xl text-blue-100 mb-8">
            Rejoignez des milliers d'utilisateurs qui font confiance à notre plateforme
            pour collecter et gérer leurs données.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/signup">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
              >
                Commencer maintenant →
              </Button>
            </Link>
            <Link href="/signin">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 border-white text-white hover:bg-white/10"
              >
                J'ai déjà un compte
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center justify-center gap-2 text-white">
                <span className="text-green-300 text-xl">✓</span>
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

