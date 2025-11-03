"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              ✨ Créateur de formulaires nouvelle génération
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            Créez des formulaires
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              en quelques minutes
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Une plateforme intuitive pour concevoir, publier et gérer vos formulaires.
            Sans code, sans contraintes, juste des résultats.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-6">
                Commencer gratuitement →
              </Button>
            </Link>
            <Link href="/signin">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Se connecter
              </Button>
            </Link>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
            Aucune carte bancaire requise • Installation en 2 minutes
          </p>
        </div>

        {/* Mockup preview */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="relative rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-full max-w-md mx-auto space-y-4">
                  {/* Simulated form preview */}
                  <div className="h-12 bg-white dark:bg-gray-700 rounded-lg shadow-sm"></div>
                  <div className="h-12 bg-white dark:bg-gray-700 rounded-lg shadow-sm"></div>
                  <div className="h-24 bg-white dark:bg-gray-700 rounded-lg shadow-sm"></div>
                  <div className="h-10 bg-blue-500 rounded-lg shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

