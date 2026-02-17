/**
 * Injects "Try in Playground" button for tutorial chapters with exercises
 *
 * This script:
 * - Detects the current chapter from the URL
 * - Loads exercise config from /playground/exercises.json
 * - Injects a floating button that opens learn.html with the correct parameters
 * - Hides itself when embedded in an iframe (to avoid redundancy)
 */

(async () => {
  // Don't show button if we're already in an iframe (embedded in learn.html)
  if (window !== window.top) return;

  // Detect language from URL path
  function getCurrentLang() {
    return window.location.pathname.includes('/fr/') ? 'fr' : 'en';
  }

  // Extract chapter ID from current page URL
  // Examples: /en/2-1-basic-blocks.html -> 2-1-basic-blocks
  //           /en/2-1-1-exercise.html -> 2-1-1-exercise
  function getCurrentChapter() {
    const match = window.location.pathname.match(/\/([^/]+)\.html$/);
    return match ? match[1] : null;
  }

  const lang = getCurrentLang();
  const chapterId = getCurrentChapter();
  if (!chapterId) return;

  // Load exercises config
  let EXERCISES;
  try {
    const resp = await fetch('/playground/exercises.json');
    if (!resp.ok) return;
    EXERCISES = await resp.json();
  } catch {
    return; // Silently fail if config not available
  }

  // Check if this chapter has an exercise
  const exercise = EXERCISES[lang]?.[chapterId];
  if (!exercise) return;

  // Handle redirect (for intro pages that should go to first exercise)
  const targetChapter = exercise.redirectTo || chapterId;

  // Create playground button
  const button = document.createElement('a');
  button.className = 'playground-fab';
  button.href = `/playground/learn.html?chapter=${targetChapter}&bookBase=/${lang}`;
  button.title = lang === 'fr' ? 'Essayer dans le playground' : 'Try in Playground';
  button.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
    <span>${lang === 'fr' ? 'Essayer le tutoriel' : 'Try Tutorial'}</span>
  `;

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    .playground-fab {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      color: white !important;
      padding: 12px 20px;
      border-radius: 28px;
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.5);
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      z-index: 999;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .playground-fab span {
      color: white !important;
    }

    .playground-fab:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 107, 53, 0.6);
      background: linear-gradient(135deg, #ff7c4d 0%, #ff9e3d 100%);
      text-decoration: none;
      color: white !important;
    }

    .playground-fab:hover span {
      color: white !important;
    }

    .playground-fab:active {
      transform: translateY(0);
    }

    .playground-fab svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    @media (max-width: 768px) {
      .playground-fab {
        bottom: 16px;
        right: 16px;
        padding: 10px 16px;
        font-size: 13px;
      }

      .playground-fab svg {
        width: 18px;
        height: 18px;
      }
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(button);
})();
