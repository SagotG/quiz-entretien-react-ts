/*
 * Questions JavaScript.
 * Format : voir README.md. Les options sont mélangées à l'affichage,
 * l'ordre dans ce fichier n'a donc aucune importance.
 */
window.QUESTION_BANK = window.QUESTION_BANK || [];
window.QUESTION_BANK.push(
  {
    id: "js-event-loop-order",
    category: "js",
    level: "mid",
    type: "single",
    time: 60,
    question: "Qu'affiche ce code dans la console ?",
    code: `console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
queueMicrotask(() => console.log(4));
console.log(5);`,
    options: ["1 5 3 4 2", "1 5 2 3 4", "1 3 4 5 2", "1 5 4 3 2"],
    answer: [0],
    explanation:
      "Le code synchrone s'exécute d'abord (1, 5). Puis la file de microtâches est vidée dans l'ordre d'enregistrement (3, 4). Le callback de `setTimeout` est une macrotâche, traitée ensuite (2).",
  },
  {
    id: "js-var-closure-loop",
    category: "js",
    level: "junior",
    type: "single",
    time: 40,
    question: "Qu'affiche ce code ?",
    code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i));
}`,
    options: ["3 3 3", "0 1 2", "2 2 2", "undefined undefined undefined"],
    answer: [0],
    explanation:
      "`var` a une portée de fonction : les trois callbacks partagent la même variable, qui vaut 3 quand ils s'exécutent. Avec `let`, chaque itération crée une nouvelle liaison et on obtient 0 1 2.",
  },
  {
    id: "js-this-detached-method",
    category: "js",
    level: "mid",
    type: "single",
    time: 45,
    question: "Que se passe-t-il à la dernière ligne ?",
    code: `'use strict';
const user = {
  name: 'Ada',
  getName() { return this.name; },
};
const fn = user.getName;
fn();`,
    options: [
      "Une `TypeError` est levée",
      "La valeur `'Ada'` est retournée",
      "La valeur `undefined` est retournée",
      "La valeur `window.name` est retournée",
    ],
    answer: [0],
    explanation:
      "`this` dépend de l'appel, pas de la définition. Appelée sans receveur en mode strict, `this` vaut `undefined` et `this.name` lève une `TypeError`. En mode sloppy dans un navigateur, `this` serait `window`.",
  },
  {
    id: "js-falsy-values",
    category: "js",
    level: "junior",
    type: "multiple",
    time: 45,
    question: "Lesquelles de ces valeurs sont falsy ?",
    options: ["`[]`", "`'0'`", "`NaN`", "`-0`", "`{}`", "`0n`"],
    answer: [2, 3, 5],
    explanation:
      "Les valeurs falsy sont : `false`, `0`, `-0`, `0n`, `''`, `null`, `undefined` et `NaN` (plus `document.all`). Tout objet, y compris `[]` et `{}`, ainsi que la chaîne `'0'`, est truthy.",
  },
  {
    id: "js-hoisting-tdz",
    category: "js",
    level: "junior",
    type: "single",
    time: 45,
    question: "Qu'affiche ce code ?",
    code: `console.log(a);
console.log(b);
var a = 1;
let b = 2;`,
    options: [
      "`undefined`, puis une `ReferenceError`",
      "Une `ReferenceError` dès la première ligne",
      "`undefined`, puis `undefined`",
      "`1`, puis `2`",
    ],
    answer: [0],
    explanation:
      "`var` est hissé et initialisé à `undefined`. `let`/`const` sont hissés mais restent dans la Temporal Dead Zone jusqu'à leur déclaration : y accéder lève une `ReferenceError`.",
  },
  {
    id: "js-promise-all-reject",
    category: "js",
    level: "junior",
    type: "single",
    time: 40,
    question: "Que se passe-t-il quand l'une des promesses passées à `Promise.all` est rejetée ?",
    options: [
      "La promesse retournée est rejetée dès ce premier rejet",
      "La promesse retournée attend les autres puis est rejetée",
      "La promesse retournée est résolue avec les valeurs obtenues",
      "Les autres promesses en cours sont annulées par le moteur",
    ],
    answer: [0],
    explanation:
      "`Promise.all` échoue rapidement (fail-fast) avec la raison du premier rejet. Les autres opérations continuent : une promesse n'est pas annulable (il faut `AbortController`). `Promise.allSettled` attend toutes les issues.",
  },
  {
    id: "js-async-await-facts",
    category: "js",
    level: "mid",
    type: "multiple",
    time: 60,
    question: "Quelles affirmations sur `async` / `await` sont vraies ?",
    options: [
      "Une fonction `async` retourne toujours une `Promise`",
      "`await` sur une valeur non-promesse reporte quand même la suite",
      "Une exception levée dans une fonction `async` rejette sa `Promise`",
      "`await` bloque le thread principal jusqu'à la résolution",
      "`forEach` attend chaque callback `async` avant de continuer",
    ],
    answer: [0, 1, 2],
    explanation:
      "`await` suspend uniquement la fonction courante (la suite est planifiée en microtâche, même pour une valeur simple) sans bloquer le thread. `forEach` ignore les promesses retournées : utiliser `for…of` ou `Promise.all`.",
  },
  {
    id: "js-weakmap",
    category: "js",
    level: "senior",
    type: "single",
    time: 40,
    question: "Quel est l'intérêt principal d'une `WeakMap` ?",
    options: [
      "Ses clés n'empêchent pas le ramasse-miettes de libérer les objets",
      "Ses valeurs sont stockées de façon compressée dans le tas mémoire",
      "Elle est itérable et conserve l'ordre d'insertion de ses entrées",
      "Elle accepte des clés primitives avec un accès plus rapide",
    ],
    answer: [0],
    explanation:
      "Les clés d'une `WeakMap` sont des objets tenus faiblement : idéal pour associer des métadonnées à un objet sans fuite mémoire. En contrepartie, elle n'est pas itérable et n'a pas de `size`.",
  },
  {
    id: "js-prototype-reassign",
    category: "js",
    level: "senior",
    type: "single",
    time: 60,
    question: "Qu'affiche ce code ?",
    code: `function Person() {}
Person.prototype.greet = function () { return 'hi'; };

const p = new Person();
Person.prototype = { greet() { return 'hello'; } };

console.log(p.greet());`,
    options: ["`'hi'`", "`'hello'`", "`undefined`", "Une `TypeError`"],
    answer: [0],
    explanation:
      "`new` lie `p` à l'objet référencé par `Person.prototype` au moment de la construction. Réassigner `Person.prototype` ensuite n'affecte que les futures instances.",
  },
  {
    id: "js-spread-shallow",
    category: "js",
    level: "junior",
    type: "single",
    time: 45,
    question: "Qu'affiche ce code ?",
    code: `const a = { x: 1, nested: { y: 2 } };
const b = { ...a };
b.x = 10;
b.nested.y = 20;
console.log(a.x, a.nested.y);`,
    options: ["1 20", "1 2", "10 20", "10 2"],
    answer: [0],
    explanation:
      "Le spread fait une copie superficielle : `x` est copié par valeur, mais `nested` est la même référence dans les deux objets. Pour une copie profonde : `structuredClone(a)`.",
  },
  {
    id: "js-structured-clone",
    category: "js",
    level: "mid",
    type: "single",
    time: 40,
    question: "Laquelle de ces valeurs `structuredClone` ne sait-il pas cloner ?",
    options: [
      "Un objet contenant une fonction",
      "Un objet contenant une `Map`",
      "Un objet contenant une `Date`",
      "Un objet avec une référence circulaire",
    ],
    answer: [0],
    explanation:
      "L'algorithme de clonage structuré gère `Map`, `Set`, `Date`, `RegExp`, les typed arrays et les références circulaires, mais lève une `DataCloneError` pour les fonctions et les nœuds DOM. Les prototypes de classe sont perdus.",
  },
  {
    id: "js-generator-next-value",
    category: "js",
    level: "senior",
    type: "single",
    time: 60,
    question: "Qu'affiche ce code ?",
    code: `function* gen() {
  const x = yield 1;
  yield x * 2;
}
const g = gen();
g.next();
console.log(g.next(5).value);`,
    options: ["`10`", "`NaN`", "`2`", "`undefined`"],
    answer: [0],
    explanation:
      "Le premier `next()` avance jusqu'au premier `yield`. L'argument du `next` suivant devient la valeur de l'expression `yield 1`, donc `x = 5` et le second `yield` produit 10.",
  },
  {
    id: "js-esm-vs-cjs",
    category: "js",
    level: "mid",
    type: "multiple",
    time: 60,
    question: "Quelles affirmations sur les modules ES (ESM) sont vraies ?",
    options: [
      "Les imports sont des liaisons vivantes vers les exports",
      "Les `import` statiques sont résolus avant l'exécution du module",
      "Un module est réexécuté à chaque fois qu'il est importé",
      "`import()` renvoie le module de façon synchrone",
    ],
    answer: [0, 1],
    explanation:
      "Le graphe ESM est analysé statiquement avant exécution (ce qui permet le tree-shaking). Un module n'est évalué qu'une fois puis mis en cache. `import()` retourne une `Promise`.",
  },
  {
    id: "js-debounce",
    category: "js",
    level: "junior",
    type: "single",
    time: 30,
    question: "Un champ de recherche ne doit appeler l'API que lorsque l'utilisateur a cessé de taper depuis 300 ms. Quelle technique ?",
    options: ["Debounce", "Throttle", "Memoization", "`requestIdleCallback`"],
    answer: [0],
    explanation:
      "Le debounce repousse l'exécution tant que les appels se succèdent. Le throttle garantit au plus une exécution par intervalle, même pendant la frappe. Côté Angular/RxJS : `debounceTime` vs `throttleTime`.",
  },
  {
    id: "js-object-freeze-shallow",
    category: "js",
    level: "mid",
    type: "single",
    time: 45,
    question: "En mode non strict, qu'affiche ce code ?",
    code: `const o = Object.freeze({ a: 1, inner: { b: 2 } });
o.a = 5;
o.inner.b = 6;
console.log(o.a, o.inner.b);`,
    options: ["1 6", "1 2", "5 6", "Une `TypeError`"],
    answer: [0],
    explanation:
      "`Object.freeze` est superficiel : `inner` reste mutable. En mode non strict, l'écriture sur `o.a` échoue silencieusement ; en mode strict elle lèverait une `TypeError`.",
  },
  {
    id: "js-null-comparison",
    category: "js",
    level: "mid",
    type: "single",
    time: 45,
    question: "Qu'affiche ce code ?",
    code: `console.log(null == 0, null >= 0);`,
    options: ["false true", "false false", "true true", "true false"],
    answer: [0],
    explanation:
      "`==` ne convertit pas `null` en nombre : `null` n'est égal (au sens large) qu'à `undefined`. Les opérateurs relationnels, eux, convertissent `null` en `0`, donc `0 >= 0` est vrai.",
  },
  {
    id: "js-non-mutating-array",
    category: "js",
    level: "junior",
    type: "multiple",
    time: 45,
    question: "Quelles méthodes retournent un nouveau tableau sans modifier l'original ?",
    options: ["`map`", "`toSorted`", "`slice`", "`sort`", "`splice`", "`reverse`"],
    answer: [0, 1, 2],
    explanation:
      "`sort`, `splice` et `reverse` mutent le tableau. ES2023 a ajouté les équivalents non mutants `toSorted`, `toSpliced`, `toReversed` et `with`, utiles pour l'immutabilité attendue par React.",
  },
  {
    id: "js-async-order",
    category: "js",
    level: "mid",
    type: "single",
    time: 45,
    question: "Qu'affiche ce code ?",
    code: `async function f() {
  console.log('a');
  await null;
  console.log('b');
}
f();
console.log('c');`,
    options: ["a c b", "a b c", "c a b", "a c"],
    answer: [0],
    explanation:
      "Le corps d'une fonction `async` s'exécute de façon synchrone jusqu'au premier `await`. La suite est planifiée en microtâche, exécutée après le code synchrone restant.",
  },
  {
    id: "js-nullish-vs-or",
    category: "js",
    level: "junior",
    type: "single",
    time: 30,
    question: "Qu'affiche ce code ?",
    code: `const v = 0 || 5;
const w = 0 ?? 5;
console.log(v, w);`,
    options: ["5 0", "0 0", "5 5", "0 5"],
    answer: [0],
    explanation:
      "`||` retourne l'opérande droit si le gauche est falsy (`0` l'est). `??` ne le fait que si le gauche est `null` ou `undefined`.",
  },
  {
    id: "js-for-of-object",
    category: "js",
    level: "junior",
    type: "single",
    time: 40,
    question: "Que se passe-t-il ?",
    code: `for (const x of { a: 1, b: 2 }) {
  console.log(x);
}`,
    options: [
      "Une `TypeError` : l'objet n'est pas itérable",
      "La boucle affiche les clés `a` puis `b`",
      "La boucle affiche les valeurs `1` puis `2`",
      "La boucle ne s'exécute jamais et ne lève aucune erreur",
    ],
    answer: [0],
    explanation:
      "`for…of` exige un itérable (`Symbol.iterator`). Un objet littéral n'en a pas : utiliser `Object.keys`, `Object.values` ou `Object.entries`. `for…in` itère sur les clés énumérables.",
  },
  {
    id: "js-prevent-default",
    category: "js",
    level: "junior",
    type: "single",
    time: 30,
    question: "Que fait `event.preventDefault()` ?",
    options: [
      "Il annule l'action native sans stopper la propagation",
      "Il stoppe la propagation sans annuler l'action native",
      "Il annule l'action native et stoppe la propagation",
      "Il retire l'écouteur après sa première exécution",
    ],
    answer: [0],
    explanation:
      "`preventDefault` annule le comportement par défaut (soumission, navigation…). `stopPropagation` arrête la remontée. `{ once: true }` dans `addEventListener` retire l'écouteur après un appel.",
  },
  {
    id: "js-closure-counter",
    category: "js",
    level: "junior",
    type: "single",
    time: 45,
    question: "Qu'affiche ce code ?",
    code: `function makeCounter() {
  let count = 0;
  return () => ++count;
}
const c1 = makeCounter();
const c2 = makeCounter();
c1(); c1();
console.log(c1(), c2());`,
    options: ["3 1", "3 3", "1 1", "3 4", "2 1"],
    answer: [0],
    explanation:
      "Chaque appel à `makeCounter` crée un nouvel environnement lexical : `c1` et `c2` ont chacun leur propre `count`. `++count` incrémente puis retourne la nouvelle valeur.",
  },
  // --- Pièges de coercition et de sortie console ----------------------------
  {
    id: "js-out-plus-arrays",
    category: "js",
    level: "mid",
    type: "single",
    time: 45,
    question: "Qu'affiche ce code ?",
    code: `console.log(typeof ([] + []), [] + {});`,
    options: ["string [object Object]", "object [object Object]", "string NaN", "object 0"],
    answer: [0],
    explanation:
      "`+` avec des objets les convertit en primitives : `[]` devient `''` et `{}` devient `'[object Object]'`. Dès qu'un opérande est une chaîne, `+` concatène.",
  },
  {
    id: "js-out-chained-comparison",
    category: "js",
    level: "mid",
    type: "single",
    time: 40,
    question: "Qu'affiche ce code ?",
    code: `console.log(1 < 2 < 3, 3 > 2 > 1);`,
    options: ["true false", "true true", "false false", "false true"],
    answer: [0],
    explanation:
      "Les comparaisons s'évaluent de gauche à droite : `(1 < 2) < 3` donne `true < 3`, soit `1 < 3`. `(3 > 2) > 1` donne `true > 1`, soit `1 > 1`, qui est faux.",
  },
  {
    id: "js-out-string-arithmetic",
    category: "js",
    level: "junior",
    type: "single",
    time: 40,
    question: "Qu'affiche ce code ?",
    code: `console.log('5' - 2, '5' + 2, '5' * '2');`,
    options: ["3 52 10", "3 7 10", "NaN 52 10", "3 52 NaN"],
    answer: [0],
    explanation:
      "`+` concatène dès qu'un opérande est une chaîne. `-`, `*` et `/` sont uniquement numériques et convertissent leurs opérandes en nombres.",
  },
  {
    id: "js-out-nan",
    category: "js",
    level: "junior",
    type: "single",
    time: 40,
    question: "Qu'affiche ce code ?",
    code: `console.log(typeof NaN, NaN === NaN, Object.is(NaN, NaN));`,
    options: ["number false true", "number false false", "NaN false true", "undefined true true"],
    answer: [0],
    explanation:
      "`NaN` est de type `number` et c'est la seule valeur différente d'elle-même avec `===`. `Object.is` (SameValue) le considère égal à lui-même, et distingue `0` de `-0`.",
  },
  {
    id: "js-out-float",
    category: "js",
    level: "junior",
    type: "single",
    time: 30,
    question: "Qu'affiche ce code ?",
    code: `console.log(0.1 + 0.2 === 0.3, 0.1 + 0.2);`,
    options: ["false 0.30000000000000004", "true 0.3", "false 0.29999999999999999", "true 0.30000000000000004"],
    answer: [0],
    explanation:
      "Les nombres sont des flottants IEEE 754 : `0.1` et `0.2` n'ont pas de représentation binaire exacte. Comparer avec une tolérance (`Number.EPSILON`) ou travailler en entiers (centimes).",
  },
  {
    id: "js-out-default-sort",
    category: "js",
    level: "junior",
    type: "single",
    time: 40,
    question: "Qu'affiche ce code ?",
    code: `console.log([10, 1, 2].sort());`,
    options: ["[1, 10, 2]", "[1, 2, 10]", "[10, 2, 1]", "[10, 1, 2]"],
    answer: [0],
    explanation:
      "Sans comparateur, `sort` convertit les éléments en chaînes et les trie par ordre UTF-16 : `'1' < '10' < '2'`. Pour des nombres : `sort((a, b) => a - b)`.",
  },
  {
    id: "js-out-map-parseint",
    category: "js",
    level: "senior",
    type: "single",
    time: 60,
    question: "Qu'affiche ce code ?",
    code: `console.log(['1', '2', '3'].map(parseInt));`,
    options: ["[1, NaN, NaN]", "[1, 2, 3]", "[1, NaN, 3]", "[NaN, NaN, NaN]"],
    answer: [0],
    explanation:
      "`map` passe `(valeur, index)` et `parseInt` interprète le second argument comme la base : `parseInt('1', 0)` → 1 (base auto), `parseInt('2', 1)` → NaN (base invalide), `parseInt('3', 2)` → NaN (3 n'est pas un chiffre binaire).",
  },
  {
    id: "js-out-unary-plus",
    category: "js",
    level: "mid",
    type: "single",
    time: 45,
    question: "Qu'affiche ce code ?",
    code: `console.log(+true, +'', +' 42 ', +'4px');`,
    options: ["1 0 42 NaN", "1 NaN 42 NaN", "1 0 NaN NaN", "1 0 42 4"],
    answer: [0],
    explanation:
      "Le `+` unaire applique `Number()` : `true` → 1, la chaîne vide → 0, les espaces autour sont ignorés, mais tout caractère non numérique donne `NaN` (contrairement à `parseInt('4px')` qui donne 4).",
  },
  {
    id: "js-out-null-undefined-plus",
    category: "js",
    level: "mid",
    type: "single",
    time: 30,
    question: "Qu'affiche ce code ?",
    code: `console.log(null + 1, undefined + 1);`,
    options: ["1 NaN", "NaN NaN", "1 1", "null1 undefined1"],
    answer: [0],
    explanation:
      "En contexte numérique, `null` est converti en `0` et `undefined` en `NaN`. Aucune chaîne n'est impliquée, donc pas de concaténation.",
  },
  {
    id: "js-out-typeof-quirks",
    category: "js",
    level: "junior",
    type: "single",
    time: 40,
    question: "Qu'affiche ce code ?",
    code: `console.log(typeof null, typeof function () {}, typeof []);`,
    options: ["object function object", "null function array", "object object object", "null function object"],
    answer: [0],
    explanation:
      "`typeof null === 'object'` est un bug historique conservé. Les fonctions ont leur propre résultat `'function'`. Pour détecter un tableau : `Array.isArray`.",
  },
  {
    id: "js-out-array-loose-equality",
    category: "js",
    level: "senior",
    type: "single",
    time: 60,
    question: "Qu'affiche ce code ?",
    code: `console.log([] == false, !![], [0] == false);`,
    options: ["true true true", "false true false", "true false true", "false false false"],
    answer: [0],
    explanation:
      "Avec `==`, le booléen devient un nombre (0) et le tableau une primitive : `[]` → `''` → 0, `[0]` → `'0'` → 0. Pourtant tout objet est truthy, donc `!![]` vaut `true`.",
  },
  {
    id: "js-out-math-max-empty",
    category: "js",
    level: "mid",
    type: "single",
    time: 30,
    question: "Qu'affiche ce code ?",
    code: `console.log(Math.max(), Math.min());`,
    options: ["-Infinity Infinity", "Infinity -Infinity", "0 0", "undefined undefined"],
    answer: [0],
    explanation:
      "Sans argument, chaque fonction retourne son élément neutre : `-Infinity` pour `max` (toute valeur est plus grande) et `Infinity` pour `min`. Attention à `Math.max(...[])`.",
  },
  {
    id: "js-out-array-plus-array",
    category: "js",
    level: "mid",
    type: "single",
    time: 40,
    question: "Qu'affiche ce code ?",
    code: `console.log([1, 2, 3] + [4, 5]);`,
    options: ["1,2,34,5", "[1, 2, 3, 4, 5]", "1,2,3,4,5", "NaN"],
    answer: [0],
    explanation:
      "Chaque tableau est converti en chaîne via `join(',')` : `'1,2,3' + '4,5'`. Pour fusionner : `[...a, ...b]` ou `a.concat(b)`.",
  },
  {
    id: "js-out-sparse-array",
    category: "js",
    level: "senior",
    type: "single",
    time: 60,
    question: "Qu'affiche ce code ?",
    code: `const a = [1, 2, 3];
a[10] = 11;
console.log(a.length, a.filter(() => true).length);`,
    options: ["11 4", "11 11", "4 4", "4 11"],
    answer: [0],
    explanation:
      "Écrire à l'index 10 crée un tableau creux de longueur 11. Les méthodes `filter`, `map`, `forEach` ignorent les trous, d'où 4 éléments retenus.",
  },
  {
    id: "js-out-banana",
    category: "js",
    level: "mid",
    type: "single",
    time: 40,
    question: "Qu'affiche ce code ?",
    code: `console.log('b' + 'a' + +'a' + 'a');`,
    options: ["baNaNa", "baaa", "ba+aa", "Une SyntaxError"],
    answer: [0],
    explanation:
      "`+'a'` est un plus unaire appliqué à `'a'`, ce qui donne `NaN`, ensuite concaténé : `'ba' + NaN + 'a'`.",
  },
  {
    id: "js-out-delete-array",
    category: "js",
    level: "mid",
    type: "single",
    time: 40,
    question: "Qu'affiche ce code ?",
    code: `const arr = [1, 2, 3];
delete arr[1];
console.log(arr.length, arr[1]);`,
    options: ["3 undefined", "2 3", "2 undefined", "3 null"],
    answer: [0],
    explanation:
      "`delete` retire la propriété sans réindexer : le tableau garde sa longueur et l'index 1 devient un trou. Pour supprimer un élément : `splice` ou `toSpliced`.",
  },
  {
    id: "js-out-typeof-typeof",
    category: "js",
    level: "junior",
    type: "single",
    time: 30,
    question: "Qu'affiche ce code ?",
    code: `console.log(typeof typeof 1);`,
    options: ["string", "number", "undefined", "object"],
    answer: [0],
    explanation: "`typeof 1` vaut `'number'`, qui est une chaîne. `typeof` retourne donc toujours une chaîne.",
  },
  {
    id: "js-out-unary-chain",
    category: "js",
    level: "mid",
    type: "single",
    time: 45,
    question: "Qu'affiche ce code ?",
    code: `console.log(1 + - + + + - + 1);`,
    options: ["2", "0", "Une SyntaxError", "NaN"],
    answer: [0],
    explanation:
      "Séparés par des espaces, ce sont des opérateurs unaires (pas `++`) appliqués de droite à gauche au second `1`. Deux `-` s'annulent : on obtient `1 + 1`.",
  },
  {
    id: "js-out-string-length",
    category: "js",
    level: "senior",
    type: "single",
    time: 45,
    question: "Qu'affiche ce code ?",
    code: `console.log([...'héllo'].length, '😀'.length);`,
    options: ["5 2", "5 1", "6 2", "6 1"],
    answer: [0],
    explanation:
      "`length` compte les unités UTF-16 : un emoji hors BMP occupe deux unités (paire de substitution). Le spread itère par point de code, d'où 5 pour `'héllo'` (avec un é précomposé).",
  },
  {
    id: "js-out-isnan",
    category: "js",
    level: "mid",
    type: "single",
    time: 30,
    question: "Qu'affiche ce code ?",
    code: `console.log(isNaN('abc'), Number.isNaN('abc'));`,
    options: ["true false", "true true", "false false", "false true"],
    answer: [0],
    explanation:
      "La fonction globale `isNaN` convertit d'abord son argument en nombre (`'abc'` → NaN). `Number.isNaN` ne convertit pas : il ne renvoie `true` que pour la valeur `NaN` elle-même.",
  },
  {
    id: "js-out-negative-zero",
    category: "js",
    level: "mid",
    type: "single",
    time: 45,
    question: "Qu'affiche ce code ?",
    code: `console.log(0 === -0, Object.is(0, -0), 1 / -0);`,
    options: ["true false -Infinity", "true true Infinity", "false false -Infinity", "true false Infinity"],
    answer: [0],
    explanation:
      "`===` considère `0` et `-0` comme égaux, `Object.is` les distingue. Le signe du zéro se voit dans une division : `1 / -0` donne `-Infinity`.",
  },
  {
    id: "js-out-boolean-arithmetic",
    category: "js",
    level: "mid",
    type: "single",
    time: 40,
    question: "Qu'affiche ce code ?",
    code: `console.log(true + true, true + '1', [] * 2);`,
    options: ["2 true1 0", "2 2 0", "true1 true1 NaN", "2 true1 NaN"],
    answer: [0],
    explanation:
      "`true` vaut 1 en contexte numérique. Avec une chaîne, `+` concatène (`'true1'`). `[]` devient `''` puis `0` pour la multiplication.",
  },
  {
    id: "js-out-loose-equality-true",
    category: "js",
    level: "senior",
    type: "multiple",
    time: 60,
    question: "Lesquelles de ces expressions valent `true` ?",
    options: ["`null == undefined`", "`NaN == NaN`", "`'' == 0`", "`'0' == false`", "`null == false`", "`[1] == 1`"],
    answer: [0, 2, 3, 5],
    explanation:
      "`null` n'est égal (au sens large) qu'à `undefined`, jamais à `false` ni à `0`. Les autres cas convertissent tout en nombres : `''` → 0, `false` → 0, `[1]` → `'1'` → 1. `NaN` n'est égal à rien.",
  },
  {
    id: "js-out-typeof-object",
    category: "js",
    level: "junior",
    type: "multiple",
    time: 45,
    question: "Pour quelles valeurs `typeof` retourne-t-il `'object'` ?",
    options: ["`null`", "`[]`", "`new Date()`", "`function () {}`", "`Symbol()`", "`NaN`"],
    answer: [0, 1, 2],
    explanation:
      "Tableaux, dates et `null` donnent `'object'`. Les fonctions donnent `'function'`, les symboles `'symbol'` et `NaN` `'number'`.",
  },

  // --- Pièges de comparaison ----------------------------------------------
  {
    id: "js-cmp-string-numbers",
    category: "js",
    level: "mid",
    type: "single",
    time: 40,
    question: "Qu'affiche ce code ?",
    code: `console.log('10' < '9', 10 < '9');`,
    options: ["true false", "false false", "false true", "true true"],
    answer: [0],
    explanation:
      "Entre deux chaînes, `<` compare caractère par caractère (ordre UTF-16) : `'1'` < `'9'`. Dès qu'un opérande est un nombre, l'autre est converti : `10 < 9` est faux.",
  },
  {
    id: "js-cmp-case",
    category: "js",
    level: "mid",
    type: "single",
    time: 45,
    question: "Qu'affiche ce code ?",
    code: `console.log('a' < 'b', 'B' < 'a', 'a' < 'B');`,
    options: ["true true false", "true false true", "true false false", "true true true"],
    answer: [0],
    explanation:
      "La comparaison de chaînes suit les codes UTF-16 : toutes les majuscules (65–90) précèdent les minuscules (97–122). Pour un tri « humain » : `localeCompare` ou `Intl.Collator`.",
  },
  {
    id: "js-cmp-undefined-zero",
    category: "js",
    level: "senior",
    type: "single",
    time: 45,
    question: "Qu'affiche ce code ?",
    code: `console.log(undefined == 0, undefined >= 0, undefined <= 0);`,
    options: ["false false false", "false true true", "true true true", "false true false"],
    answer: [0],
    explanation:
      "`undefined` converti en nombre donne `NaN`, et toute comparaison relationnelle avec `NaN` est fausse. Avec `==`, `undefined` n'est égal qu'à `null` (et à lui-même). À comparer avec `null >= 0`, qui est vrai.",
  },
  {
    id: "js-cmp-object-identity",
    category: "js",
    level: "junior",
    type: "single",
    time: 30,
    question: "Qu'affiche ce code ?",
    code: `console.log({} === {}, [] == []);`,
    options: ["false false", "true true", "false true", "true false"],
    answer: [0],
    explanation:
      "Les objets sont comparés par référence, avec `==` comme avec `===` : deux littéraux créent deux objets distincts. La conversion en primitive n'a lieu que si l'autre opérande est une primitive.",
  },
  {
    id: "js-cmp-shared-reference",
    category: "js",
    level: "junior",
    type: "single",
    time: 30,
    question: "Qu'affiche ce code ?",
    code: `const a = { x: 1 };
const b = a;
b.x = 2;
console.log(a === b, a.x);`,
    options: ["true 2", "false 1", "true 1", "false 2"],
    answer: [0],
    explanation:
      "`b = a` copie la référence, pas l'objet : `a` et `b` désignent le même objet, donc la modification est visible des deux côtés.",
  },
  {
    id: "js-cmp-string-wrapper",
    category: "js",
    level: "mid",
    type: "single",
    time: 45,
    question: "Qu'affiche ce code ?",
    code: `console.log('abc' == new String('abc'), 'abc' === new String('abc'));`,
    options: ["true false", "true true", "false false", "false true"],
    answer: [0],
    explanation:
      "`new String()` crée un objet enveloppe, de type `'object'`. `==` le convertit en primitive (`'abc'`), alors que `===` constate des types différents. D'où la règle : jamais de `new String` / `new Number`.",
  },
  {
    id: "js-cmp-array-string",
    category: "js",
    level: "mid",
    type: "single",
    time: 40,
    question: "Qu'affiche ce code ?",
    code: `console.log([1, 2] == '1,2', [1, 2] === '1,2');`,
    options: ["true false", "false false", "true true", "false true"],
    answer: [0],
    explanation:
      "Face à une chaîne, `==` convertit le tableau via `toString()`, soit `'1,2'`. `===` ne fait aucune conversion : un objet n'est jamais strictement égal à une chaîne.",
  },
  {
    id: "js-cmp-null-undefined-negative",
    category: "js",
    level: "senior",
    type: "single",
    time: 40,
    question: "Qu'affiche ce code ?",
    code: `console.log(null > -1, undefined > -1);`,
    options: ["true false", "true true", "false false", "false true"],
    answer: [0],
    explanation:
      "En comparaison relationnelle, `null` devient `0` (donc `0 > -1`) alors que `undefined` devient `NaN` (comparaison toujours fausse).",
  },
  {
    id: "js-cmp-nan-relational",
    category: "js",
    level: "junior",
    type: "single",
    time: 30,
    question: "Qu'affiche ce code ?",
    code: `console.log(NaN < 1, NaN > 1, NaN == NaN);`,
    options: ["false false false", "true false false", "false true false", "false false true"],
    answer: [0],
    explanation:
      "Toute comparaison impliquant `NaN` retourne `false`, y compris `NaN == NaN`. Seul `!=` retourne `true`.",
  },
  {
    id: "js-cmp-true-string",
    category: "js",
    level: "mid",
    type: "single",
    time: 45,
    question: "Qu'affiche ce code ?",
    code: `console.log(true == '1', true == 'true');`,
    options: ["true false", "true true", "false true", "false false"],
    answer: [0],
    explanation:
      "Avec `==`, le booléen est d'abord converti en nombre (`true` → 1), puis la chaîne aussi : `'1'` → 1, mais `'true'` → `NaN`. Écrire `if (x == true)` est donc un piège.",
  },
  {
    id: "js-cmp-nested-array",
    category: "js",
    level: "senior",
    type: "single",
    time: 40,
    question: "Qu'affiche ce code ?",
    code: `console.log(2 == [[[2]]]);`,
    options: ["true", "false", "TypeError", "undefined"],
    answer: [0],
    explanation:
      "Le tableau est converti en primitive via `toString()`, qui s'applique récursivement : `[[[2]]]` → `'2'` → 2.",
  },
  {
    id: "js-cmp-transitivity",
    category: "js",
    level: "senior",
    type: "single",
    time: 45,
    question: "Qu'affiche ce code ?",
    code: `console.log(0 == '', 0 == '0', '' == '0');`,
    options: ["true true false", "true true true", "false true false", "true false false"],
    answer: [0],
    explanation:
      "`==` n'est pas transitif. Avec un nombre, les chaînes sont converties (`''` → 0, `'0'` → 0). Entre deux chaînes, aucune conversion : `''` et `'0'` sont différentes.",
  },
  {
    id: "js-cmp-infinity",
    category: "js",
    level: "mid",
    type: "single",
    time: 45,
    question: "Qu'affiche ce code ?",
    code: `console.log(Infinity > Infinity, -Infinity < Infinity, Infinity - Infinity);`,
    options: ["false true NaN", "false true 0", "true true NaN", "false false 0"],
    answer: [0],
    explanation:
      "`Infinity` est égal à lui-même, donc pas strictement supérieur. En revanche `Infinity - Infinity` est une forme indéterminée, qui donne `NaN`.",
  },
  {
    id: "js-cmp-array-relational",
    category: "js",
    level: "senior",
    type: "single",
    time: 45,
    question: "Qu'affiche ce code ?",
    code: `console.log([2] > 1, [2, 3] > 1);`,
    options: ["true false", "true true", "false false", "false true"],
    answer: [0],
    explanation:
      "Le tableau passe par `toString()` puis `Number()` : `[2]` → `'2'` → 2, mais `[2, 3]` → `'2,3'` → `NaN`.",
  },
  {
    id: "js-cmp-date-hint",
    category: "js",
    level: "senior",
    type: "single",
    time: 60,
    question: "Qu'affiche ce code ?",
    code: `console.log(new Date(0) == 0, new Date(0) < 1);`,
    options: ["false true", "true true", "true false", "false false"],
    answer: [0],
    explanation:
      "Pour `==`, une `Date` est convertie avec l'indice « default », qui donne une chaîne (`'Thu Jan 01 1970…'`) puis `NaN`. Pour `<`, l'indice est « number » : `valueOf()` donne 0.",
  },
  {
    id: "js-cmp-symbol",
    category: "js",
    level: "mid",
    type: "single",
    time: 40,
    question: "Qu'affiche ce code ?",
    code: `console.log(Symbol('a') === Symbol('a'), Symbol.for('a') === Symbol.for('a'));`,
    options: ["false true", "true true", "false false", "true false"],
    answer: [0],
    explanation:
      "Chaque appel à `Symbol()` crée un symbole unique, la description ne sert qu'au débogage. `Symbol.for` passe par un registre global et renvoie le même symbole pour la même clé.",
  },
  {
    id: "js-cmp-float-exact",
    category: "js",
    level: "mid",
    type: "single",
    time: 45,
    question: "Qu'affiche ce code ?",
    code: `console.log(0.1 * 3 === 0.3, 0.5 + 0.25 === 0.75);`,
    options: ["false true", "false false", "true true", "true false"],
    answer: [0],
    explanation:
      "`0.5` et `0.25` sont des puissances de 2, donc représentées exactement en binaire. `0.1` ne l'est pas : `0.1 * 3` donne `0.30000000000000004`.",
  },
  {
    id: "js-cmp-safe-integer",
    category: "js",
    level: "senior",
    type: "single",
    time: 45,
    question: "Qu'affiche ce code ?",
    code: `const max = Number.MAX_SAFE_INTEGER;
console.log(max + 1 === max + 2);`,
    options: ["true", "false", "RangeError", "undefined"],
    answer: [0],
    explanation:
      "Au-delà de 2^53 - 1, un `number` ne représente plus tous les entiers : `max + 2` est arrondi à `max + 1`. Pour les grands entiers : `BigInt` (`9007199254740993n`).",
  },
  {
    id: "js-cmp-bigint",
    category: "js",
    level: "mid",
    type: "single",
    time: 40,
    question: "Qu'affiche ce code ?",
    code: `console.log(1n == 1, 1n === 1, typeof 1n);`,
    options: ["true false bigint", "true true number", "false false bigint", "true false number"],
    answer: [0],
    explanation:
      "`==` compare la valeur mathématique d'un `bigint` et d'un `number`. `===` exige le même type. Attention : `1n + 1` lève une `TypeError`, on ne mélange pas les deux types en arithmétique.",
  },
  {
    id: "js-cmp-array-single-string",
    category: "js",
    level: "mid",
    type: "single",
    time: 40,
    question: "Qu'affiche ce code ?",
    code: `console.log(['a'] == 'a', ['a'] == ['a']);`,
    options: ["true false", "true true", "false false", "false true"],
    answer: [0],
    explanation:
      "Face à une chaîne, `['a']` est converti en `'a'`. Entre deux tableaux, `==` compare les références, et il s'agit de deux objets distincts.",
  },
  {
    id: "js-cmp-switch-strict",
    category: "js",
    level: "junior",
    type: "single",
    time: 40,
    question: "Qu'affiche ce code ?",
    code: `const x = '1';
switch (x) {
  case 1:
    console.log('number');
    break;
  case '1':
    console.log('string');
    break;
  default:
    console.log('default');
}`,
    options: ["string", "number", "default", "number puis string"],
    answer: [0],
    explanation:
      "`switch` compare avec `===` : `'1'` ne correspond pas à `case 1`. Grâce aux `break`, seul le bloc correspondant s'exécute.",
  },
  {
    id: "js-cmp-includes-nan",
    category: "js",
    level: "mid",
    type: "single",
    time: 45,
    question: "Qu'affiche ce code ?",
    code: `console.log([NaN].includes(NaN), [NaN].indexOf(NaN));`,
    options: ["true -1", "true 0", "false -1", "false 0"],
    answer: [0],
    explanation:
      "`indexOf` utilise `===`, donc ne trouve jamais `NaN`. `includes` utilise SameValueZero, qui considère `NaN` égal à lui-même.",
  },
  {
    id: "js-cmp-not-not",
    category: "js",
    level: "junior",
    type: "single",
    time: 30,
    question: "Qu'affiche ce code ?",
    code: `console.log(!!'false', !!'0', !!' ');`,
    options: ["true true true", "false false true", "false false false", "true false true"],
    answer: [0],
    explanation:
      "Toute chaîne non vide est truthy, quel que soit son contenu. Seule la chaîne vide `''` est falsy.",
  },
  {
    id: "js-cmp-relational-true",
    category: "js",
    level: "senior",
    type: "multiple",
    time: 60,
    question: "Lesquelles de ces comparaisons valent `true` ?",
    options: ["`'2' > '12'`", "`'2' > 12`", "`[] < 1`", "`({}) < 1`", "`'Z' < 'a'`", "`'é' < 'z'`"],
    answer: [0, 2, 4],
    explanation:
      "Entre chaînes, la comparaison est lexicographique : `'2' > '1'` suffit, et les majuscules précèdent les minuscules, mais `'é'` (233) vient après `'z'` (122). Avec un nombre : `[]` → 0 (vrai), `{}` → `NaN` (faux), `'2'` → 2 (faux).",
  },
  {
    id: "js-cmp-strict-equal-true",
    category: "js",
    level: "junior",
    type: "multiple",
    time: 45,
    question: "Lesquelles de ces expressions valent `true` ?",
    options: ["`'a' === 'a'`", "`[] === []`", "`NaN === NaN`", "`+0 === -0`", "`null === undefined`"],
    answer: [0, 3],
    explanation:
      "Les primitives sont comparées par valeur, les objets par référence. `===` considère `+0` et `-0` égaux, mais pas `NaN` avec lui-même. `null` et `undefined` sont de types différents.",
  },
);
