/* Copy only static public preparation text after explicit user action. */
(function () {
  'use strict';
  for (const button of document.querySelectorAll('[data-phase5-copy]')) {
    const target = document.getElementById(button.dataset.phase5Copy);
    const status = document.getElementById(button.dataset.phase5Copy + '-status');
    if (!target || !status) continue;
    button.hidden = false;
    button.addEventListener('click', async () => {
      const items = target.querySelectorAll('li');
      const text = items.length ? Array.from(items, item => item.textContent).join('\n') : target.textContent;
      try {
        if (!navigator.clipboard?.writeText) throw Error('Clipboard unavailable');
        await navigator.clipboard.writeText(text.trim());
        status.textContent = document.documentElement.lang === 'es' ? 'Texto copiado.' : 'Text copied.';
      } catch {
        status.textContent = document.documentElement.lang === 'es' ? 'No se pudo copiar. Selecciona y copia el texto manualmente.' : 'Could not copy. Select the text above and copy it manually.';
      }
    });
  }
})();
