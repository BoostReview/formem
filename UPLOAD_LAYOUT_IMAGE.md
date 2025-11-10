# Upload de l'image de layout One-by-one

## Instructions pour uploader l'image sur Cloudflare R2

1. **Préparer l'image**
   - Sauvegardez l'image de votre formulaire "une question par page"
   - Formats acceptés: PNG, JPG, JPEG, WebP
   - Taille recommandée: max 2MB

2. **Uploader l'image via le script**

```bash
node scripts/upload-layout-image.js <chemin-vers-votre-image>
```

Exemple:
```bash
node scripts/upload-layout-image.js ./layout-one-by-one.png
```

3. **Configurer la variable d'environnement**

Après l'upload, le script vous donnera une URL. Ajoutez-la dans votre fichier `.env.local`:

```env
NEXT_PUBLIC_LAYOUT_ONE_IMAGE=https://votre-domaine.com/api/files/nom-du-fichier.png
```

4. **Redémarrer le serveur**

```bash
npm run dev
```

L'image apparaîtra automatiquement à la place du texte pour l'option "One-by-one" (Une question par page).

## Alternative: Upload manuel via l'interface

Vous pouvez aussi utiliser l'API d'upload existante via une requête POST:

```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@./layout-one-by-one.png"
```

Puis ajoutez l'URL retournée dans `.env.local` comme `NEXT_PUBLIC_LAYOUT_ONE_IMAGE`.


