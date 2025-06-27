// === Language mapping with icons and names ===
const langMap = {
  en: '🌐 English',
  es: '🌐 Español',
  pt: '🌐 Português',
  fr: '🌐 Français',
  de: '🌐 Deutsch',
  af: '🌐 Afrikaans',
  zh: '🌐 中文',
  hi: '🌐 हिन्दी'
};

// === DOM element references ===
const langToggle = document.getElementById('language-toggle');
const langOptions = document.getElementById('lang-options');

// === Log selected language and visually update the UI ===
function logLanguage(lang) {
  console.log(`[Selected language] ${lang.toUpperCase()}`);
  localStorage.setItem('appLang', lang);
  updateAllTooltips(lang)

  // Update the toggle button text with the current language
  if (langToggle && lang in langMap) {
    langToggle.innerHTML = langMap[lang];
  }

   // Hide the language dropdown after selecting a language
  if (langOptions) {
    langOptions.style.display = 'none';
  }
}

// === Initialize toggle button with saved language ===
function initLanguageButtons() {
  const savedLang = localStorage.getItem('appLang') || 'en';
  console.log(`[Idioma Inicial] Cargado: ${savedLang.toUpperCase()}`);

 // Set initial toggle button text
  if (langToggle && savedLang in langMap) {
    langToggle.innerHTML = langMap[savedLang];
  }

 // Optional: highlight active language button
  const buttons = document.querySelectorAll('#lang-options button');
  buttons.forEach(btn => btn.classList.remove('active'));

  const activeBtn = [...buttons].find(btn => btn.dataset.lang === savedLang);
  if (activeBtn) {
    activeBtn.classList.add('active'); // Mark as active
  } else if (buttons.length > 0) {
    buttons[0].classList.add('active'); // fallback: highlight first button
}
}
// === Toggle language dropdown visibility ===
if (langToggle && langOptions) {
  langToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    langOptions.style.display = langOptions.style.display === 'block' ? 'none' : 'block';
  });

  // Close the dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!langOptions.contains(e.target) && !langToggle.contains(e.target)) {
      langOptions.style.display = 'none';
    }
  });
}



// === Dynamically update tooltips based on selected language ===
function updateAllTooltips(lang) {
  console.log(`[Actualizando Tooltips] Ahora mostrando descripciones en: ${lang.toUpperCase()}`);

  dots.forEach((dotElement, idx) => {
    const data = dotsData[idx];

// Remove previous event by cloning the dot element
    const newDot = dotElement.cloneNode(true);
    dotElement.replaceWith(newDot);

    // Reassign click event with updated language
    newDot.addEventListener('click', (e) => {
  e.stopPropagation();

  const lang = localStorage.getItem('appLang') || 'en';

  tooltipContent.innerHTML = `
    <h3>${data.title}</h3>
    <p>${data.text[lang] || data.text['en']}</p> <!-- Fallback al inglés -->
    <small>
      <span class="language-icon">${data.source.icon}</span> ${data.source.type} |
      <a href="${data.source.url}" target="_blank" style="color:#4dabf7;">${data.source.label}</a>
    </small>
  `;

  const rect = newDot.getBoundingClientRect();
  tooltip.style.left = `${rect.left + 20}px`;
  tooltip.style.top = `${rect.top + 20}px`;
  tooltip.style.display = 'block';
    });
  });
}

// === Force page reload when changing language (fallback approach) ===
function setLanguageAndReload(lang) {
  localStorage.setItem('appLang', lang);
  console.log(`[Cambio de Idioma] Ahora está activo: ${lang.toUpperCase()}`);
  
  // Reload the page to apply the new language
  window.location.reload();
}

// === Initialize app with the saved language ===
function initLanguage() {
  const savedLang = localStorage.getItem('appLang') || 'en';
  setLanguage(savedLang);
}