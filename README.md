# Quiz entretien : React · TypeScript · JavaScript

Entraînement aux questions théoriques d'entretien, façon test en ligne (CodinGame) : questions à choix unique ou multiple, chrono par question, classement par catégorie.

## Lancer

Aucune dépendance ni build. Ouvrir `index.html` dans un navigateur :

```sh
xdg-open index.html
```

## Publier sur GitHub Pages

Le site est 100 % statique (chemins relatifs) : il est publié par GitHub Pages depuis la branche `main` (racine), à chaque push. Le fichier `.nojekyll` désactive le traitement Jekyll.

La progression (réglages, questions ratées) est stockée dans le `localStorage` du navigateur : elle est propre à chaque appareil.

## Fonctionnalités

- **Catégories** TypeScript / JavaScript / React, sélectionnables ; option « Regrouper par catégorie » (TS → JS → React) ou tout mélangé.
- **Chrono par question** (champ `time`) : mode normal, confortable (×1.5) ou désactivé. À zéro, la réponse est validée automatiquement.
- **Choix unique ou multiple**, notation tout-ou-rien comme sur les plateformes de test.
- **Mode strict** : les questions s'affichent toutes avec des cases à cocher, sans dire combien de réponses sont attendues.
- **Réviser mes erreurs** : les questions ratées sont mémorisées (localStorage) et retirées dès qu'elles sont réussies.
- **Thème** clair / sombre / auto (bouton en haut à droite, mémorisé), inspiré du style Superdry : noir et blanc à fort contraste, rouge en accent, titres et boutons en capitales grasses, angles droits, police Inter auto-hébergée (`fonts/`, licence SIL OFL dans `fonts/OFL.txt`).
- **Sons** à la validation : deux notes montantes si la réponse est juste, deux notes descendantes plus graves sinon. Synthétisés avec la Web Audio API (aucun fichier), coupables via le bouton « Son » à côté du thème (mémorisé).
- **Coloration syntaxique** des extraits de code (JS, TS, JSX) avec la palette VS Code Dark+, via un petit tokenizer maison (`highlight.js`, sans dépendance).
- **Raccourcis** : `A`–`F` ou `1`–`6` pour cocher, `Entrée` pour valider puis passer à la suite. Désactivables dans les réglages.
- **Responsive** : bouton Valider / Suivant collé en bas de l'écran sur mobile, zones tactiles agrandies.

## Accessibilité et sécurité

- Visé : **WCAG 2.2 AA**. Contrastes vérifiés (texte ≥ 4.5:1, contrôles ≥ 3:1) dans les deux thèmes, focus visible, `prefers-reduced-motion` et mode contraste élevé pris en charge.
- Focus déplacé sur la question à chaque nouvelle question, puis sur « Question suivante » après validation ; résultat et explication annoncés via une région `role="status"`.
- Bonne / mauvaise réponse indiquées aussi par du texte et des symboles, pas seulement par la couleur.
- Raccourcis à une touche désactivables (critère 2.1.4) ; chrono réglable ou désactivable avant de commencer (critère 2.2.1).
- **CSP** stricte (`default-src 'none'`, scripts et styles uniquement depuis le site, pas de style inline), aucune ressource externe (police comprise), contenu échappé avant insertion, réglages relus depuis le `localStorage` validés.

## Pas de pattern d'écriture dans les réponses

- Les options sont **mélangées à chaque affichage**.
- Les distracteurs sont rédigés dans le même style et avec une longueur proche de la bonne réponse.
- Le nombre d'options et de bonnes réponses varie (choix unique à 4 ou 5 options, choix multiple de 2 à 4 bonnes réponses sur 4 à 6).
- Un **audit automatique** (pied de page de l'accueil + console) signale :
  - une bonne réponse nettement plus longue que les autres ;
  - un biais global si la bonne réponse est trop souvent la plus longue ;
  - les erreurs de format (id dupliqué, index hors limites, etc.).

## Ajouter des questions

Dans `questions/<catégorie>.js` :

```js
{
  id: "ts-mon-sujet",            // unique
  category: "ts",                // "ts" | "js" | "react"
  type: "single",                // "single" | "multiple"
  time: 45,                      // secondes
  question: "Texte avec `code inline` ?",
  code: `const x = 1;`,          // optionnel, bloc de code
  options: ["…", "…", "…", "…"],
  answer: [0],                   // index des bonnes réponses dans `options`
  explanation: "Affichée après validation.",
}
```

L'ordre des options dans le fichier n'a pas d'importance. Ouvrir ensuite l'accueil pour vérifier que l'audit ne signale rien.
