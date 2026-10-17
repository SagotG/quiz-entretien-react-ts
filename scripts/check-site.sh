#!/usr/bin/env bash
# Contrôles de sécurité propres à ce site statique (sans dépendance) :
# CSP stricte, absence de ressource externe, absence de sinks dangereux, robots.
set -euo pipefail
cd "$(dirname "$0")/.."

fail=0
error() { echo "::error::$1"; fail=1; }
ok() { echo "✓ $1"; }

# La balise peut s'étendre sur plusieurs lignes : on aplatit le fichier avant d'extraire la CSP.
csp=$(tr '\n' ' ' < index.html | grep -o 'http-equiv="Content-Security-Policy"[^>]*' | grep -o 'content="[^"]*"' || true)
[ -n "$csp" ] || error "index.html : balise CSP absente"
for directive in "default-src 'none'" "script-src 'self'" "style-src 'self'" "object-src 'none'" \
                 "base-uri 'none'" "form-action 'none'" "require-trusted-types-for 'script'"; do
  if grep -qF "$directive" <<<"$csp"; then ok "CSP : $directive"; else error "CSP : directive manquante « $directive »"; fi
done
if grep -qE "unsafe-inline|unsafe-eval|unsafe-hashes|\\*" <<<"$csp"; then
  error "CSP : source trop permissive (unsafe-* ou joker)"
else
  ok "CSP : aucune source unsafe-* ni joker"
fi

# Aucune ressource chargée depuis un autre domaine (l'espace de noms SVG du favicon est toléré).
external=$(grep -nE '(src|href)=["'"'"'](https?:)?//' index.html | grep -v 'data:image/svg' || true)
external+=$(grep -nE 'url\((["'"'"'])?(https?:)?//' styles.css || true)
if [ -n "$external" ]; then error "ressource externe détectée :"$'\n'"$external"; else ok "aucune ressource externe"; fi

# Sinks d'exécution de code interdits dans le code de l'application.
sinks=$(grep -nE '\beval\(|new Function\(|document\.write|insertAdjacentHTML|outerHTML\s*=|setTimeout\(\s*["'"'"'`]|setInterval\(\s*["'"'"'`]' app.js highlight.js || true)
if [ -n "$sinks" ]; then error "sink dangereux :"$'\n'"$sinks"; else ok "aucun eval / new Function / document.write"; fi

# Toute écriture innerHTML doit passer par setHTML (politique Trusted Types).
raw=$(grep -n 'innerHTML' app.js highlight.js | grep -v 'htmlPolicy.createHTML' || true)
if [ -n "$raw" ]; then error "innerHTML hors de setHTML :"$'\n'"$raw"; else ok "innerHTML uniquement via la politique Trusted Types"; fi

# Les liens target=_blank doivent porter rel=noopener.
blank=$(grep -nE 'target="_blank"' index.html app.js | grep -v 'noopener' || true)
if [ -n "$blank" ]; then error "target=_blank sans noopener :"$'\n'"$blank"; else ok "liens target=_blank sûrs"; fi

grep -q '<meta name="robots" content="noindex' index.html && ok "meta robots noindex" || error "meta robots noindex absente"
grep -q '^Disallow: /$' robots.txt && ok "robots.txt : Disallow: /" || error "robots.txt absent ou permissif"

exit $fail
