/**
 * Temporary banner to warn that the French guide is mostly auto-translated.
 * Remove this file and the ADDITIONAL_JS env var in the Makefile once no longer needed.
 */
(function () {
  const bannerId = 'fr-auto-translation-banner';
  const styleId = 'fr-auto-translation-banner-style';

  function ensureCss() {
    if (document.getElementById(styleId)) return;
    const s = document.createElement('style');
    s.id = styleId;
    s.textContent = `
      .translation-banner {
        box-sizing: border-box;
        background: #fff3cd;
        color: #664d03;
        border: 1px solid #ffe69c;
        border-left: 4px solid #ffda6a;
        border-radius: 3px;
        margin: 0 0 1rem 0;
        padding: 0.6rem 0.8rem;
        font-size: 1.5rem;
      }
      .translation-banner a { color: inherit; text-decoration: underline; }
    `;
    document.head.appendChild(s);
  }

  function findMain() {
    return document.querySelector('main.content') ||
           document.querySelector('main') ||
           document.getElementById('content') ||
           document.querySelector('.content') ||
           document.body;
  }

  function insertBanner() {
    ensureCss();

    // Avoid duplicates on client-side navigations
    const existing = document.getElementById(bannerId);
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.id = bannerId;
    banner.className = 'translation-banner';
    banner.innerHTML =
      `<p>🚧 Cette version du guide de Catala a été principalement traduite automatiquement de l'anglais. Si vous rencontrez des erreurs ou inexactitudes, un <a href="https://github.com/CatalaLang/catala-book/issues">signalement</a> est le bienvenu !</p>`;

    const main = findMain();
    if (main.firstElementChild) {
      main.insertBefore(banner, main.firstElementChild);
    } else {
      main.prepend(banner);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertBanner);
  } else {
    insertBanner();
  }

  // mdBook SPA-like navigation events
  window.addEventListener('mdbook:load', insertBanner);
  window.addEventListener('mdbook:page-change', insertBanner);
})();
