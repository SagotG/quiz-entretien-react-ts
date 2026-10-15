/*
 * Coloration syntaxique minimaliste JS / TS / JSX, palette VS Code « Dark+ ».
 * Pas de dépendance : un tokenizer par regex suffit pour des extraits courts.
 */
window.highlightCode = (() => {
  "use strict";

  const CONTROL = new Set([
    "return", "if", "else", "for", "while", "do", "switch", "case", "default", "break",
    "continue", "throw", "try", "catch", "finally", "await", "yield", "import", "export", "from",
  ]);
  const STORAGE = new Set([
    "const", "let", "var", "function", "class", "type", "interface", "enum", "new", "typeof",
    "instanceof", "extends", "implements", "keyof", "infer", "as", "async", "readonly", "in",
    "of", "satisfies", "is", "declare", "abstract", "private", "protected", "public", "static",
    "get", "set", "delete", "void",
  ]);
  const LITERALS = new Set(["true", "false", "null", "undefined", "this", "super", "NaN", "Infinity"]);
  const PRIMITIVE_TYPES = new Set([
    "string", "number", "boolean", "unknown", "never", "any", "object", "symbol", "bigint",
  ]);
  const DECLARES_TYPE = new Set(["type", "interface", "class", "enum", "extends", "implements", "new"]);

  const TOKEN_RE = new RegExp(
    [
      /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/, // 1 commentaire
      /('(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|`(?:\\[\s\S]|[^`\\])*`)/, // 2 chaîne
      /(\b\d[\d_]*(?:\.\d+)?n?\b)/, // 3 nombre
      /([A-Za-z_$#][\w$]*)/, // 4 identifiant
      /(=>|\.\.\.|[=!]==?|&&|\|\||\?\?|[<>]=?|[-+*/%&|^~!?:;,.=@(){}[\]])/, // 5 ponctuation
      /(\s+)/, // 6 espaces
      /([\s\S])/, // 7 autre
    ]
      .map((r) => r.source)
      .join("|"),
    "g",
  );

  function esc(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function span(cls, text) {
    return `<span class="tk-${cls}">${esc(text)}</span>`;
  }

  /** Un `<` ouvre une balise JSX s'il ne peut pas être un opérateur ou un générique. */
  function canStartJsx(prev, nextChar) {
    if (!/[A-Za-z/>]/.test(nextChar)) return false;
    if (!prev) return true;
    if (prev.kind === "punct") return !/^[)\]]$/.test(prev.text);
    return prev.kind === "control";
  }

  return function highlight(code) {
    let out = "";
    let prev = null; // dernier jeton significatif
    let braceDepth = 0;
    let jsxTag = null; // { depth, expectName, closing } quand on est dans une balise JSX
    const jsxChildren = []; // profondeurs d'accolades des zones de texte JSX ouvertes
    let m;
    TOKEN_RE.lastIndex = 0;

    while ((m = TOKEN_RE.exec(code))) {
      const [text, comment, string, number, ident, punct, space] = m;
      const rest = code.slice(TOKEN_RE.lastIndex);

      if (space !== undefined) {
        out += esc(text);
        continue;
      }

      const inChildren =
        !jsxTag && jsxChildren.length > 0 && jsxChildren[jsxChildren.length - 1] === braceDepth;
      if (inChildren && text !== "<" && text !== "{") {
        out += esc(text); // texte brut entre balises JSX
        continue;
      }

      let kind = "plain";
      let cls = null;

      if (comment !== undefined) {
        cls = "comment";
        kind = "comment";
      } else if (string !== undefined) {
        cls = "string";
        kind = "string";
      } else if (number !== undefined) {
        cls = "number";
        kind = "number";
      } else if (ident !== undefined) {
        kind = "ident";
        if (jsxTag && jsxTag.expectName) {
          cls = /^[A-Z]/.test(ident) ? "type" : "tag";
          jsxTag.expectName = false;
        } else if (jsxTag && braceDepth === jsxTag.depth) {
          cls = "attr";
        } else if (CONTROL.has(ident)) {
          cls = "control";
          kind = "control";
        } else if (STORAGE.has(ident)) {
          cls = "keyword";
          kind = "keyword";
        } else if (LITERALS.has(ident)) {
          cls = "keyword";
          kind = "literal";
        } else if (PRIMITIVE_TYPES.has(ident)) {
          cls = "type";
        } else if (prev && prev.kind === "keyword" && DECLARES_TYPE.has(prev.text)) {
          cls = "type";
        } else if (/^\s*\(/.test(rest) || (prev && prev.text === "function")) {
          cls = "function";
        } else if (/^[A-Z]/.test(ident)) {
          cls = "type";
        } else {
          cls = "variable";
        }
      } else if (punct !== undefined) {
        kind = "punct";
        if (text === "{") braceDepth++;
        if (text === "}") braceDepth--;

        if (text === "<" && !jsxTag && (inChildren || canStartJsx(prev, rest[0] || ""))) {
          // Ouverture (<tag) ou fermeture (</tag) de balise JSX
          let tagText = "<";
          if (rest[0] === "/") {
            tagText = "</";
            TOKEN_RE.lastIndex++;
          }
          jsxTag = { depth: braceDepth, expectName: true, closing: tagText === "</" };
          out += span("jsx-punct", tagText);
          prev = { kind: "punct", text: tagText };
          continue;
        }
        if (jsxTag && braceDepth === jsxTag.depth) {
          if (text === ">" || (text === "/" && rest[0] === ">")) {
            const tagText = text === "/" ? "/>" : ">";
            if (text === "/") TOKEN_RE.lastIndex++;
            if (jsxTag.closing) jsxChildren.pop();
            else if (tagText === ">") jsxChildren.push(braceDepth);
            jsxTag = null;
            out += span("jsx-punct", tagText);
            prev = { kind: "jsx-end", text: tagText };
            continue;
          }
        }
        cls = /^[(){}[\];,.:]$/.test(text) ? "punct" : "operator";
      }

      out += cls ? span(cls, text) : esc(text);
      if (kind !== "comment") prev = { kind, text };
    }
    return out;
  };
})();
