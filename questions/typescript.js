/*
 * Questions TypeScript.
 * Format : voir README.md. Les options sont mélangées à l'affichage,
 * l'ordre dans ce fichier n'a donc aucune importance.
 */
window.QUESTION_BANK = window.QUESTION_BANK || [];
window.QUESTION_BANK.push(
  {
    id: "ts-unknown-vs-any",
    category: "ts",
    type: "single",
    time: 30,
    question: "Quelle affirmation décrit correctement `unknown` par rapport à `any` ?",
    options: [
      "`unknown` accepte toute valeur mais impose un affinage avant usage",
      "`unknown` accepte toute valeur et désactive la vérification des membres",
      "`unknown` n'accepte que `null` et `undefined` sans annotation explicite",
      "`unknown` est un alias de `any` conservé pour la rétrocompatibilité",
    ],
    answer: [0],
    explanation:
      "`unknown` est le « top type » sûr : on peut y assigner n'importe quoi, mais on ne peut rien en faire (appel, accès membre…) sans l'avoir affiné via `typeof`, `instanceof`, un type guard, etc. `any` désactive purement la vérification.",
  },
  {
    id: "ts-narrowing",
    category: "ts",
    type: "multiple",
    time: 45,
    question: "Lesquels de ces mécanismes affinent (narrowing) une union dans le flux de contrôle ?",
    options: [
      "Un test `typeof value === 'string'` dans un `if`",
      "Un test `'kind' in value` dans un `if`",
      "Une fonction déclarant le retour `value is Foo`",
      "Une assertion `value as Foo` dans l'expression",
      "Une annotation `const v: Foo = value` sur une copie",
    ],
    answer: [0, 1, 2],
    explanation:
      "`typeof`, `in`, `instanceof`, l'égalité sur un discriminant et les type predicates (`x is T`) affinent le type dans le bloc. `as` force un type sans vérification (assertion, pas narrowing) et l'annotation d'une copie produit simplement une erreur si `value` n'est pas assignable à `Foo`.",
  },
  {
    id: "ts-intersection-never",
    category: "ts",
    type: "single",
    time: 45,
    question: "Quel est le type de `B` ?",
    code: `type A = { a: string } & { a: number };
type B = A['a'];`,
    options: ["`never`", "`string | number`", "`string`", "Erreur de compilation sur `A`"],
    answer: [0],
    explanation:
      "Une intersection fusionne les membres : `a` devient `string & number`, qui n'a aucune valeur possible, donc `never`. TypeScript ne signale pas d'erreur à la déclaration de `A`.",
  },
  {
    id: "ts-distributive-conditional",
    category: "ts",
    type: "single",
    time: 60,
    question: "Quel est le type de `R` ?",
    code: `type ToArray<T> = T extends unknown ? T[] : never;
type R = ToArray<string | number>;`,
    options: ["`string[] | number[]`", "`(string | number)[]`", "`never`", "`unknown[]`"],
    answer: [0],
    explanation:
      "Un type conditionnel dont le type testé est un paramètre générique « nu » est distributif : il s'applique à chaque membre de l'union, d'où `ToArray<string> | ToArray<number>`.",
  },
  {
    id: "ts-non-distributive",
    category: "ts",
    type: "single",
    time: 45,
    question: "Comment empêcher un type conditionnel générique de se distribuer sur une union ?",
    options: [
      "Entourer les deux côtés de crochets : `[T] extends [U]`",
      "Préfixer le paramètre testé par `infer` : `infer T extends U`",
      "Contraindre le paramètre à la déclaration : `T extends object`",
      "Remplacer `extends` par `satisfies` dans la condition",
    ],
    answer: [0],
    explanation:
      "La distribution ne s'applique qu'à un paramètre de type nu. L'envelopper dans un tuple (`[T] extends [U]`) le rend non nu et la condition est évaluée sur l'union entière.",
  },
  {
    id: "ts-satisfies",
    category: "ts",
    type: "single",
    time: 60,
    question: "Que se passe-t-il à la compilation ?",
    code: `const config = {
  port: 3000,
  host: 'localhost',
} satisfies Record<string, string | number>;

config.port.toFixed(0);`,
    options: [
      "Compile : `config.port` conserve le type inféré `number`",
      "Erreur : `config.port` est typé `string | number`",
      "Erreur : `satisfies` interdit l'accès direct aux propriétés",
      "Compile : `config.port` est typé `any` après vérification",
    ],
    answer: [0],
    explanation:
      "`satisfies` vérifie la compatibilité avec le type cible sans élargir le type inféré. Avec une annotation `: Record<…>`, `port` serait `string | number` et `toFixed` serait refusé.",
  },
  {
    id: "ts-interface-vs-type",
    category: "ts",
    type: "multiple",
    time: 60,
    question: "Quelles affirmations sur `interface` et `type` sont vraies ?",
    options: [
      "Deux déclarations `interface` de même nom fusionnent leurs membres",
      "Un alias `type` peut décrire une union ou un tuple",
      "Une `interface` peut étendre un alias `type` de forme objet",
      "Un alias `type` peut être redéclaré pour ajouter des membres",
      "Une classe ne peut implémenter qu'une `interface`, pas un `type`",
    ],
    answer: [0, 1, 2],
    explanation:
      "Le declaration merging est propre aux interfaces ; un alias redéclaré provoque « Duplicate identifier ». Une classe peut `implements` un alias de type objet (pas une union).",
  },
  {
    id: "ts-structural-typing",
    category: "ts",
    type: "single",
    time: 40,
    question: "Que se passe-t-il ?",
    code: `class Cat { name = ''; }
class Dog { name = ''; }

const pet: Cat = new Dog();`,
    options: [
      "Compile : la compatibilité est structurelle",
      "Erreur : les classes sont comparées par nom",
      "Erreur : uniquement avec `strict` activé",
      "Compile, puis `TypeError` lors de l'exécution",
    ],
    answer: [0],
    explanation:
      "TypeScript est structurel : deux classes de même forme sont compatibles. Exception : la présence d'un membre `private`/`protected`/`#field` rend la comparaison nominale.",
  },
  {
    id: "ts-strict-flags",
    category: "ts",
    type: "multiple",
    time: 45,
    question: "Quelles options sont activées par `\"strict\": true` dans `tsconfig.json` ?",
    options: [
      "`strictNullChecks`",
      "`noImplicitAny`",
      "`strictFunctionTypes`",
      "`noUnusedLocals`",
      "`noUncheckedIndexedAccess`",
    ],
    answer: [0, 1, 2],
    explanation:
      "`strict` regroupe notamment `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`, `alwaysStrict` et `useUnknownInCatchVariables`. `noUnusedLocals` et `noUncheckedIndexedAccess` doivent être activés à part.",
  },
  {
    id: "ts-keyof-index-signature",
    category: "ts",
    type: "single",
    time: 45,
    question: "Quel est le type de `K` ?",
    code: `type Flags = { [key: string]: boolean };
type K = keyof Flags;`,
    options: ["`string | number`", "`string`", "`string | boolean`", "`never`"],
    answer: [0],
    explanation:
      "Avec une signature d'index `string`, `keyof` renvoie `string | number`, car en JavaScript `obj[0]` est équivalent à `obj['0']`.",
  },
  {
    id: "ts-infer-not-recursive",
    category: "ts",
    type: "single",
    time: 45,
    question: "Quel est le type de `R` ?",
    code: `type Unwrap<T> = T extends Promise<infer U> ? U : T;
type R = Unwrap<Promise<Promise<number>>>;`,
    options: ["`Promise<number>`", "`number`", "`Promise<Promise<number>>`", "`never`"],
    answer: [0],
    explanation:
      "`Unwrap` n'est pas récursif : il retire une seule couche. `Awaited<T>`, lui, est récursif et donnerait `number`.",
  },
  {
    id: "ts-const-enum",
    category: "ts",
    type: "single",
    time: 40,
    question: "Avec la configuration par défaut, que produit un `const enum` dans le JavaScript émis ?",
    options: [
      "Les valeurs sont inlinées et aucun objet n'est émis",
      "Un objet figé via `Object.freeze` à la place de l'enum",
      "Un objet à double correspondance nom ↔ valeur",
      "Une union de littéraux, sans valeur inlinée",
    ],
    answer: [0],
    explanation:
      "Les usages d'un `const enum` sont remplacés par leur valeur et la déclaration disparaît (sauf `preserveConstEnums`). Ils posent problème avec `isolatedModules` (Babel, esbuild, SWC) qui compilent fichier par fichier.",
  },
  {
    id: "ts-readonly-array",
    category: "ts",
    type: "multiple",
    time: 60,
    question: "Avec `const arr: readonly number[] = [1, 2];`, quelles lignes compilent ?",
    options: [
      "`const doubled = arr.map((x) => x * 2);`",
      "`const copy = arr.slice();`",
      "`arr.push(3);`",
      "`arr[0] = 5;`",
      "`const mutable: number[] = arr;`",
    ],
    answer: [0, 1],
    explanation:
      "`readonly number[]` (`ReadonlyArray<number>`) retire les méthodes mutatrices et l'écriture par index. Il n'est pas assignable à `number[]`, l'inverse l'est.",
  },
  {
    id: "ts-exclude",
    category: "ts",
    type: "single",
    time: 40,
    question: "Quel est le type de `T` ?",
    code: `type T = Exclude<'a' | 'b' | 'c', 'a' | 'z'>;`,
    options: [
      "`'b' | 'c'`",
      "`'a'`",
      "`'b' | 'c' | 'z'`",
      "Erreur : `'z'` n'appartient pas à l'union",
    ],
    answer: [0],
    explanation:
      "`Exclude<T, U>` = `T extends U ? never : T`, distribué sur `T`. Le second argument n'est pas contraint à être un sous-ensemble de `T`, `'z'` est simplement ignoré.",
  },
  {
    id: "ts-exhaustive-never",
    category: "ts",
    type: "single",
    time: 60,
    question: "Que se passe-t-il à la compilation ?",
    code: `type Shape = { kind: 'circle' } | { kind: 'square' };

function area(s: Shape): number {
  switch (s.kind) {
    case 'circle':
      return 1;
    default: {
      const unreachable: never = s;
      return unreachable;
    }
  }
}`,
    options: [
      "Erreur : `{ kind: 'square' }` n'est pas assignable à `never`",
      "Compile : `never` accepte n'importe quelle valeur dans un `default`",
      "Compile, mais une exception est levée pour `'square'`",
      "Erreur : un `switch` ne peut pas affiner une union d'objets",
    ],
    answer: [0],
    explanation:
      "C'est le pattern de vérification d'exhaustivité : dans `default`, `s` est affiné à `{ kind: 'square' }`, non assignable à `never`. Ajouter le `case 'square'` supprime l'erreur.",
  },
  {
    id: "ts-type-erasure",
    category: "ts",
    type: "multiple",
    time: 45,
    question: "Quelles affirmations sur le JavaScript émis par `tsc` sont vraies ?",
    options: [
      "Les interfaces n'y laissent aucune trace",
      "Un `enum` classique y génère un objet",
      "`instanceof` peut y tester une interface",
      "Les génériques y restent lisibles par réflexion",
    ],
    answer: [0, 1],
    explanation:
      "Les types sont effacés à la compilation : pas d'interface ni de générique à l'exécution, donc `instanceof` ne fonctionne qu'avec des valeurs (classes). Les `enum` non-`const` font exception et produisent un objet.",
  },
  {
    id: "ts-template-literal",
    category: "ts",
    type: "single",
    time: 45,
    question: "Quel est le type de `Handler` ?",
    code: `type Handler = \`on\${Capitalize<'click' | 'focus'>}\`;`,
    options: [
      "`'onClick' | 'onFocus'`",
      "`'onclick' | 'onfocus'`",
      "`'onClick' & 'onFocus'`",
      "`'onClick | onFocus'`",
    ],
    answer: [0],
    explanation:
      "Les template literal types se distribuent sur les unions et `Capitalize` met en majuscule la première lettre de chaque membre.",
  },
  {
    id: "ts-mapped-modifiers",
    category: "ts",
    type: "single",
    time: 45,
    question: "Quel est l'effet de ce type mappé ?",
    code: `type M<T> = { -readonly [K in keyof T]-?: T[K] };`,
    options: [
      "Il retire `readonly` et rend chaque propriété obligatoire",
      "Il ajoute `readonly` et rend chaque propriété optionnelle",
      "Il retire `readonly` et rend chaque propriété optionnelle",
      "Il supprime du type les propriétés marquées `readonly`",
    ],
    answer: [0],
    explanation:
      "Les préfixes `-` et `+` retirent ou ajoutent un modificateur. `-?` est d'ailleurs la définition de `Required<T>`.",
  },
  {
    id: "ts-assertion-incompatible",
    category: "ts",
    type: "single",
    time: 40,
    question: "Que se passe-t-il ?",
    code: `const n = 'hello' as number;`,
    options: [
      "Erreur : types incompatibles, il faut passer par `unknown`",
      "Compile : `n` est typé `number` et vaut `NaN` à l'exécution",
      "Compile : `n` est typé `number` et vaut `'hello'` à l'exécution",
      "Erreur uniquement si `strict` est activé dans la configuration",
    ],
    answer: [0],
    explanation:
      "Une assertion n'est autorisée que si l'un des types est assignable à l'autre. Sinon il faut une double assertion `as unknown as number`. Une assertion ne convertit jamais la valeur.",
  },
  {
    id: "ts-overload-implementation",
    category: "ts",
    type: "single",
    time: 45,
    question: "Dans une fonction surchargée, quel est le statut de la signature d'implémentation ?",
    options: [
      "Elle est invisible des appelants : seules les surcharges comptent",
      "Elle s'ajoute aux surcharges comme une signature appelable de plus",
      "Elle doit reprendre exactement la dernière surcharge déclarée",
      "Elle est facultative dès que chaque surcharge est entièrement typée",
    ],
    answer: [0],
    explanation:
      "Les appelants ne voient que les signatures de surcharge. La signature d'implémentation doit être compatible avec toutes, mais n'est pas elle-même appelable de l'extérieur.",
  },
  {
    id: "ts-awaited-returntype",
    category: "ts",
    type: "multiple",
    time: 60,
    question: "Avec `async function load() { return { id: 1 }; }`, quelles expressions de type valent `{ id: number }` ?",
    options: [
      "`Awaited<ReturnType<typeof load>>`",
      "`ReturnType<typeof load>`",
      "`Awaited<Promise<{ id: number }>>`",
      "`ReturnType<load>`",
    ],
    answer: [0, 2],
    explanation:
      "Une fonction `async` retourne `Promise<{ id: number }>`, qu'il faut déballer avec `Awaited`. `ReturnType<load>` est une erreur : `load` est une valeur, il faut `typeof load`.",
  },
  {
    id: "ts-as-const",
    category: "ts",
    type: "single",
    time: 40,
    question: "Quel est le type de `Role` ?",
    code: `const roles = ['admin', 'user'] as const;
type Role = (typeof roles)[number];`,
    options: [
      "`'admin' | 'user'`",
      "`string`",
      "`readonly ['admin', 'user']`",
      "`string[]`",
      "`number`",
    ],
    answer: [0],
    explanation:
      "`as const` infère un tuple readonly de littéraux. Indexer par `number` donne l'union des éléments : pratique pour dériver un type d'une liste de valeurs.",
  },
  {
    id: "ts-private-vs-hash",
    category: "ts",
    type: "single",
    time: 45,
    question: "Quelle différence entre `private count` et `#count` dans une classe TypeScript ?",
    options: [
      "`private` n'est vérifié qu'à la compilation, `#count` l'est aussi à l'exécution",
      "`#count` n'est vérifié qu'à la compilation, `private` l'est aussi à l'exécution",
      "Les deux sont effacés et restent accessibles depuis le JavaScript émis",
      "Les deux sont bloqués par le moteur JavaScript au moment de l'exécution",
    ],
    answer: [0],
    explanation:
      "`private` est une contrainte du compilateur (contournable via `obj['count']`). `#count` est un champ privé ECMAScript, réellement inaccessible hors de la classe à l'exécution.",
  },
  {
    id: "ts-function-param-variance",
    category: "ts",
    type: "single",
    time: 60,
    question: "Avec `strictFunctionTypes`, quelle affectation compile ?",
    code: `type Animal = { name: string };
type Dog = Animal & { bark(): void };

let handleAnimal = (a: Animal) => {};
let handleDog = (d: Dog) => {};`,
    options: [
      "`handleDog = handleAnimal;`",
      "`handleAnimal = handleDog;`",
      "Les deux affectations",
      "Aucune des deux affectations",
    ],
    answer: [0],
    explanation:
      "Les paramètres sont contravariants : une fonction qui accepte n'importe quel `Animal` peut remplacer une fonction qui attend un `Dog`, pas l'inverse. Note : les méthodes déclarées en syntaxe méthode restent bivariantes.",
  },
);
