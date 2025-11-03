# 🛡️ Configuration Friendly CAPTCHA (Open Source)

Pour que la protection anti-bot fonctionne correctement, vous devez configurer **Friendly CAPTCHA**.

---

## ✨ Pourquoi Friendly CAPTCHA ?

- ✅ **Open source** et respectueux de la vie privée
- ✅ **Sans tracking** ni cookies (conforme RGPD/GDPR)
- ✅ **Accessible** (pas d'images à déchiffrer)
- ✅ **Proof-of-Work** (preuve de travail cryptographique)
- ✅ **Gratuit** jusqu'à 1 000 vérifications/mois
- ✅ **Auto-hébergeable** (optionnel)
- ✅ **Pas de dépendance à Google**
- 🌍 Conçu en Europe avec la confidentialité à l'esprit

---

## 📋 Résumé des étapes

1. ✅ Créer un compte sur [friendlycaptcha.com](https://friendlycaptcha.com)
2. ✅ Créer une application et récupérer les clés (Sitekey + API Key)
3. ✅ Ajouter les clés dans `.env.local`
4. ✅ Redémarrer le serveur de développement
5. ✅ Tester le CAPTCHA dans vos formulaires
6. ✅ Vérifier la solution côté serveur avant d'accepter les soumissions

---

## 1. Obtenez vos clés Friendly CAPTCHA

### Option A : Utiliser le service cloud (Recommandé - Gratuit jusqu'à 1000/mois)

1.  Allez sur le site Friendly CAPTCHA : [https://friendlycaptcha.com](https://friendlycaptcha.com)
2.  Cliquez sur **"Sign Up"** ou **"Get Started"**
3.  Créez un compte (email + mot de passe)
4.  Dans votre dashboard, cliquez sur **"Create Application"**
5.  Remplissez les informations :
    -   **Application Name** : Un nom pour votre projet (ex: "Mon Application de Formulaires")
    -   **Domains** : Ajoutez vos domaines (ex: `localhost`, `votre-domaine.com`)
    -   Pour le développement local, ajoutez : `localhost`, `127.0.0.1`, `*.local`
6.  Cliquez sur **"Create"**

Vous obtiendrez alors deux clés :
-   **Sitekey** : C'est la clé publique que vous utiliserez dans votre frontend
-   **API Key** (Secret) : C'est la clé privée que vous utiliserez dans votre backend pour vérifier les solutions

### Option B : Auto-hébergement (Avancé)

Si vous souhaitez héberger vous-même le service de vérification :
- Documentation : [https://docs.friendlycaptcha.com/#/self-hosting](https://docs.friendlycaptcha.com/#/self-hosting)
- Dépôt GitHub : [https://github.com/FriendlyCaptcha/friendly-challenge](https://github.com/FriendlyCaptcha/friendly-challenge)

---

## 2. Ajoutez les variables d'environnement

Créez ou modifiez votre fichier `.env.local` à la racine de votre projet et ajoutez les clés obtenues :

```dotenv
# Friendly CAPTCHA Configuration
NEXT_PUBLIC_FRIENDLY_CAPTCHA_SITE_KEY="VOTRE_SITEKEY_ICI"
FRIENDLY_CAPTCHA_SECRET_KEY="VOTRE_API_KEY_ICI"
```

**Exemple :**
```dotenv
NEXT_PUBLIC_FRIENDLY_CAPTCHA_SITE_KEY="FCMABCDEF123456789"
FRIENDLY_CAPTCHA_SECRET_KEY="sk_live_ABCDEFGHIJKLMNOP"
```

### 🔑 Explications des clés

-   `NEXT_PUBLIC_FRIENDLY_CAPTCHA_SITE_KEY` : 
    - La **Sitekey** (publique)
    - Doit être préfixée par `NEXT_PUBLIC_` pour être accessible côté client dans Next.js
    - Visible dans le code source (c'est normal, elle est publique)

-   `FRIENDLY_CAPTCHA_SECRET_KEY` : 
    - L'**API Key** (privée/secrète)
    - Ne doit PAS être préfixée par `NEXT_PUBLIC_`
    - Ne sera utilisée que côté serveur
    - ⚠️ **Ne JAMAIS exposer cette clé publiquement**

### 🔄 Redémarrer le serveur

**Redémarrez votre serveur de développement** après avoir modifié le fichier `.env.local` pour que les changements soient pris en compte :

```bash
# Arrêtez le serveur (Ctrl+C) puis relancez-le
npm run dev
```

---

## 3. Vérification côté serveur (Backend)

Pour une protection complète, vous devrez vérifier la solution Friendly CAPTCHA côté serveur lors de la soumission du formulaire.

### 🔹 API de vérification déjà créée

Une route API a déjà été créée pour vous : `app/api/verify-friendlycaptcha/route.ts`

Cette API :
- ✅ Reçoit la solution du client
- ✅ Vérifie auprès de l'API Friendly CAPTCHA
- ✅ Retourne le résultat (succès ou échec)

### 🔹 Exemple de vérification dans votre logique de soumission

```typescript
// app/actions/formSubmission.ts (exemple)
import { createClient } from '@supabase/supabase-js'; // ou votre client DB
import { revalidatePath } from 'next/cache';

export async function submitFormWithCaptcha(formData: FormData) {
  const captchaSolution = formData.get('captchaSolution') as string; // La solution envoyée par le client

  if (!captchaSolution) {
    return { success: false, error: "Solution CAPTCHA manquante." };
  }

  try {
    // Vérifier la solution auprès de votre API
    const verifyResponse = await fetch('/api/verify-friendlycaptcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ solution: captchaSolution }),
    });

    const verifyData = await verifyResponse.json();

    if (!verifyData.success) {
      console.warn("Vérification Friendly CAPTCHA échouée:", verifyData);
      return { 
        success: false, 
        error: "Vérification CAPTCHA échouée. Veuillez réessayer." 
      };
    }

    // ✅ Si la vérification CAPTCHA est réussie, continuez avec la logique de soumission
    
    // ... (votre logique de sauvegarde des données du formulaire) ...
    
    // Exemple : sauvegarder dans Supabase
    const supabase = createClient(/* ... */);
    await supabase.from('form_submissions').insert({
      // ... vos données
    });

    revalidatePath('/forms');
    return { success: true, message: "Formulaire soumis avec succès !" };

  } catch (error) {
    console.error("Erreur lors de la vérification CAPTCHA côté serveur:", error);
    return { 
      success: false, 
      error: "Erreur serveur lors de la vérification CAPTCHA." 
    };
  }
}
```

### 🔹 Vérification directe auprès de l'API Friendly CAPTCHA (alternative)

Si vous préférez vérifier directement (sans passer par votre API interne) :

```typescript
const response = await fetch('https://api.friendlycaptcha.com/api/v1/siteverify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    solution: captchaSolution,
    secret: process.env.FRIENDLY_CAPTCHA_SECRET_KEY,
    sitekey: process.env.NEXT_PUBLIC_FRIENDLY_CAPTCHA_SITE_KEY,
  }),
});

const data = await response.json();

if (data.success) {
  // ✅ Solution valide - l'utilisateur a résolu le puzzle
  console.log("CAPTCHA vérifié avec succès");
} else {
  // ❌ Solution invalide
  console.error("Erreurs:", data.errors);
}
```

---

## 4. Comment ça marche ?

### 🔍 Proof-of-Work (Preuve de travail)

Friendly CAPTCHA utilise un système de **Proof-of-Work** :

1. **Le navigateur reçoit un puzzle cryptographique** à résoudre
2. **Le JavaScript résout le puzzle** en arrière-plan (cela prend quelques secondes)
3. **Une solution est générée** et envoyée avec le formulaire
4. **Le serveur vérifie la solution** auprès de l'API Friendly CAPTCHA
5. **Si valide** → le formulaire est accepté ✅
6. **Si invalide** → le formulaire est rejeté ❌

### ⚡ Avantages

- **Invisible pour l'utilisateur** : pas d'interaction requise (pas de cases à cocher, pas d'images)
- **Accessible** : fonctionne avec les lecteurs d'écran
- **Privacy-first** : aucune donnée personnelle collectée
- **Efficace** : bloque les bots automatiques qui ne résolvent pas le puzzle

### 🤖 Protection contre les bots

Les bots sont bloqués car :
- Ils doivent exécuter du JavaScript (certains bots ne le font pas)
- Ils doivent résoudre un puzzle cryptographique (coûteux en CPU)
- Chaque solution est unique et à usage unique
- Le serveur vérifie toujours la solution

---

## 5. Dépannage

### ❌ "Configuration Friendly CAPTCHA requise"

**Problème** : Le message d'avertissement s'affiche dans le formulaire.

**Solution** :
1. Vérifiez que `.env.local` existe et contient les bonnes clés
2. Vérifiez que la clé commence bien par `NEXT_PUBLIC_FRIENDLY_CAPTCHA_SITE_KEY`
3. Redémarrez le serveur (`npm run dev`)

### ❌ "Widget failed to initialize"

**Problème** : Le widget ne se charge pas.

**Solution** :
1. Vérifiez votre connexion Internet
2. Vérifiez que le domaine est bien configuré dans le dashboard Friendly CAPTCHA
3. Ouvrez la console du navigateur pour voir les erreurs détaillées

### ❌ "Verification failed"

**Problème** : La vérification échoue côté serveur.

**Solution** :
1. Vérifiez que `FRIENDLY_CAPTCHA_SECRET_KEY` est bien configurée (sans `NEXT_PUBLIC_`)
2. Vérifiez que la clé secrète est correcte
3. Vérifiez les logs serveur pour plus de détails

### ❌ CORS errors

**Problème** : Erreurs CORS dans la console.

**Solution** :
1. Assurez-vous que votre domaine est bien ajouté dans le dashboard Friendly CAPTCHA
2. Pour localhost, ajoutez : `localhost`, `127.0.0.1`, `*.local`

---

## 6. Tarification

### 🆓 Plan Gratuit
- **1 000 vérifications/mois** gratuites
- Parfait pour les petits projets et le développement

### 💼 Plans payants
- **Pay-as-you-go** : à partir de 0,01€ par vérification
- **Forfaits mensuels** disponibles
- Voir les prix : [https://friendlycaptcha.com/pricing](https://friendlycaptcha.com/pricing)

---

## 7. Ressources utiles

- 📖 **Documentation officielle** : [https://docs.friendlycaptcha.com](https://docs.friendlycaptcha.com)
- 💻 **GitHub** : [https://github.com/FriendlyCaptcha/friendly-challenge](https://github.com/FriendlyCaptcha/friendly-challenge)
- 🌐 **Dashboard** : [https://app.friendlycaptcha.com](https://app.friendlycaptcha.com)
- 📧 **Support** : [support@friendlycaptcha.com](mailto:support@friendlycaptcha.com)

---

## ✅ Checklist finale

Avant de déployer en production :

- [ ] Les clés sont configurées dans `.env.local` (dev) et dans vos variables d'environnement de production
- [ ] Le domaine de production est ajouté dans le dashboard Friendly CAPTCHA
- [ ] La vérification côté serveur est bien implémentée
- [ ] Vous avez testé la soumission d'un formulaire avec CAPTCHA
- [ ] Les logs serveur confirment la vérification réussie
- [ ] Vous avez vérifié votre quota de vérifications mensuel

---

**🎉 C'est tout ! Votre application est maintenant protégée par Friendly CAPTCHA !**

Si vous avez des questions, consultez la [documentation officielle](https://docs.friendlycaptcha.com) ou ouvrez une issue sur GitHub.

