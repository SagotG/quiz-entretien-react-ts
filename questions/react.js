/*
 * Questions React (React 18 / 19 / 19.2), du niveau junior au niveau senior.
 * Format : voir README.md. Les options sont mélangées à l'affichage,
 * l'ordre dans ce fichier n'a donc aucune importance.
 */
window.QUESTION_BANK = window.QUESTION_BANK || [];
window.QUESTION_BANK.push(
  {
    id: "react-index-as-key",
    category: "react",
    level: "junior",
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
    level: "junior",
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
    level: "mid",
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
    level: "junior",
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
    level: "mid",
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
    level: "mid",
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
    level: "mid",
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
    level: "mid",
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
    level: "junior",
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
    level: "mid",
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
    level: "mid",
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
    level: "mid",
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
    level: "junior",
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
    level: "mid",
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
    level: "senior",
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
    level: "senior",
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
    level: "senior",
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
    level: "mid",
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
    level: "mid",
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
    level: "mid",
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
    level: "junior",
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
    level: "mid",
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
    level: "junior",
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
    level: "mid",
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
  // ===========================================================================
  // Junior : fondamentaux du JSX, de l'état et des événements
  // ===========================================================================
  {
    id: "react-jsx-zero-and",
    category: "react",
    level: "junior",
    type: "single",
    time: 40,
    question: "`count` vaut `0`. Qu'affiche ce JSX ?",
    code: `<div>{count && <p>Articles</p>}</div>`,
    options: ["Le texte `0`", "Rien du tout", "Le paragraphe « Articles »", "Une erreur de rendu"],
    answer: [0],
    explanation:
      "`0 && …` vaut `0`, et React affiche les nombres. Écrire `count > 0 && …` ou un ternaire. `false`, `null` et `undefined`, eux, ne rendent rien.",
  },
  {
    id: "react-jsx-empty-values",
    category: "react",
    level: "junior",
    type: "single",
    time: 40,
    question: "Que rend React pour `<p>{true}{null}{undefined}</p>` ?",
    options: [
      "Un paragraphe vide",
      "Le texte « true »",
      "Le texte « truenullundefined »",
      "Une erreur pour `undefined`",
    ],
    answer: [0],
    explanation:
      "Les booléens, `null` et `undefined` ne produisent aucun nœud : c'est ce qui permet le rendu conditionnel avec `&&`. Pour afficher un booléen, le convertir : `{String(flag)}`.",
  },
  {
    id: "react-fragment",
    category: "react",
    level: "junior",
    type: "single",
    time: 30,
    question: "À quoi sert `<>…</>` en JSX ?",
    options: [
      "Regrouper des éléments sans ajouter de nœud au DOM",
      "Créer un composant mémoïsé sans appeler `memo`",
      "Délimiter une zone rendue uniquement côté serveur",
      "Isoler les styles CSS appliqués aux enfants",
    ],
    answer: [0],
    explanation:
      "Un composant doit renvoyer un seul élément racine. Le Fragment regroupe ses enfants sans `div` superflue, ce qui préserve la structure HTML (tableaux, listes, flex…).",
  },
  {
    id: "react-key-placement",
    category: "react",
    level: "junior",
    type: "single",
    time: 40,
    question: "Où placer la `key` dans ce rendu de liste ?",
    code: `items.map((item) => (
  <li>
    <Row item={item} />
  </li>
))`,
    options: [
      "Sur le `<li>`, l'élément renvoyé par `map`",
      "Sur `<Row>`, le composant le plus profond",
      "Sur le parent `<ul>` qui contient la liste",
      "Sur chaque balise, avec la même valeur",
    ],
    answer: [0],
    explanation:
      "La `key` sert à React pour reconnaître les frères d'une même liste : elle se place sur l'élément directement renvoyé par le callback de `map`.",
  },
  {
    id: "react-onclick-call",
    category: "react",
    level: "junior",
    type: "single",
    time: 30,
    question: "Quel est le problème de `<button onClick={save()}>` ?",
    options: [
      "`save` est appelée pendant le rendu, pas au clic",
      "`onClick` attend une chaîne de caractères en JSX",
      "Les parenthèses empêchent de recevoir l'événement",
      "Il n'y a aucun problème, l'écriture est correcte",
    ],
    answer: [0],
    explanation:
      "`{save()}` exécute `save` à chaque rendu et passe son résultat à `onClick`. Il faut passer la fonction : `onClick={save}`, ou `onClick={() => save(id)}` pour transmettre un argument.",
  },
  {
    id: "react-style-prop",
    category: "react",
    level: "junior",
    type: "single",
    time: 30,
    question: "Quelle écriture de `style` est correcte en JSX ?",
    options: [
      "`style={{ fontSize: 14 }}`",
      "`style=\"font-size: 14px\"`",
      "`style={fontSize: 14}`",
      "`style={['fontSize', 14]}`",
    ],
    answer: [0],
    explanation:
      "`style` attend un objet dont les clés sont en camelCase : la première accolade ouvre une expression JSX, la seconde l'objet. Un nombre est complété en `px` pour les propriétés de dimension.",
  },
  {
    id: "react-usestate-return",
    category: "react",
    level: "junior",
    type: "single",
    time: 30,
    question: "Que renvoie `useState(0)` ?",
    options: [
      "Un tableau `[valeur, fonction de mise à jour]`",
      "Un objet `{ value, setValue }` à déstructurer",
      "La valeur `0`, modifiable directement",
      "Une ref dont on modifie la propriété `current`",
    ],
    answer: [0],
    explanation:
      "La déstructuration de tableau permet de nommer librement les deux éléments : `const [count, setCount] = useState(0)`.",
  },
  {
    id: "react-state-mutation",
    category: "react",
    level: "junior",
    type: "single",
    time: 45,
    question: "Pourquoi l'écran ne se met-il pas à jour ?",
    code: `const [todos, setTodos] = useState([]);

function add(todo) {
  todos.push(todo);
  setTodos(todos);
}`,
    options: [
      "Le tableau a la même référence : React ignore la mise à jour",
      "`push` n'est pas autorisé sur un tableau issu de `useState`",
      "`setTodos` doit être appelé avant de modifier le tableau",
      "Il faut appeler `forceUpdate` après chaque `push`",
    ],
    answer: [0],
    explanation:
      "React compare l'ancien et le nouvel état avec `Object.is` : même référence, pas de nouveau rendu. Créer un nouveau tableau : `setTodos([...todos, todo])`.",
  },
  {
    id: "react-controlled-input",
    category: "react",
    level: "junior",
    type: "single",
    time: 40,
    question: "Quel code crée un champ contrôlé qui fonctionne ?",
    options: [
      "`<input value={v} onChange={(e) => setV(e.target.value)} />`",
      "`<input value={v} onChange={(e) => setV(e.target)} />`",
      "`<input defaultValue={v} onChange={() => setV(v)} />`",
      "`<input value={v} onInput={setV(event.target.value)} />`",
    ],
    answer: [0],
    explanation:
      "Un champ contrôlé lit sa valeur dans l'état et la met à jour à chaque saisie avec `e.target.value`. `setV(e.target)` stockerait l'élément DOM, `defaultValue` rend le champ non contrôlé, et `onInput={setV(…)}` appelle `setV` pendant le rendu.",
  },
  {
    id: "react-conditional-rendering",
    category: "react",
    level: "junior",
    type: "multiple",
    time: 45,
    question: "`loading` est un booléen. Quelles écritures affichent `<Spinner />` seulement quand il vaut `true` ?",
    options: [
      "`{loading && <Spinner />}`",
      "`{loading ? <Spinner /> : null}`",
      "`{loading ?? <Spinner />}`",
      "`{if (loading) <Spinner />}`",
    ],
    answer: [0, 1],
    explanation:
      "`&&` et le ternaire sont les formes idiomatiques. `??` n'utilise la partie droite que pour `null` ou `undefined` : avec un booléen, le spinner ne s'affiche jamais. `if` est une instruction, interdite dans une expression JSX.",
  },
  {
    id: "react-component-capital",
    category: "react",
    level: "junior",
    type: "single",
    time: 30,
    question: "Pourquoi `<card />` n'affiche-t-il pas le composant `card` déclaré dans le fichier ?",
    options: [
      "Une balise en minuscule désigne un élément HTML natif",
      "Les composants doivent être importés depuis un autre fichier",
      "Les balises auto-fermantes sont réservées aux éléments HTML",
      "Un composant doit obligatoirement recevoir des props",
    ],
    answer: [0],
    explanation:
      "JSX distingue par la casse : `<card />` produit l'élément DOM `card`, `<Card />` appelle le composant. D'où la convention PascalCase.",
  },
  {
    id: "react-children-prop",
    category: "react",
    level: "junior",
    type: "single",
    time: 30,
    question: "Comment `Card` affiche-t-il le contenu placé entre `<Card>` et `</Card>` ?",
    options: [
      "Via la prop `children`",
      "Via la prop `content`",
      "Via le hook `useChildren`",
      "Via `this.props.slot`",
    ],
    answer: [0],
    explanation:
      "Le contenu imbriqué est passé dans `props.children`. C'est le mécanisme de composition de React, proche de la projection de contenu (`ng-content`) d'Angular.",
  },
  {
    id: "react-useeffect-mount",
    category: "react",
    level: "junior",
    type: "single",
    time: 30,
    question: "Quand s'exécute `useEffect(fn, [])` ?",
    options: [
      "Une fois, après le premier rendu affiché",
      "Avant chaque rendu, de façon synchrone",
      "Après chaque rendu du composant",
      "Uniquement quand le composant est démonté",
    ],
    answer: [0],
    explanation:
      "Un tableau vide signifie « aucune dépendance » : l'effet s'exécute au montage et son nettoyage au démontage. En développement, `<StrictMode>` le joue deux fois pour vérifier le nettoyage.",
  },
  {
    id: "react-props-readonly",
    category: "react",
    level: "junior",
    type: "single",
    time: 40,
    question: "Un composant enfant doit modifier une valeur reçue en prop. Quelle est la bonne approche ?",
    options: [
      "Appeler une fonction reçue du parent, qui met à jour son état",
      "Réaffecter la prop directement dans le corps du composant",
      "Modifier la prop puis appeler `setState` pour forcer le rendu",
      "Copier la prop dans une variable globale partagée",
    ],
    answer: [0],
    explanation:
      "Les props sont en lecture seule et appartiennent au parent. Le flux de données est descendant : l'enfant signale un changement via un callback (`onChange`), le parent met à jour son état.",
  },
  {
    id: "react-lifting-state",
    category: "react",
    level: "junior",
    type: "single",
    time: 40,
    question: "Deux composants frères doivent afficher le même compteur. Où placer l'état ?",
    options: [
      "Dans leur parent commun, transmis aux deux par props",
      "Dans chacun des deux, synchronisés par un `useEffect`",
      "Dans une variable déclarée hors des composants",
      "Dans le premier frère, que le second lit via une ref",
    ],
    answer: [0],
    explanation:
      "C'est le « lifting state up » : l'état partagé remonte au plus proche ancêtre commun, qui le passe en props et fournit les fonctions de mise à jour.",
  },

  // ===========================================================================
  // Confirmé : hooks, effets, performance et composition
  // ===========================================================================
  {
    id: "react-updater-queue",
    category: "react",
    level: "mid",
    type: "single",
    time: 60,
    question: "`count` vaut `0`. Que vaut-il après le clic ?",
    code: `function onClick() {
  setCount((c) => c + 1);
  setCount((c) => c + 1);
  setCount(42);
  setCount((c) => c * 2);
}`,
    options: ["84", "42", "4", "2"],
    answer: [0],
    explanation:
      "React applique la file dans l'ordre : `0 + 1`, `1 + 1`, puis la valeur `42` remplace l'état, enfin `42 * 2`. Une valeur directe écrase tout ce qui précède dans la file.",
  },
  {
    id: "react-effect-cleanup-order",
    category: "react",
    level: "mid",
    type: "single",
    time: 45,
    question: "`id` passe de 1 à 2. Qu'affiche la console ?",
    code: `useEffect(() => {
  console.log('start', id);
  return () => console.log('stop', id);
}, [id]);`,
    options: ["stop 1, puis start 2", "start 2, puis stop 1", "stop 2, puis start 2", "start 2 uniquement"],
    answer: [0],
    explanation:
      "Avant de relancer l'effet, React exécute le nettoyage du rendu précédent, avec les valeurs capturées à ce moment-là (`id = 1`).",
  },
  {
    id: "react-fetch-race",
    category: "react",
    level: "mid",
    type: "single",
    time: 60,
    question: "Quel problème pose cet effet quand `query` change rapidement ?",
    code: `useEffect(() => {
  fetch(\`/api/search?q=\${query}\`)
    .then((r) => r.json())
    .then(setResults);
}, [query]);`,
    options: [
      "Une réponse ancienne peut écraser une réponse plus récente",
      "L'effet ne se relance pas quand `query` change",
      "`fetch` est interdit dans un `useEffect`",
      "Le composant entre dans une boucle de rendus infinie",
    ],
    answer: [0],
    explanation:
      "Les réponses peuvent arriver dans le désordre (race condition). Dans le nettoyage, positionner un drapeau `ignore = true` ou appeler `controller.abort()`. Une bibliothèque de données (TanStack Query…) gère cela pour vous.",
  },
  {
    id: "react-usememo-uses",
    category: "react",
    level: "mid",
    type: "multiple",
    time: 60,
    question: "Dans quels cas `useMemo` est-il pertinent ?",
    options: [
      "Éviter de refaire un calcul coûteux à chaque rendu",
      "Garder la même référence d'un objet passé à un enfant `memo`",
      "Garantir qu'un calcul ne sera jamais réexécuté",
      "Déclencher un effet de bord quand une valeur change",
    ],
    answer: [0, 1],
    explanation:
      "`useMemo` est une optimisation : React peut abandonner le cache (en développement ou à l'avenir). Un effet de bord va dans `useEffect` ou un gestionnaire d'événement.",
  },
  {
    id: "react-custom-hook-state",
    category: "react",
    level: "mid",
    type: "single",
    time: 40,
    question: "Deux composants appellent le hook personnalisé `useCounter()`. Partagent-ils le même compteur ?",
    options: [
      "Non : chaque appel crée son propre état indépendant",
      "Oui : un hook personnalisé crée un état global partagé",
      "Oui, mais seulement s'ils ont le même parent",
      "Non, sauf si le hook est déclaré dans le même fichier",
    ],
    answer: [0],
    explanation:
      "Un hook personnalisé partage de la logique, pas de l'état. Pour partager l'état lui-même : le remonter, utiliser un contexte ou un store externe.",
  },
  {
    id: "react-usereducer",
    category: "react",
    level: "mid",
    type: "single",
    time: 40,
    question: "Que doit faire un reducer passé à `useReducer` ?",
    options: [
      "Renvoyer le nouvel état sans modifier l'ancien",
      "Modifier l'état reçu puis renvoyer `undefined`",
      "Appeler `dispatch` pour enchaîner l'action suivante",
      "Déclencher les requêtes réseau liées à l'action",
    ],
    answer: [0],
    explanation:
      "Un reducer est une fonction pure `(state, action) => newState`. Les effets de bord (réseau, timers) n'y ont pas leur place, React pouvant l'appeler plusieurs fois.",
  },
  {
    id: "react-context-default",
    category: "react",
    level: "mid",
    type: "single",
    time: 40,
    question: "Que lit `useContext(ThemeContext)` dans un composant sans fournisseur au-dessus ?",
    options: [
      "La valeur par défaut passée à `createContext`",
      "`undefined`, quelle que soit la déclaration",
      "La valeur du dernier fournisseur rendu ailleurs",
      "Rien : React lève une erreur au rendu",
    ],
    answer: [0],
    explanation:
      "La valeur par défaut de `createContext(défaut)` n'est utilisée qu'en l'absence de fournisseur parent. Elle est souvent mise à `null` avec un hook qui lève une erreur explicite.",
  },
  {
    id: "react-ref-as-prop",
    category: "react",
    level: "mid",
    type: "single",
    time: 40,
    question: "En React 19, comment un composant fonction reçoit-il la `ref` passée par son parent ?",
    options: [
      "Directement dans ses props, sous le nom `ref`",
      "Uniquement en étant enveloppé dans `forwardRef`",
      "En appelant `useRef` à l'intérieur de l'enfant",
      "C'est impossible pour un composant fonction",
    ],
    answer: [0],
    explanation:
      "Depuis React 19, `ref` est une prop comme les autres pour les composants fonction : `function Input({ ref, ...props })`. `forwardRef` reste supporté mais n'est plus nécessaire.",
  },
  {
    id: "react-portal",
    category: "react",
    level: "mid",
    type: "multiple",
    time: 60,
    question: "Quelles affirmations sur `createPortal(enfants, noeudDom)` sont vraies ?",
    options: [
      "Les enfants sont insérés dans `noeudDom` côté DOM",
      "Les événements remontent selon l'arbre React, pas le DOM",
      "Les enfants n'ont plus accès au contexte du parent",
      "Le portail crée une racine React indépendante",
    ],
    answer: [0, 1],
    explanation:
      "Un portail ne change que l'emplacement DOM (utile pour les modales et infobulles). Dans l'arbre React, les enfants restent sous leur parent : contexte et propagation des événements sont conservés.",
  },
  {
    id: "react-lazy-suspense",
    category: "react",
    level: "mid",
    type: "single",
    time: 40,
    question: "Que faut-il pour afficher un composant déclaré avec `lazy(() => import('./Chart'))` ?",
    options: [
      "Une frontière `<Suspense>` au-dessus, avec un fallback",
      "Un `useEffect` qui appelle l'import au montage",
      "Un `await` devant le composant dans le JSX",
      "Un Error Boundary, qui suffit à gérer le chargement",
    ],
    answer: [0],
    explanation:
      "Un composant `lazy` suspend pendant le chargement de son module : la frontière `Suspense` la plus proche affiche son fallback. `lazy` se déclare au niveau du module, jamais dans un composant.",
  },
  {
    id: "react-derived-state",
    category: "react",
    level: "mid",
    type: "single",
    time: 45,
    question: "Comment obtenir `fullName` à partir des états `first` et `last` ?",
    options: [
      "Le calculer pendant le rendu : `const fullName = first + ' ' + last`",
      "Un état `fullName` mis à jour dans un `useEffect` sur `[first, last]`",
      "Un état `fullName` mis à jour par chaque gestionnaire de saisie",
      "Une ref `fullName` recalculée dans `useLayoutEffect`",
    ],
    answer: [0],
    explanation:
      "Une donnée dérivable ne doit pas être stockée : la calculer pendant le rendu évite les incohérences et un rendu supplémentaire. Si le calcul est coûteux, `useMemo`.",
  },
  {
    id: "react-ref-current-timing",
    category: "react",
    level: "mid",
    type: "single",
    time: 40,
    question: "Quand `inputRef.current` pointe-t-il vers l'élément `<input ref={inputRef} />` ?",
    options: [
      "Après le commit : dans un effet ou un gestionnaire d'événement",
      "Dès le début du premier rendu, avant même le retour du JSX",
      "Uniquement après un second rendu complet du composant",
      "Seulement si la ref a été créée avec `createRef` et non `useRef`",
    ],
    answer: [0],
    explanation:
      "Pendant le rendu, le DOM n'est pas encore à jour. React renseigne `ref.current` pendant le commit, avant les effets de layout et les effets.",
  },
  {
    id: "react-useid",
    category: "react",
    level: "mid",
    type: "single",
    time: 40,
    question: "À quoi sert `useId` ?",
    options: [
      "Générer un identifiant stable, identique au serveur et au client",
      "Générer la `key` des éléments d'une liste dynamique",
      "Lire l'identifiant interne du composant dans React DevTools",
      "Créer un identifiant unique à chaque rendu du composant",
    ],
    answer: [0],
    explanation:
      "`useId` sert à lier des attributs d'accessibilité (`htmlFor`, `aria-describedby`) sans conflit et sans écart d'hydratation. Il ne doit pas servir de `key`, qui doit venir des données.",
  },
  {
    id: "react-memo-children",
    category: "react",
    level: "mid",
    type: "single",
    time: 60,
    question: "Pourquoi `Card`, enveloppé dans `memo`, re-rend-il à chaque rendu de `Page` ?",
    code: `const Card = memo(function Card({ children }) {
  return <section>{children}</section>;
});

function Page() {
  return (
    <Card>
      <Title />
    </Card>
  );
}`,
    options: [
      "`children` est un nouvel élément JSX à chaque rendu",
      "`memo` ne fonctionne pas avec la prop `children`",
      "`Title` re-rend toujours, ce qui force son parent",
      "Un composant `memo` re-rend dès que son parent re-rend",
    ],
    answer: [0],
    explanation:
      "`<Title />` crée un nouvel objet élément à chaque rendu de `Page` : la comparaison superficielle de `memo` échoue. Mémoïser l'élément ou revoir la structure (React Compiler le fait automatiquement).",
  },
  {
    id: "react-error-boundary-class",
    category: "react",
    level: "mid",
    type: "single",
    time: 40,
    question: "Avec React seul (sans bibliothèque), comment écrire un Error Boundary ?",
    options: [
      "Un composant classe avec `getDerivedStateFromError`",
      "Un composant fonction qui appelle `useErrorBoundary`",
      "Un `try/catch` autour du JSX renvoyé par le composant",
      "Une frontière `<Suspense>` avec une prop `onError`",
    ],
    answer: [0],
    explanation:
      "Il n'existe pas de hook natif : un Error Boundary est une classe définissant `getDerivedStateFromError` (et souvent `componentDidCatch`). La bibliothèque `react-error-boundary` l'encapsule.",
  },
  {
    id: "react-key-fragment",
    category: "react",
    level: "mid",
    type: "single",
    time: 40,
    question: "Comment donner une `key` à un couple `<dt>` / `<dd>` rendu dans un `map` ?",
    options: [
      "`<Fragment key={id}>`, car `<>` n'accepte aucune prop",
      "`<key={id}>`, la syntaxe courte avec un attribut",
      "Mettre la même `key` sur le `<dt>` et sur le `<dd>`",
      "Inutile : React ignore les clés pour les fragments",
    ],
    answer: [0],
    explanation:
      "La syntaxe courte `<>…</>` ne prend pas d'attributs. Il faut importer `Fragment` pour lui passer une `key`.",
  },

  // ===========================================================================
  // Senior : React 19, rendu concurrent, serveur et architecture
  // ===========================================================================
  {
    id: "react-use-api",
    category: "react",
    level: "senior",
    type: "multiple",
    time: 60,
    question: "Quelles affirmations sur l'API `use` de React 19 sont vraies ?",
    options: [
      "Elle lit une promesse et suspend jusqu'à sa résolution",
      "Elle lit un contexte, y compris dans une condition",
      "Elle peut être appelée dans un bloc `try/catch`",
      "Elle met en cache une promesse créée pendant le rendu",
    ],
    answer: [0, 1],
    explanation:
      "`use` suspend sur une promesse et lit un contexte, même après un `if` ou dans une boucle. Elle ne peut pas être dans un `try/catch` (utiliser un Error Boundary), et une promesse créée au rendu est recréée à chaque fois : elle doit venir d'un Server Component ou d'un cache.",
  },
  {
    id: "react-use-action-state",
    category: "react",
    level: "senior",
    type: "single",
    time: 45,
    question: "Que renvoie `useActionState(action, initialState)` ?",
    options: [
      "`[state, formAction, isPending]`",
      "`[state, setState, isPending]`",
      "`{ data, error, isPending }`",
      "`[formAction, state, reset]`",
    ],
    answer: [0],
    explanation:
      "`state` vaut le dernier résultat de l'action, `formAction` se passe à `<form action>` ou à un bouton, et `isPending` indique une action en cours. L'action reçoit `(previousState, formData)`.",
  },
  {
    id: "react-use-optimistic",
    category: "react",
    level: "senior",
    type: "single",
    time: 40,
    question: "À quoi sert `useOptimistic` ?",
    options: [
      "Afficher un résultat provisoire pendant une action asynchrone",
      "Annuler automatiquement les requêtes réseau devenues inutiles",
      "Sauter les rendus dont le résultat n'a pas changé",
      "Précharger les données avant le rendu du composant",
    ],
    answer: [0],
    explanation:
      "L'interface montre tout de suite le résultat attendu (un message envoyé, un « j'aime »). À la fin de l'action, la valeur optimiste est remplacée par l'état réel, ce qui annule l'affichage en cas d'échec.",
  },
  {
    id: "react-form-actions",
    category: "react",
    level: "senior",
    type: "multiple",
    time: 60,
    question: "En React 19, que se passe-t-il avec `<form action={save}>` lorsque `save` est une fonction ?",
    options: [
      "`save` reçoit les champs du formulaire dans un objet `FormData`",
      "Les champs non contrôlés sont réinitialisés après le succès",
      "La page est rechargée comme une soumission HTML classique",
      "`save` doit obligatoirement être une Server Function",
    ],
    answer: [0, 1],
    explanation:
      "React intercepte la soumission et exécute `save` dans une transition. Après le succès, il réinitialise les champs non contrôlés. `save` peut être une fonction client ou une Server Function.",
  },
  {
    id: "react-use-form-status",
    category: "react",
    level: "senior",
    type: "single",
    time: 45,
    question: "Où appeler `useFormStatus` pour savoir si un formulaire est en cours d'envoi ?",
    options: [
      "Dans un composant rendu à l'intérieur du `<form>`",
      "Dans le composant qui rend la balise `<form>`",
      "Dans n'importe quel composant de la page",
      "Dans la fonction d'action passée au formulaire",
    ],
    answer: [0],
    explanation:
      "`useFormStatus` lit l'état du `<form>` parent, comme un contexte. Appelé dans le composant qui rend le formulaire, il ne voit aucun formulaire parent. D'où le classique `<SubmitButton />` séparé.",
  },
  {
    id: "react-compiler",
    category: "react",
    level: "senior",
    type: "single",
    time: 40,
    question: "Que fait React Compiler ?",
    options: [
      "Il mémoïse automatiquement composants et valeurs à la compilation",
      "Il transforme les composants clients en Server Components",
      "Il remplace la réconciliation par des signaux réactifs",
      "Il dispense de respecter les règles des hooks",
    ],
    answer: [0],
    explanation:
      "Le compilateur analyse le code et insère l'équivalent de `useMemo`, `useCallback` et `memo`. Il suppose un code qui respecte les règles de React : les composants non conformes sont laissés tels quels.",
  },
  {
    id: "react-use-deferred-value",
    category: "react",
    level: "senior",
    type: "single",
    time: 45,
    question: "Que fait `const deferred = useDeferredValue(query)` ?",
    options: [
      "Une copie de `query` qui peut être en retard pendant les rendus urgents",
      "La valeur de `query`, mise à jour 300 ms plus tard comme un debounce",
      "Une version de `query` qui ignore les changements trop rapprochés",
      "La valeur précédente de `query`, à la manière d'un hook `usePrevious`",
    ],
    answer: [0],
    explanation:
      "React rend d'abord avec l'ancienne valeur (saisie fluide), puis tente en arrière-plan un rendu avec la nouvelle, interruptible. Aucun délai fixe : cela dépend de la vitesse de l'appareil.",
  },
  {
    id: "react-use-sync-external-store",
    category: "react",
    level: "senior",
    type: "single",
    time: 45,
    question: "Pourquoi utiliser `useSyncExternalStore` pour s'abonner à un store externe ?",
    options: [
      "Éviter le « tearing » : des valeurs incohérentes dans un même rendu",
      "Mettre automatiquement en cache les requêtes réseau du store",
      "Persister le store dans le `localStorage` sans code supplémentaire",
      "Rendre le store accessible côté serveur sans sérialisation",
    ],
    answer: [0],
    explanation:
      "En rendu concurrent, un store qui change pendant un rendu interrompu peut produire des composants qui affichent des valeurs différentes. Ce hook garantit une lecture cohérente. Les bibliothèques d'état (Redux, Zustand…) l'utilisent.",
  },
  {
    id: "react-hydration-mismatch",
    category: "react",
    level: "senior",
    type: "multiple",
    time: 60,
    question: "Quels rendus provoquent un écart d'hydratation entre serveur et client ?",
    options: [
      "Afficher `Date.now()` directement dans le JSX",
      "Rendre `typeof window === 'undefined' ? 'serveur' : 'client'`",
      "Lire `window.innerWidth` dans un `useEffect`",
      "Générer l'id d'un label avec `useId`",
    ],
    answer: [0, 1],
    explanation:
      "L'hydratation suppose que le premier rendu client produit le même HTML que le serveur. Les valeurs propres au client se lisent après le montage (effet), et `useId` est justement conçu pour être identique des deux côtés.",
  },
  {
    id: "react-server-function-security",
    category: "react",
    level: "senior",
    type: "multiple",
    time: 60,
    question: "Une Server Function (`'use server'`) est appelée depuis un formulaire. Que faut-il garder en tête ?",
    options: [
      "C'est un point d'entrée public : vérifier authentification et droits",
      "Ses arguments viennent du client et doivent être validés",
      "Son code source est envoyé au navigateur avec le bundle",
      "Elle n'accepte que des chaînes de caractères en argument",
    ],
    answer: [0, 1],
    explanation:
      "Le client ne reçoit qu'une référence vers la fonction, mais n'importe qui peut l'appeler avec n'importe quels arguments sérialisables. Il faut la traiter comme une route d'API.",
  },
  {
    id: "react-use-client",
    category: "react",
    level: "senior",
    type: "single",
    time: 45,
    question: "Que signifie la directive `'use client'` en tête d'un fichier ?",
    options: [
      "Elle marque une frontière : ce module et ses imports vont dans le bundle client",
      "Le composant n'est jamais rendu côté serveur, pas même en SSR",
      "Le composant est rendu dans un Web Worker séparé du thread principal",
      "Elle est requise dans chaque fichier qui contient un composant",
    ],
    answer: [0],
    explanation:
      "`'use client'` délimite la partie interactive de l'arbre. Les Client Components sont tout de même pré-rendus en HTML côté serveur, puis hydratés. Seuls les points d'entrée ont besoin de la directive.",
  },
  {
    id: "react-server-to-client-props",
    category: "react",
    level: "senior",
    type: "multiple",
    time: 60,
    question: "Quelles valeurs un Server Component peut-il passer en props à un Client Component ?",
    options: [
      "Des objets et tableaux sérialisables",
      "Une promesse, lue côté client avec `use`",
      "Une Server Function marquée `'use server'`",
      "Une fonction fléchée ordinaire définie sur le serveur",
      "Une instance d'une classe personnalisée",
    ],
    answer: [0, 1, 2],
    explanation:
      "Les props franchissent le réseau : elles doivent être sérialisables par React (primitives, objets simples, `Date`, `Map`, promesses, éléments JSX, Server Functions…). Une fonction ordinaire ou une instance de classe ne l'est pas.",
  },
  {
    id: "react-render-purity",
    category: "react",
    level: "senior",
    type: "single",
    time: 40,
    question: "Pourquoi le rendu d'un composant doit-il rester pur, sans effet de bord ?",
    options: [
      "React peut appeler le rendu plusieurs fois ou l'abandonner",
      "Le navigateur interdit les effets de bord dans une fonction",
      "Un rendu impur est automatiquement converti en effet",
      "Les effets de bord ralentissent la phase de commit du DOM",
    ],
    answer: [0],
    explanation:
      "En rendu concurrent, un rendu peut être interrompu, rejoué ou jeté avant le commit. Un effet de bord exécuté au rendu (requête, mutation, journal) serait alors dupliqué ou orphelin.",
  },
  {
    id: "react-ref-callback-cleanup",
    category: "react",
    level: "senior",
    type: "single",
    time: 45,
    question: "En React 19, que se passe-t-il si une ref callback renvoie une fonction ?",
    options: [
      "La fonction sert de nettoyage quand l'élément est détaché",
      "React ignore la valeur renvoyée par une ref callback",
      "La fonction est appelée à chaque rendu du composant",
      "React lève une erreur : une ref callback renvoie `void`",
    ],
    answer: [0],
    explanation:
      "Comme pour un effet, la fonction renvoyée est appelée au détachement (React n'appelle alors plus la callback avec `null`). Pratique pour poser et retirer un observateur sur un nœud.",
  },
  {
    id: "react-context-provider-19",
    category: "react",
    level: "senior",
    type: "single",
    time: 40,
    question: "Quelle écriture React 19 permet de fournir une valeur de contexte ?",
    options: [
      "`<ThemeContext value={theme}>…</ThemeContext>`",
      "`<ThemeContext.Consumer value={theme}>…</ThemeContext.Consumer>`",
      "`<Provider context={ThemeContext} value={theme}>…</Provider>`",
      "`useContext(ThemeContext, theme)` dans le parent",
    ],
    answer: [0],
    explanation:
      "Depuis React 19, l'objet contexte s'utilise directement comme fournisseur. `<ThemeContext.Provider>` fonctionne toujours mais deviendra obsolète.",
  },
  {
    id: "react-async-transition",
    category: "react",
    level: "senior",
    type: "single",
    time: 45,
    question: "Que permet `startTransition(async () => { await save(); setDone(true); })` en React 19 ?",
    options: [
      "Garder `isPending` à vrai pendant toute l'action asynchrone",
      "Exécuter `save` dans un thread séparé du thread principal",
      "Annuler `save` si l'utilisateur déclenche une autre action",
      "Rendre la mise à jour urgente et non interruptible",
    ],
    answer: [0],
    explanation:
      "React 19 accepte des fonctions asynchrones dans les transitions (les « Actions ») : `isPending` reste vrai jusqu'à la fin. Après un `await`, une mise à jour d'état doit être de nouveau enveloppée dans `startTransition` pour rester une transition.",
  },
  {
    id: "react-use-effect-event",
    category: "react",
    level: "senior",
    type: "single",
    time: 45,
    question: "À quoi sert `useEffectEvent` (stable depuis React 19.2) ?",
    options: [
      "Lire les dernières props ou états dans un effet sans en dépendre",
      "Exécuter un effet uniquement au premier montage du composant",
      "Abonner un effet à un événement DOM avec nettoyage automatique",
      "Remplacer `useCallback` pour tous les gestionnaires d'événement",
    ],
    answer: [0],
    explanation:
      "Exemple : un effet de connexion à un salon doit se relancer quand `roomId` change, mais pas quand `theme` change. La logique qui lit `theme` va dans un Effect Event, appelé depuis l'effet.",
  },
  {
    id: "react-activity",
    category: "react",
    level: "senior",
    type: "single",
    time: 45,
    question: "Que fait `<Activity mode=\"hidden\">` (React 19.2) avec ses enfants ?",
    options: [
      "Il les masque en conservant leur état, et démonte leurs effets",
      "Il les démonte complètement, état compris, jusqu'au retour",
      "Il les masque en CSS mais continue d'exécuter leurs effets",
      "Il les rend uniquement côté serveur tant qu'ils sont cachés",
    ],
    answer: [0],
    explanation:
      "`Activity` cache le sous-arbre sans perdre son état (onglets, panneaux) : les effets sont nettoyés et les mises à jour différées à basse priorité. Revenir en `visible` restaure l'interface instantanément.",
  },
);
