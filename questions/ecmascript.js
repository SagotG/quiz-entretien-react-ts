/*
 * Questions ECMAScript : apports des versions ES2019 à ES2025.
 * Format : voir README.md. Les options sont mélangées à l'affichage,
 * l'ordre dans ce fichier n'a donc aucune importance.
 */
window.QUESTION_BANK = window.QUESTION_BANK || [];
window.QUESTION_BANK.push(
  // --- Junior ----------------------------------------------------------------
  {
    id: "es-optional-chaining",
    category: "es",
    level: "junior",
    type: "single",
    time: 30,
    question: "Qu'affiche ce code ?",
    code: `const user = {};
console.log(user.address?.city);`,
    options: ["`undefined`", "Une `TypeError`", "`null`", "Une chaîne vide"],
    answer: [0],
    explanation:
      "Le chaînage optionnel `?.` (ES2020) court-circuite l'expression si la partie gauche vaut `null` ou `undefined` et renvoie `undefined`, au lieu de lever une `TypeError`.",
  },
  {
    id: "es-destructuring-default",
    category: "es",
    level: "junior",
    type: "single",
    time: 40,
    question: "Qu'affiche ce code ?",
    code: `const { a = 1, b = 2 } = { a: undefined, b: null };
console.log(a, b);`,
    options: ["1 null", "1 2", "undefined null", "undefined 2"],
    answer: [0],
    explanation:
      "Une valeur par défaut de déstructuration ne s'applique que si la valeur vaut `undefined`. `null` est une valeur explicite et est conservée.",
  },
  {
    id: "es-rest-params",
    category: "es",
    level: "junior",
    type: "single",
    time: 30,
    question: "Qu'affiche ce code ?",
    code: `function f(first, ...rest) {
  return rest.length;
}
console.log(f(1, 2, 3));`,
    options: ["2", "3", "1", "0"],
    answer: [0],
    explanation:
      "Le paramètre du reste `...rest` (ES2015) regroupe dans un vrai tableau les arguments qui suivent les paramètres nommés : ici `[2, 3]`.",
  },
  {
    id: "es-arrow-this",
    category: "es",
    level: "junior",
    type: "single",
    time: 45,
    question: "Qu'affiche ce code ?",
    code: `const counter = {
  count: 5,
  get: () => this?.count,
};
console.log(counter.get());`,
    options: ["`undefined`", "`5`", "Une `TypeError`", "`NaN`"],
    answer: [0],
    explanation:
      "Une fonction fléchée n'a pas son propre `this` : elle reprend celui du contexte englobant (ici le niveau supérieur), pas l'objet. Pour une méthode, utiliser la syntaxe `get() { return this.count; }`.",
  },
  {
    id: "es-const-mutation",
    category: "es",
    level: "junior",
    type: "single",
    time: 30,
    question: "Qu'affiche ce code ?",
    code: `const arr = [1];
arr.push(2);
console.log(arr);`,
    options: ["[1, 2]", "[1]", "Une `TypeError`", "[2]"],
    answer: [0],
    explanation:
      "`const` empêche de réaffecter la variable, pas de modifier l'objet qu'elle référence. Pour un tableau non modifiable : `Object.freeze`.",
  },
  {
    id: "es-array-at",
    category: "es",
    level: "junior",
    type: "single",
    time: 30,
    question: "Qu'affiche ce code ?",
    code: `const list = [10, 20, 30];
console.log(list.at(-1), list[-1]);`,
    options: ["30 undefined", "30 30", "undefined undefined", "10 undefined"],
    answer: [0],
    explanation:
      "`at` (ES2022) accepte un index négatif compté depuis la fin. `list[-1]` lit simplement une propriété nommée `'-1'`, qui n'existe pas.",
  },
  {
    id: "es-logical-assignment",
    category: "es",
    level: "junior",
    type: "single",
    time: 40,
    question: "Qu'affiche ce code ?",
    code: `let a = 0;
let b = 0;
a ||= 5;
b ??= 5;
console.log(a, b);`,
    options: ["5 0", "5 5", "0 0", "0 5"],
    answer: [0],
    explanation:
      "Opérateurs d'affectation logique (ES2021) : `a ||= 5` affecte si `a` est falsy (`0` l'est), `b ??= 5` seulement si `b` vaut `null` ou `undefined`.",
  },
  {
    id: "es-numeric-separator",
    category: "es",
    level: "junior",
    type: "single",
    time: 30,
    question: "Qu'affiche ce code ?",
    code: `console.log(1_000_000 + 1);`,
    options: ["1000001", "Une SyntaxError", "1_000_001", "NaN"],
    answer: [0],
    explanation:
      "Les séparateurs numériques `_` (ES2021) améliorent seulement la lisibilité du code source : la valeur est le nombre 1000000.",
  },
  {
    id: "es-replace-all",
    category: "es",
    level: "junior",
    type: "single",
    time: 40,
    question: "Qu'affiche ce code ?",
    code: `const s = 'a-b-c';
console.log(s.replace('-', '+'), s.replaceAll('-', '+'));`,
    options: ["a+b-c a+b+c", "a+b+c a+b+c", "a+b-c a+b-c", "a-b-c a+b+c"],
    answer: [0],
    explanation:
      "Avec une chaîne en motif, `replace` ne remplace que la première occurrence. `replaceAll` (ES2021) les remplace toutes, sans passer par une RegExp avec le drapeau `g`.",
  },

  // --- Confirmé --------------------------------------------------------------
  {
    id: "es-promise-any",
    category: "es",
    level: "mid",
    type: "single",
    time: 40,
    question: "Que renvoie `Promise.any([p1, p2])` si les deux promesses sont rejetées ?",
    options: [
      "Une promesse rejetée avec une `AggregateError`",
      "Une promesse résolue avec le tableau des erreurs",
      "Une promesse rejetée avec la première erreur",
      "Une promesse qui reste en attente indéfiniment",
    ],
    answer: [0],
    explanation:
      "`Promise.any` (ES2021) se résout avec la première promesse tenue. Si toutes échouent, elle est rejetée avec une `AggregateError` dont `errors` contient toutes les raisons.",
  },
  {
    id: "es-promise-combinators",
    category: "es",
    level: "mid",
    type: "multiple",
    time: 60,
    question: "Quelles affirmations sur les combinateurs de promesses sont vraies ?",
    options: [
      "`Promise.allSettled` attend toutes les promesses, même rejetées",
      "`Promise.race` s'arrête à la première promesse terminée",
      "`Promise.all` attend toutes les promesses, même après un rejet",
      "`Promise.any` est rejetée dès la première promesse rejetée",
    ],
    answer: [0, 1],
    explanation:
      "`allSettled` (ES2020) renvoie un objet `{ status, value | reason }` par promesse. `race` suit la première issue, succès ou échec. `all` échoue au premier rejet, `any` au contraire attend un premier succès.",
  },
  {
    id: "es-object-groupby",
    category: "es",
    level: "mid",
    type: "single",
    time: 45,
    question: "Qu'affiche ce code ?",
    code: `const groups = Object.groupBy([1, 2, 3, 4], (n) =>
  n % 2 ? 'odd' : 'even',
);
console.log(groups.odd, groups.even);`,
    options: ["[1, 3] [2, 4]", "[2, 4] [1, 3]", "2 2", "undefined undefined"],
    answer: [0],
    explanation:
      "`Object.groupBy` (ES2024) range les éléments dans un objet (sans prototype) selon la clé renvoyée par la fonction. `Map.groupBy` fait de même avec des clés de n'importe quel type.",
  },
  {
    id: "es-to-sorted",
    category: "es",
    level: "mid",
    type: "single",
    time: 40,
    question: "Qu'affiche ce code ?",
    code: `const a = [3, 1, 2];
const b = a.toSorted();
console.log(a, b);`,
    options: ["[3, 1, 2] [1, 2, 3]", "[1, 2, 3] [1, 2, 3]", "[3, 1, 2] [3, 1, 2]", "[1, 2, 3] [3, 1, 2]"],
    answer: [0],
    explanation:
      "`toSorted` (ES2023) renvoie une copie triée sans modifier l'original, contrairement à `sort`. Même principe pour `toReversed`, `toSpliced` et `with`.",
  },
  {
    id: "es-array-with",
    category: "es",
    level: "mid",
    type: "single",
    time: 40,
    question: "Qu'affiche ce code ?",
    code: `const a = [1, 2, 3];
console.log(a.with(1, 9), a);`,
    options: ["[1, 9, 3] [1, 2, 3]", "[1, 9, 3] [1, 9, 3]", "[9, 2, 3] [1, 2, 3]", "[1, 2, 3] [1, 9, 3]"],
    answer: [0],
    explanation:
      "`with(index, valeur)` (ES2023) est l'équivalent immuable de `a[index] = valeur` : il renvoie une copie modifiée. Pratique pour les mises à jour d'état React.",
  },
  {
    id: "es-find-last",
    category: "es",
    level: "mid",
    type: "single",
    time: 30,
    question: "Qu'affiche ce code ?",
    code: `console.log([1, 5, 8, 3].findLast((n) => n > 4));`,
    options: ["8", "5", "3", "[5, 8]"],
    answer: [0],
    explanation:
      "`findLast` (ES2023) parcourt le tableau depuis la fin et renvoie le premier élément qui satisfait le prédicat. `findLastIndex` renvoie son index.",
  },
  {
    id: "es-object-hasown",
    category: "es",
    level: "mid",
    type: "single",
    time: 40,
    question: "Pourquoi préférer `Object.hasOwn(obj, 'k')` à `obj.hasOwnProperty('k')` ?",
    options: [
      "Il fonctionne aussi sur un objet créé avec `Object.create(null)`",
      "Il inclut aussi les propriétés héritées par la chaîne de prototypes",
      "Il est le seul à détecter les propriétés non énumérables",
      "Il compare la valeur de la propriété en plus de sa présence",
    ],
    answer: [0],
    explanation:
      "`Object.hasOwn` (ES2022) ne dépend pas de la méthode héritée : un objet sans prototype n'a pas de `hasOwnProperty`, et un objet peut aussi la redéfinir.",
  },
  {
    id: "es-class-static-block",
    category: "es",
    level: "mid",
    type: "single",
    time: 45,
    question: "Qu'affiche ce code ?",
    code: `class Config {
  static values = [];
  static {
    Config.values.push('init');
  }
}
console.log(Config.values);`,
    options: ["['init']", "[]", "Une SyntaxError", "undefined"],
    answer: [0],
    explanation:
      "Les champs statiques et les blocs `static { }` (ES2022) s'exécutent une fois, à l'évaluation de la classe, dans l'ordre de déclaration.",
  },
  {
    id: "es-error-cause",
    category: "es",
    level: "mid",
    type: "single",
    time: 30,
    question: "Qu'affiche ce code ?",
    code: `const err = new Error('Échec du chargement', { cause: 'réseau' });
console.log(err.cause);`,
    options: ["réseau", "Échec du chargement", "undefined", "[object Object]"],
    answer: [0],
    explanation:
      "L'option `cause` (ES2022) permet de chaîner une erreur à son origine sans perdre l'information initiale, par exemple en relançant une erreur réseau avec un message métier.",
  },
  {
    id: "es-promise-with-resolvers",
    category: "es",
    level: "mid",
    type: "single",
    time: 40,
    question: "Que renvoie `Promise.withResolvers()` ?",
    options: [
      "Un objet `{ promise, resolve, reject }`",
      "Une promesse déjà résolue avec `undefined`",
      "Un tableau `[resolve, reject]` sans promesse",
      "Une fonction qui crée une nouvelle promesse",
    ],
    answer: [0],
    explanation:
      "`Promise.withResolvers` (ES2024) évite le motif qui sort `resolve` et `reject` du constructeur dans des variables extérieures.",
  },
  {
    id: "es-generator-return",
    category: "es",
    level: "mid",
    type: "single",
    time: 45,
    question: "Qu'affiche ce code ?",
    code: `function* gen() {
  yield 1;
  yield 2;
  return 3;
}
console.log([...gen()]);`,
    options: ["[1, 2]", "[1, 2, 3]", "[3]", "[]"],
    answer: [0],
    explanation:
      "La décomposition et `for…of` s'arrêtent quand `next()` renvoie `done: true`. La valeur du `return` accompagne cet état final et est donc ignorée.",
  },
  {
    id: "es-class-tdz",
    category: "es",
    level: "mid",
    type: "single",
    time: 40,
    question: "Qu'affiche ce code ?",
    code: `try {
  new Animal();
} catch (e) {
  console.log(e.name);
}
class Animal {}`,
    options: ["ReferenceError", "TypeError", "SyntaxError", "Rien, l'instance est créée"],
    answer: [0],
    explanation:
      "Comme `let` et `const`, une déclaration `class` est hissée mais reste dans la Temporal Dead Zone jusqu'à son évaluation, contrairement à une déclaration `function`.",
  },
  {
    id: "es-flat",
    category: "es",
    level: "mid",
    type: "single",
    time: 40,
    question: "Qu'affiche ce code ?",
    code: `console.log([1, [2, [3, [4]]]].flat(2));`,
    options: ["[1, 2, 3, [4]]", "[1, 2, 3, 4]", "[1, 2, [3, [4]]]", "[1, [2, [3, [4]]]]"],
    answer: [0],
    explanation:
      "`flat(profondeur)` (ES2019) aplatit le nombre de niveaux demandé, 1 par défaut. `flat(Infinity)` aplatit entièrement.",
  },
  {
    id: "es-proxy-get",
    category: "es",
    level: "mid",
    type: "single",
    time: 45,
    question: "Qu'affiche ce code ?",
    code: `const p = new Proxy({}, {
  get: (target, key) => String(key).toUpperCase(),
});
console.log(p.hello);`,
    options: ["HELLO", "undefined", "hello", "Une TypeError"],
    answer: [0],
    explanation:
      "Un `Proxy` intercepte les opérations sur l'objet cible : ici le piège `get` répond à toute lecture de propriété, même inexistante. `Reflect` fournit le comportement par défaut.",
  },
  {
    id: "es-sort-stable",
    category: "es",
    level: "mid",
    type: "single",
    time: 40,
    question: "Que garantit `Array.prototype.sort` depuis ES2019 ?",
    options: [
      "Un tri stable : les éléments égaux gardent leur ordre",
      "Un tri numérique par défaut pour les tableaux de nombres",
      "Un tri qui renvoie une copie sans modifier le tableau",
      "Un tri en temps linéaire quelle que soit la taille",
    ],
    answer: [0],
    explanation:
      "ES2019 impose la stabilité du tri. Sans comparateur, le tri reste lexicographique (chaînes) et `sort` modifie toujours le tableau en place.",
  },

  // --- Senior ----------------------------------------------------------------
  {
    id: "es-iterator-helpers",
    category: "es",
    level: "senior",
    type: "single",
    time: 60,
    question: "Qu'affiche ce code ?",
    code: `function* naturals() {
  let n = 1;
  while (true) yield n++;
}
const r = naturals()
  .filter((n) => n % 2 === 0)
  .map((n) => n * 10)
  .take(3)
  .toArray();
console.log(r);`,
    options: ["[20, 40, 60]", "[10, 20, 30]", "Une boucle infinie", "[2, 4, 6]"],
    answer: [0],
    explanation:
      "Les helpers d'itérateurs (ES2025) sont paresseux : chaque valeur traverse `filter` puis `map` à la demande, et `take(3)` arrête la consommation. Le générateur infini n'est donc jamais épuisé.",
  },
  {
    id: "es-set-methods",
    category: "es",
    level: "senior",
    type: "single",
    time: 45,
    question: "Qu'affiche ce code ?",
    code: `const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);
console.log([...a.intersection(b)], [...a.difference(b)]);`,
    options: ["[2, 3] [1]", "[2, 3] [1, 4]", "[1, 2, 3, 4] [1]", "[1] [2, 3]"],
    answer: [0],
    explanation:
      "ES2025 ajoute à `Set` les méthodes `union`, `intersection`, `difference`, `symmetricDifference`, `isSubsetOf`, `isSupersetOf` et `isDisjointFrom`. `[1, 4]` serait la différence symétrique.",
  },
  {
    id: "es-promise-try",
    category: "es",
    level: "senior",
    type: "single",
    time: 45,
    question: "Quel est l'intérêt de `Promise.try(fn)` ?",
    options: [
      "Appeler `fn` tout de suite et changer une exception synchrone en rejet",
      "Rejouer `fn` automatiquement tant que la promesse retournée échoue",
      "Différer l'appel de `fn` à la prochaine microtâche de la boucle",
      "Annuler `fn` si elle ne se termine pas avant un délai donné",
    ],
    answer: [0],
    explanation:
      "`Promise.try` (ES2025) exécute `fn` de façon synchrone et renvoie toujours une promesse : une valeur, une promesse ou une exception levée sont traitées de la même manière par `.then` / `.catch`.",
  },
  {
    id: "es-regexp-escape",
    category: "es",
    level: "senior",
    type: "single",
    time: 40,
    question: "À quoi sert `RegExp.escape(texte)` (ES2025) ?",
    options: [
      "Échapper un texte pour l'insérer tel quel dans une RegExp",
      "Retirer d'un texte tous les caractères non alphanumériques",
      "Convertir une RegExp en chaîne lisible pour les journaux",
      "Encoder un texte pour l'insérer sans risque dans du HTML",
    ],
    answer: [0],
    explanation:
      "Avant `RegExp.escape`, construire `new RegExp(saisie)` avec une saisie contenant `.`, `*` ou `(` changeait le sens du motif, voire permettait une injection de motif.",
  },
  {
    id: "es-import-attributes",
    category: "es",
    level: "senior",
    type: "single",
    time: 45,
    question: "Que signifie `with { type: 'json' }` dans cet import ?",
    code: `import config from './config.json' with { type: 'json' };`,
    options: [
      "Il impose le type attendu : un module d'un autre type est refusé",
      "Il convertit le fichier en JSON avant de l'exécuter comme du code",
      "Il charge le fichier de façon paresseuse au premier accès à `config`",
      "Il active la validation du contenu par un schéma JSON associé",
    ],
    answer: [0],
    explanation:
      "Les attributs d'import et les modules JSON (ES2025) indiquent le type attendu. Sans cette garantie, un serveur pourrait renvoyer du JavaScript exécutable à la place des données.",
  },
  {
    id: "es-top-level-await",
    category: "es",
    level: "senior",
    type: "single",
    time: 45,
    question: "Quel est l'effet d'un `await` au niveau supérieur d'un module ?",
    options: [
      "Les modules qui l'importent attendent la fin de son évaluation",
      "Le thread principal est bloqué jusqu'à la résolution de la promesse",
      "L'import du module renvoie une promesse à la place de ses exports",
      "Le module est réévalué à chaque import tant que la promesse attend",
    ],
    answer: [0],
    explanation:
      "Le top-level await (ES2022) suspend l'évaluation du module et de ceux qui en dépendent, sans bloquer le thread. Pratique pour une configuration asynchrone, mais il retarde tout le graphe en aval.",
  },
  {
    id: "es-weakref",
    category: "es",
    level: "senior",
    type: "single",
    time: 40,
    question: "Quelle affirmation sur `WeakRef` est correcte ?",
    options: [
      "`deref()` peut renvoyer `undefined` une fois l'objet collecté",
      "`deref()` empêche la collecte tant que la référence existe",
      "Une `WeakRef` peut cibler une valeur primitive comme un nombre",
      "La collecte de l'objet a lieu dès la fin de la fonction courante",
    ],
    answer: [0],
    explanation:
      "`WeakRef` (ES2021) ne retient pas son objet : le ramasse-miettes peut le libérer à un moment non déterministe. À réserver aux caches, et ne jamais en faire dépendre la logique métier.",
  },
  {
    id: "es-private-in",
    category: "es",
    level: "senior",
    type: "single",
    time: 45,
    question: "Que teste l'expression `#secret in obj` écrite dans une classe ?",
    options: [
      "Si `obj` possède le champ privé `#secret` de cette classe",
      "Si `obj` possède une propriété publique nommée `secret`",
      "Si `obj` est une instance exacte de la classe courante",
      "Si le champ `#secret` de `obj` contient une valeur définie",
    ],
    answer: [0],
    explanation:
      "Les vérifications d'appartenance de champs privés (ES2022) permettent un « brand check » fiable, sans `try/catch` et sans être trompé par une chaîne de prototypes modifiée comme peut l'être `instanceof`.",
  },
  {
    id: "es-for-await",
    category: "es",
    level: "senior",
    type: "single",
    time: 60,
    question: "Qu'affiche ce code ?",
    code: `async function* gen() {
  yield 1;
  yield 2;
}
(async () => {
  for await (const x of gen()) console.log(x);
})();
console.log('fin');`,
    options: ["fin 1 2", "1 2 fin", "1 fin 2", "fin"],
    answer: [0],
    explanation:
      "`for await…of` (ES2018) attend chaque valeur d'un itérable asynchrone. Le premier `await` rend la main : le `console.log('fin')` synchrone passe avant les valeurs du générateur.",
  },
  {
    id: "es-2025-features",
    category: "es",
    level: "senior",
    type: "multiple",
    time: 60,
    question: "Lesquelles de ces fonctionnalités ont été standardisées dans ES2025 ?",
    options: [
      "Les méthodes d'ensemble comme `Set.prototype.union`",
      "Les helpers d'itérateurs comme `Iterator.prototype.map`",
      "La méthode statique `Promise.try`",
      "La fonction de regroupement `Object.groupBy`",
      "L'opérateur de chaînage optionnel `?.`",
    ],
    answer: [0, 1, 2],
    explanation:
      "ES2025 apporte notamment les méthodes de `Set`, les helpers d'itérateurs, `Promise.try`, `RegExp.escape`, les modules JSON avec attributs d'import et `Float16Array`. `Object.groupBy` date d'ES2024 et `?.` d'ES2020.",
  },
);
