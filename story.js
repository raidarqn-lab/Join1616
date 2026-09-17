'use strict';

const STORY_DRAFT_KEY = 'server1616-transfer-application-draft-v17';
const STORY_RETURN_KEY = 'server1616-returning-to-application';
let storyLanguage = 'en';

function storyText(key) {
  return (I18N[storyLanguage] && I18N[storyLanguage][key]) || I18N.en[key] || key;
}

function readApplicationDraft() {
  try {
    return JSON.parse(localStorage.getItem(STORY_DRAFT_KEY) || '{}');
  } catch (_) {
    return {};
  }
}

function preserveStoryLanguage(language) {
  try {
    const draft = readApplicationDraft();
    draft.language = language;
    localStorage.setItem(STORY_DRAFT_KEY, JSON.stringify(draft));
  } catch (_) {}
}

function setStoryLanguage(language, persist = true) {
  if (!I18N[language]) language = 'en';
  storyLanguage = language;
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';

  const picker = document.getElementById('header-language');
  if (picker) picker.value = language;

  document.querySelectorAll('[data-i18n]').forEach(element => {
    element.textContent = storyText(element.dataset.i18n);
  });

  if (persist) preserveStoryLanguage(language);
}

function initStoryPetals() {
  const box = document.getElementById('petals');
  if (!box) return;
  box.innerHTML = '';
  for (let i = 0; i < 42; i += 1) {
    const petal = document.createElement('span');
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.top = `${-10 - Math.random() * 90}%`;
    petal.style.animationDuration = `${12 + Math.random() * 18}s`;
    petal.style.animationDelay = `${-Math.random() * 26}s`;
    petal.style.opacity = `${0.40 + Math.random() * 0.45}`;
    petal.style.transform = `rotate(${Math.random() * 180}deg) scale(${0.7 + Math.random() * 1.5})`;
    box.appendChild(petal);
  }
}

function initStoryFootprints() {
  const milestones = [...document.querySelectorAll('.journey-milestone[data-story-step]')];
  const footsteps = [...document.querySelectorAll('.journey-footstep')];
  if (!milestones.length || !footsteps.length) return;

  const renderFootprints = activeStep => {
    const visibleCount = Math.max(
      0,
      Math.min(footsteps.length, Math.round(((activeStep + 1) / milestones.length) * footsteps.length))
    );
    footsteps.forEach((footstep, index) => {
      footstep.classList.toggle('is-visible', index < visibleCount);
      footstep.style.transitionDelay = index < visibleCount ? `${index * 55}ms` : '0ms';
    });
  };

  renderFootprints(0);
  const observer = new IntersectionObserver(entries => {
    const visibleSteps = entries
      .filter(entry => entry.isIntersecting)
      .map(entry => Number(entry.target.dataset.storyStep));
    if (visibleSteps.length) renderFootprints(Math.max(...visibleSteps));
  }, { threshold: 0.35, rootMargin: '-10% 0px -18% 0px' });

  milestones.forEach(milestone => observer.observe(milestone));
}

function initStoryMilestones() {
  document.querySelectorAll('.story-expand-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const card = toggle.closest('.story-card');
      const content = card && card.querySelector('.story-expanded-content');
      if (!card || !content) return;
      const opening = !card.classList.contains('is-expanded');

      document.querySelectorAll('.story-card.is-expanded').forEach(other => {
        if (other === card) return;
        other.classList.remove('is-expanded');
        other.querySelector('.story-expand-toggle')?.setAttribute('aria-expanded', 'false');
        const otherContent = other.querySelector('.story-expanded-content');
        if (otherContent) otherContent.hidden = true;
      });

      card.classList.toggle('is-expanded', opening);
      toggle.setAttribute('aria-expanded', String(opening));
      content.hidden = !opening;
      if (opening) setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
    });
  });
}

document.getElementById('header-language')?.addEventListener('change', event => {
  setStoryLanguage(event.target.value);
});

document.getElementById('nav-application')?.addEventListener('click', () => {
  try { sessionStorage.setItem(STORY_RETURN_KEY, '1'); } catch (_) {}
  window.location.href = 'index.html';
});

document.getElementById('nav-story')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const savedStoryDraft = readApplicationDraft();
setStoryLanguage(savedStoryDraft.language || 'en', false);
initStoryPetals();
initStoryFootprints();
initStoryMilestones();

