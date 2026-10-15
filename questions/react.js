/*
 * Questions React (React 18 / 19).
 * Format : voir README.md. Les options sont mélangées à l'affichage,
 * l'ordre dans ce fichier n'a donc aucune importance.
 */
window.QUESTION_BANK = window.QUESTION_BANK || [];
window.QUESTION_BANK.push(
  {
    id: "react-index-as-key",
    category: "react",
    type: "single",
    time: 40,
    question: "Pourquoi éviter l'index du tableau comme `key` dans une liste qui peut être réordonnée ?",
    options: [
      "L'état local d'un élément peut rester attaché à la mauvaise ligne",
      "React lève une erreur bloquante en mode développement dans ce cas",
      "Les index numériques ne sont pas acceptés comme valeur de `key`",
      "La liste est alors rendue de façon asynchrone par le reconciler",
    ],
    answer: [0],
    explanation:
      "La `key` identifie un élément entre deux rendus. Si on insère ou trie, l'index désigne un autre élément : React réutilise l'instance (état, DOM, focus) pour la mauvaise donnée. Équivalent du `trackBy` / `track` d'Angular.",
  },
  {
    id: "react-setstate-snapshot",
    category: "react",
    type: "single",
    time: 45,
    question: "`count` vaut `0`. Que vaut-il après un clic ?",
    code: `const [count, setCount] = useState(0);

const onClick = () => {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
};`,
    options: ["1", "3", "0", "2"],
    answer: [0],
    explanation:
      "`count` est une constante capturée pour ce rendu (snapshot). Les trois appels demandent `0 + 1`. Pour enchaîner, utiliser la forme fonctionnelle `setCount(c => c + 1)`.",
  },
  {
    id: "react-setstate-mixed-updaters",
    category: "react",
    type: "single",
    time: 60,
    question: "`count` vaut `0`. Que vaut-il après un clic ?",
    code: `const onClick = () => {
  setCount(count + 5);
  setCount((c) => c + 1);
};`,
    options: ["6", "1", "5", "7"],
    answer: [0],
    explanation:
      "React traite la file de mises à jour dans l'ordre : la première remplace l'état par `0 + 5`, la seconde est une fonction appliquée au résultat précédent : `5 + 1`.",
  },
  {
    id: "react-useeffect-no-deps",
    category: "react",
    type: "single",
    time: 30,
    question: "Quand s'exécute `useEffect(fn)` appelé sans tableau de dépendances ?",
    options: [
      "Après chaque rendu validé du composant",
      "Uniquement après le premier rendu du composant",
      "Jamais, le tableau de dépendances est requis",
      "Avant chaque rendu, de manière synchrone",
    ],
    answer: [0],
    explanation:
      "Sans tableau, l'effet (et son nettoyage) s'exécute après chaque commit. Avec `[]`, seulement au montage. Avec `[a, b]`, quand `a` ou `b` change selon `Object.is`.",
  },
  {
    id: "react-strictmode-double-effect",
    category: "react",
    type: "single",
    time: 45,
    question: "En développement sous `<StrictMode>`, pourquoi un effet s'exécute-t-il deux fois au montage ?",
    options: [
      "React démonte et remonte le composant pour tester le nettoyage",
      "Le bundler recharge deux fois le module à cause du remplacement à chaud",
      "React effectue un premier rendu côté serveur puis un second côté client",
      "Le tableau de dépendances est comparé en profondeur au lieu de par référence",
    ],
    answer: [0],
    explanation:
      "StrictMode (dev uniquement) monte, démonte et remonte chaque composant afin de vérifier que les effets sont correctement nettoyés. Il rend aussi deux fois les composants pour détecter les rendus impurs.",
  },
  {
    id: "react-rules-of-hooks",
    category: "react",
    type: "multiple",
    time: 60,
    question: "Quels usages respectent les règles de React ?",
    options: [
      "Appeler `useState` au début du corps d'un composant",
      "Appeler `useEffect` depuis un hook personnalisé `useX`",
      "Appeler `useEffect` dans une boucle `for` du composant",
      "Appeler `useRef` dans un gestionnaire `onClick`",
      "Appeler `use(promise)` à l'intérieur d'un bloc `if`",
    ],
    answer: [0, 1, 4],
    explanation:
      "Les hooks doivent être appelés au niveau supérieur d'un composant ou d'un hook personnalisé, dans le même ordre à chaque rendu. Exception React 19 : l'API `use` peut être appelée dans une condition ou une boucle (mais pas dans un try/catch).",
  },
  {
    id: "react-usecallback-equivalent",
    category: "react",
    type: "single",
    time: 40,
    question: "À quoi équivaut `useCallback(fn, deps)` ?",
    options: [
      "`useMemo(() => fn, deps)`",
      "`useMemo(fn, deps)`",
      "`useRef(fn).current`",
      "`useEffect(() => fn, deps)`",
    ],
    answer: [0],
    explanation:
      "`useCallback` mémoïse la fonction elle-même, `useMemo` mémoïse la valeur retournée par sa fonction. `useMemo(fn, deps)` mémoïserait donc le résultat de l'appel de `fn`.",
  },
  {
    id: "react-memo-inline-callback",
    category: "react",
    type: "single",
    time: 60,
    question: "Quand `Parent` re-rend, `Child` re-rend-il ?",
    code: `const Child = memo(function Child({ onClick }) {
  return <button onClick={onClick}>+1</button>;
});

function Parent() {
  const [n, setN] = useState(0);
  return <Child onClick={() => setN(n + 1)} />;
}`,
    options: [
      "Oui : la fonction est recréée à chaque rendu",
      "Non : `memo` ignore les props de type fonction",
      "Non : `memo` compare les props en profondeur",
      "Oui : `memo` ne s'applique qu'aux composants classe",
    ],
    answer: [0],
    explanation:
      "`memo` compare chaque prop avec `Object.is`. Une fonction fléchée inline a une nouvelle identité à chaque rendu. Il faut la stabiliser avec `useCallback` (ou laisser faire React Compiler).",
  },
  {
    id: "react-useref",
    category: "react",
    type: "single",
    time: 40,
    question: "Quelle affirmation sur `useRef` est correcte ?",
    options: [
      "Modifier `ref.current` ne déclenche pas de nouveau rendu",
      "`ref.current` est réinitialisé à sa valeur initiale à chaque rendu",
      "`useRef` ne peut référencer que des éléments du DOM",
      "Lire `ref.current` abonne le composant à ses changements",
    ],
    answer: [0],
    explanation:
      "Une ref est une boîte mutable conservée entre les rendus, sans réactivité. Utile pour un élément DOM, un id de timer ou la dernière valeur d'une prop. Éviter de la lire ou l'écrire pendant le rendu.",
  },
  {
    id: "react-uselayouteffect",
    category: "react",
    type: "single",
    time: 40,
    question: "Quand s'exécute `useLayoutEffect` par rapport à `useEffect` ?",
    options: [
      "Après les mutations du DOM, avant la peinture",
      "Avant les mutations du DOM, pendant la phase de rendu",
      "Après que le navigateur a peint, comme `useEffect`",
      "Seulement côté serveur, avant l'envoi du HTML",
    ],
    answer: [0],
    explanation:
      "`useLayoutEffect` s'exécute de façon synchrone après le commit et bloque la peinture : utile pour mesurer le DOM et corriger la position sans scintillement. `useEffect` s'exécute généralement après la peinture.",
  },
  {
    id: "react-you-might-not-need-effect",
    category: "react",
    type: "multiple",
    time: 60,
    question: "Dans quelles situations un `useEffect` est-il la solution adaptée ?",
    options: [
      "Synchroniser le composant avec une connexion WebSocket",
      "S'abonner à `resize` sur `window` et se désabonner au nettoyage",
      "Calculer une liste filtrée à partir des props reçues",
      "Réinitialiser tout l'état quand la prop `userId` change",
      "Envoyer une requête POST après le clic sur « Enregistrer »",
    ],
    answer: [0, 1],
    explanation:
      "Les effets servent à synchroniser avec un système externe. Une donnée dérivée se calcule pendant le rendu (`useMemo` si coûteux), un reset d'état se fait avec une `key`, et une action utilisateur va dans le gestionnaire d'événement.",
  },
  {
    id: "react-context-rerender",
    category: "react",
    type: "single",
    time: 45,
    question: "Quand la `value` d'un `Context.Provider` change, quels composants re-rendent ?",
    options: [
      "Tous ses consommateurs, même enveloppés dans `memo`",
      "Uniquement les enfants directs placés sous le `Provider`",
      "Uniquement les consommateurs lisant la propriété modifiée",
      "Aucun, sauf si un consommateur force la mise à jour",
    ],
    answer: [0],
    explanation:
      "Tout composant qui lit le contexte (`useContext` / `use`) re-rend quand `value` change selon `Object.is`, même derrière un `memo`. D'où l'intérêt de mémoïser `value` et de découper les contextes.",
  },
  {
    id: "react-controlled-input-no-onchange",
    category: "react",
    type: "single",
    time: 40,
    question: "Que produit `<input value={name} />` sans `onChange` ni `readOnly` ?",
    options: [
      "Un champ figé et un avertissement dans la console",
      "Un champ éditable initialisé avec la valeur `name`",
      "Une erreur bloquante qui interrompt le rendu",
      "Un champ éditable qui met `name` à jour seul",
    ],
    answer: [0],
    explanation:
      "Avec `value`, l'input est contrôlé : React impose la valeur à chaque rendu, la saisie est donc annulée. Pour une valeur initiale non contrôlée, utiliser `defaultValue`.",
  },
  {
    id: "react-stale-closure-interval",
    category: "react",
    type: "single",
    time: 60,
    question: "Que voit-on à l'écran après quelques secondes ?",
    code: `function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCount(count + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return <p>{count}</p>;
}`,
    options: [
      "`1`, qui ne change plus ensuite",
      "Un compteur qui augmente chaque seconde",
      "`0`, qui ne change jamais",
      "Une erreur de boucle de rendu infinie",
    ],
    answer: [0],
    explanation:
      "L'effet ne s'exécute qu'au montage : la closure capture `count = 0` pour toujours, chaque tick demande donc `setCount(1)`. Correctif : `setCount(c => c + 1)`.",
  },
  {
    id: "react-start-transition",
    category: "react",
    type: "single",
    time: 40,
    question: "À quoi sert `startTransition` (ou `useTransition`) ?",
    options: [
      "Marquer une mise à jour d'état comme non urgente et interruptible",
      "Animer en CSS le passage d'une route à une autre dans le routeur",
      "Différer l'exécution d'un effet jusqu'au prochain temps d'inactivité",
      "Regrouper les mises à jour déclenchées hors des événements React",
    ],
    answer: [0],
    explanation:
      "Une transition est un rendu de faible priorité que React peut interrompre pour traiter une saisie urgente. `isPending` permet d'afficher un état intermédiaire sans repasser par un fallback `Suspense`.",
  },
  {
    id: "react-automatic-batching",
    category: "react",
    type: "multiple",
    time: 60,
    question: "Avec `createRoot` (React 18+), dans quels contextes plusieurs `setState` successifs sont-ils regroupés en un seul rendu ?",
    options: [
      "Dans un gestionnaire `onClick` de React",
      "Dans le callback d'un `setTimeout`",
      "Dans le `then` d'une `Promise`",
      "Dans un écouteur posé via `addEventListener`",
      "Dans des appels `flushSync` successifs",
    ],
    answer: [0, 1, 2, 3],
    explanation:
      "Depuis React 18, le batching est automatique partout. `flushSync` force au contraire un rendu synchrone immédiat de chaque mise à jour qu'il enveloppe.",
  },
  {
    id: "react-server-components",
    category: "react",
    type: "single",
    time: 45,
    question: "Quelle affirmation sur les React Server Components est correcte ?",
    options: [
      "Ils ne peuvent pas utiliser d'état local ni d'effets",
      "Ils sont hydratés côté client avec leur état serveur",
      "Leur code JavaScript est envoyé au navigateur",
      "Ils remplacent entièrement le rendu SSR classique",
    ],
    answer: [0],
    explanation:
      "Un Server Component s'exécute uniquement côté serveur : pas de `useState`, `useEffect` ni de gestionnaires d'événements, et son code n'est pas inclus dans le bundle client. L'interactivité passe par des composants `'use client'`.",
  },
  {
    id: "react-suspense",
    category: "react",
    type: "single",
    time: 40,
    question: "Que fait `<Suspense fallback={<Spinner />}>` lorsqu'un enfant suspend ?",
    options: [
      "Il affiche le fallback jusqu'à ce que l'enfant soit prêt",
      "Il bloque le rendu de toute l'application jusqu'à la résolution des données",
      "Il relance le rendu de l'enfant en boucle sans jamais afficher le fallback",
      "Il capture la promesse comme une erreur et délègue à l'Error Boundary",
    ],
    answer: [0],
    explanation:
      "La frontière `Suspense` la plus proche remplace son sous-arbre par le fallback tant qu'un enfant suspend (`lazy`, `use(promise)`, framework compatible). Le reste de l'application reste interactif.",
  },
  {
    id: "react-error-boundary-scope",
    category: "react",
    type: "multiple",
    time: 60,
    question: "Quelles erreurs un Error Boundary ne capture-t-il PAS ?",
    options: [
      "Une erreur levée dans un gestionnaire `onClick`",
      "Une erreur levée dans un callback `setTimeout`",
      "Une erreur levée pendant le rendu d'un enfant",
      "Une erreur levée dans un effet d'un enfant",
    ],
    answer: [0, 1],
    explanation:
      "Un Error Boundary capture les erreurs du rendu, des méthodes de cycle de vie et des effets de ses descendants. Les gestionnaires d'événements et le code asynchrone s'exécutent hors du rendu : à gérer avec try/catch.",
  },
  {
    id: "react-reset-state-with-key",
    category: "react",
    type: "single",
    time: 40,
    question: "Quelle est la façon idiomatique de réinitialiser tout l'état de `<ProfileForm />` lorsque `userId` change ?",
    options: [
      "Écrire `<ProfileForm key={userId} />`",
      "Remettre chaque état à zéro dans un `useEffect`",
      "Écrire `useState(initial, [userId])`",
      "Appeler `formRef.current.reset()` au rendu",
    ],
    answer: [0],
    explanation:
      "Changer la `key` fait considérer à React qu'il s'agit d'un autre composant : il démonte l'ancien et monte un nouveau avec un état vierge. Le `useEffect` provoque un rendu intermédiaire avec des valeurs obsolètes.",
  },
  {
    id: "react-ngondestroy-equivalent",
    category: "react",
    type: "single",
    time: 30,
    question: "En Angular, `ngOnDestroy` sert à se désabonner. Quel est l'équivalent idiomatique dans un composant fonction React ?",
    options: [
      "La fonction retournée par le callback d'un `useEffect`",
      "Le hook natif `useUnmount` exporté par le paquet `react`",
      "La méthode `componentWillUpdate` du composant parent",
      "Le callback passé en second argument de `useMemo`",
    ],
    answer: [0],
    explanation:
      "La fonction de nettoyage d'un effet s'exécute au démontage et avant chaque ré-exécution de l'effet. React n'exporte pas de `useUnmount`.",
  },
  {
    id: "react-lazy-initial-state",
    category: "react",
    type: "single",
    time: 40,
    question: "Quelle différence entre `useState(compute())` et `useState(() => compute())` ?",
    options: [
      "La seconde forme n'appelle `compute` qu'au premier rendu",
      "Les deux formes appellent `compute` à chaque rendu",
      "La seconde forme stocke la fonction elle-même dans l'état",
      "La première forme n'appelle `compute` qu'au premier rendu",
    ],
    answer: [0],
    explanation:
      "Avec `useState(compute())`, `compute` est exécuté à chaque rendu (son résultat est ignoré après le premier). Passer une fonction initialisatrice évite ce coût. Pour stocker une fonction : `useState(() => fn)`.",
  },
  {
    id: "react-children-rerender",
    category: "react",
    type: "single",
    time: 30,
    question: "Quand un composant parent re-rend, que font par défaut ses composants enfants ?",
    options: [
      "Ils re-rendent aussi, même si leurs props sont identiques",
      "Ils re-rendent uniquement si l'une de leurs props a changé",
      "Ils ne re-rendent pas tant que leur propre état est inchangé",
      "Ils re-rendent uniquement si un contexte qu'ils lisent change",
    ],
    answer: [0],
    explanation:
      "Par défaut, React re-rend tout le sous-arbre. `memo` permet de sauter le rendu si les props sont égales. Différence avec Angular OnPush, qui repose sur le changement de référence des `@Input` ou des signals.",
  },
  {
    id: "react-useeffect-deps-object",
    category: "react",
    type: "single",
    time: 60,
    question: "Combien de fois cet effet s'exécute-t-il ?",
    code: `function Search({ query }) {
  const options = { query, limit: 10 };

  useEffect(() => {
    fetchResults(options);
  }, [options]);
  // ...
}`,
    options: [
      "Après chaque rendu du composant",
      "Uniquement quand `query` change",
      "Une seule fois, au montage",
      "Jamais, l'objet est ignoré",
      "En boucle, sans arrêt",
    ],
    answer: [0],
    explanation:
      "`options` est recréé à chaque rendu, donc sa référence change toujours selon `Object.is`. Il faut dépendre de `query` et créer l'objet dans l'effet, ou le mémoïser. Pas de boucle infinie ici car l'effet ne modifie pas d'état.",
  },
);
