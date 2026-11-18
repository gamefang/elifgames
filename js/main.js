'use strict';

let config = null;
let contentData = {};
let currentLanguage = 'en-US';
let carouselManager = null;
let galleryManager = null;

const elements = {
  header: document.getElementById('header'),
  navMenu: document.getElementById('nav-menu'),
  navList: document.getElementById('nav-list'),
  navToggle: document.getElementById('nav-toggle'),
  languageSelect: document.getElementById('language-select'),
  hero: document.getElementById('home'),
  heroSlider: document.getElementById('hero-slider'),
  heroIndicators: document.getElementById('hero-indicators'),
  announcement: document.getElementById('featured'),
  featuredImage: document.getElementById('featured-image'),
  featuredFeatures: document.getElementById('featured-features'),
  featuredLearnMore: document.getElementById('featured-learn-more'),
  featuredPlayNow: document.getElementById('featured-play-now'),
  aboutValues: document.getElementById('about-values'),
  galleryGrid: document.getElementById('gallery-grid'),
  galleryActions: document.getElementById('gallery-actions'),
  loadMoreGames: document.getElementById('load-more-games'),
  footerSocial: document.getElementById('footer-social'),
  scrollTop: document.getElementById('scroll-top'),
  appError: document.getElementById('app-error'),
  favicon: document.getElementById('site-favicon'),
  metaDescription: document.getElementById('meta-description'),
  headerLogo: document.getElementById('header-logo'),
  footerLogo: document.getElementById('footer-logo')
};

async function loadJson(path) {
  const response = await fetch(path, { cache: 'no-cache' });
  if (!response.ok) {
    throw new Error(`Unable to load ${path}: HTTP ${response.status}`);
  }
  return response.json();
}

async function initializeApp() {
  try {
    const [configData, translations] = await Promise.all([
      loadJson('data/config.json'),
      loadJson('data/content.json')
    ]);

    config = configData;
    contentData = translations;

    applyTheme(config.colors);
    applyBranding(config.brand);
    renderNavigation();
    renderLanguageOptions();
    renderCarousel();
    renderAnnouncement();
    renderGallery();

    currentLanguage = getInitialLanguage();
    updateLanguageDisplay();
    updateContent();

    carouselManager = new CarouselManager(config.carousel);
    carouselManager.init();
    updateCarouselLabels();
    galleryManager = new GameGalleryManager(config.gallery);
    galleryManager.init();

    addEventListeners();
    initializeScrollEffects();
    applyAccessibilitySettings();
    document.body.classList.add('loaded');
  } catch (error) {
    console.error('ELIF GAMES initialization failed:', error);
    showAppError('The website could not load its configuration. Please check data/config.json and data/content.json, then reload the page.');
  }
}

function showAppError(message) {
  if (!elements.appError) return;
  elements.appError.textContent = message;
  elements.appError.hidden = false;
}

function applyTheme(colors = {}) {
  const root = document.documentElement;
  const values = {
    '--color-primary': colors.primary?.main,
    '--color-secondary': colors.primary?.secondary,
    '--color-white': colors.primary?.white,
    '--color-light-gray': colors.primary?.lightGray,
    '--color-text': colors.text?.main,
    '--color-text-light': colors.text?.light,
    '--color-text-inverse': colors.text?.inverse,
    '--color-accent-orange': colors.accent?.orange,
    '--color-accent-cyan': colors.accent?.cyan
  };

  Object.entries(values).forEach(([property, value]) => {
    if (typeof value === 'string' && value.trim()) {
      root.style.setProperty(property, value);
    }
  });
}

function applyBranding(brand = {}) {
  if (brand.favicon && elements.favicon) {
    elements.favicon.href = brand.favicon;
  }

  if (brand.headerLogo && elements.headerLogo) {
    elements.headerLogo.src = brand.headerLogo.src || '';
    elements.headerLogo.alt = brand.headerLogo.alt || brand.name || 'ELIF GAMES';
  }

  if (brand.footerLogo && elements.footerLogo) {
    elements.footerLogo.src = brand.footerLogo.src || '';
    elements.footerLogo.alt = brand.footerLogo.alt || brand.name || 'ELIF GAMES';
  }
}

function renderNavigation() {
  if (!elements.navList) return;
  elements.navList.replaceChildren();

  (config.navigation || []).forEach(item => {
    if (!item.id || !item.key) return;

    const listItem = document.createElement('li');
    listItem.className = 'nav__item';

    const link = document.createElement('a');
    link.className = 'nav__link';
    link.href = `#${item.id}`;
    link.dataset.key = item.key;
    listItem.appendChild(link);
    elements.navList.appendChild(listItem);
  });
}

function renderLanguageOptions() {
  if (!elements.languageSelect) return;
  elements.languageSelect.replaceChildren();

  (config.languages || []).forEach(language => {
    if (!language.code) return;
    const option = document.createElement('option');
    option.value = language.code;
    option.textContent = language.label || language.code;
    elements.languageSelect.appendChild(option);
  });
}

function renderCarousel() {
  const carouselConfig = config.carousel || {};
  const slides = carouselConfig.enabled === false ? [] : (carouselConfig.slides || []);

  if (!elements.heroSlider || !elements.heroIndicators) return;
  elements.heroSlider.replaceChildren();
  elements.heroIndicators.replaceChildren();
  elements.hero.hidden = slides.length === 0;

  slides.forEach((slide, index) => {
    const slideElement = document.createElement('div');
    slideElement.className = 'hero__slide';
    slideElement.dataset.slide = String(index);
    slideElement.setAttribute('aria-hidden', 'true');

    const image = document.createElement('img');
    image.className = 'hero__bg';
    image.dataset.src = slide.image;
    image.alt = slide.alt || '';
    image.loading = index === 0 ? 'eager' : 'lazy';
    image.decoding = 'async';
    if (index === 0) image.fetchPriority = 'high';
    slideElement.appendChild(image);

    const content = document.createElement('div');
    content.className = 'hero__content';

    const title = document.createElement('h1');
    title.className = 'hero__title';
    title.dataset.key = `hero.slides.${index}.title`;

    const description = document.createElement('p');
    description.className = 'hero__subtitle';
    description.dataset.key = `hero.slides.${index}.description`;

    content.append(title, description);
    slideElement.appendChild(content);
    elements.heroSlider.appendChild(slideElement);

    if (carouselConfig.showIndicators !== false) {
      const indicator = document.createElement('button');
      indicator.type = 'button';
      indicator.className = 'hero__indicator';
      indicator.dataset.slide = String(index);
      indicator.setAttribute('aria-pressed', 'false');
      indicator.setAttribute('aria-label', `Slide ${index + 1}`);
      elements.heroIndicators.appendChild(indicator);
    }
  });

  elements.heroIndicators.hidden = carouselConfig.showIndicators === false || slides.length < 2;
  document.documentElement.style.setProperty(
    '--carousel-transition-duration',
    `${Math.max(0, Number(carouselConfig.transitionDuration) || 800)}ms`
  );

  if (config.performance?.preloadLogos) {
    [config.brand?.headerLogo?.src, config.brand?.footerLogo?.src].filter(Boolean).forEach(src => {
      const preload = new Image();
      preload.src = src;
    });
  }
}

function renderAnnouncement() {
  const announcement = config.announcement || {};
  if (elements.announcement) {
    elements.announcement.hidden = announcement.enabled === false;
  }

  if (announcement.image && elements.featuredImage) {
    elements.featuredImage.src = announcement.image.src || '';
    elements.featuredImage.alt = announcement.image.alt || '';
  }

  configureLink(elements.featuredLearnMore, announcement.buttons?.learnMore);
  configureLink(elements.featuredPlayNow, announcement.buttons?.playNow);

  const featureConfig = announcement.features || {};
  if (elements.featuredFeatures) {
    elements.featuredFeatures.replaceChildren();
    elements.featuredFeatures.hidden = featureConfig.enabled !== true;

    if (featureConfig.enabled === true) {
      (featureConfig.links || []).forEach((item, index) => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.className = 'featured__feature';
        link.dataset.key = `featuredGame.features.${index}`;
        configureLink(link, { href: item.href, visible: true, target: '_blank' });
        listItem.appendChild(link);
        elements.featuredFeatures.appendChild(listItem);
      });
    }
  }
}

function configureLink(element, linkConfig) {
  if (!element) return;
  const visible = Boolean(linkConfig?.href) && linkConfig.visible !== false;
  element.hidden = !visible;
  if (!visible) return;

  element.href = linkConfig.href;
  const target = linkConfig.target || (linkConfig.href.startsWith('https://') || linkConfig.href.startsWith('http://') ? '_blank' : '_self');
  element.target = target;
  if (target === '_blank') {
    element.rel = 'noopener noreferrer';
  } else {
    element.removeAttribute('rel');
  }
}

function renderAboutValues() {
  if (!elements.aboutValues) return;
  elements.aboutValues.replaceChildren();

  const values = contentData[currentLanguage]?.about?.values || [];
  values.forEach((value, index) => {
    const card = document.createElement('div');
    card.className = 'value__card';

    const title = document.createElement('h4');
    title.className = 'value__title';
    title.dataset.key = `about.values.${index}.title`;

    const description = document.createElement('p');
    description.className = 'value__description';
    description.dataset.key = `about.values.${index}.description`;

    card.append(title, description);
    elements.aboutValues.appendChild(card);
  });
}

function renderGallery() {
  if (!elements.galleryGrid) return;
  elements.galleryGrid.replaceChildren();

  const games = (config.gallery?.games || []).filter(game => game.enabled !== false);
  const imageAspectRatio = config.gallery?.imageAspectRatio || '16 / 9';
  document.documentElement.style.setProperty('--gallery-image-ratio', imageAspectRatio);

  games.forEach(game => {
    const card = document.createElement('article');
    card.className = 'game__card';
    card.dataset.gameId = game.id;

    const imageContainer = document.createElement('div');
    imageContainer.className = 'game__image';

    const image = document.createElement('img');
    image.className = 'game__img';
    image.src = game.image;
    image.alt = game.alt || '';
    image.loading = 'lazy';
    image.decoding = 'async';
    imageContainer.appendChild(image);

    const overlay = document.createElement('div');
    overlay.className = 'game__overlay';

    const title = document.createElement('h4');
    title.className = 'game__title';
    title.dataset.key = `gallery.games.${game.id}.name`;

    const genre = document.createElement('p');
    genre.className = 'game__genre';
    genre.dataset.key = `gallery.games.${game.id}.genre`;

    const description = document.createElement('p');
    description.className = 'game__description';
    description.dataset.key = `gallery.games.${game.id}.description`;

    if (game.href) {
      const link = document.createElement('a');
      link.href = game.href;
      link.target = game.target || '_self';
      if (link.target === '_blank') link.rel = 'noopener noreferrer';
      link.append(title, genre, description);
      overlay.appendChild(link);
    } else {
      overlay.append(title, genre, description);
    }

    imageContainer.appendChild(overlay);
    card.appendChild(imageContainer);
    elements.galleryGrid.appendChild(card);
  });

  if (elements.galleryActions) {
    elements.galleryActions.hidden = config.gallery?.showMore !== true || games.length <= (Number(config.gallery?.initialVisible) || 3);
  }
}

function getSupportedLanguages() {
  return (config.languages || []).map(language => language.code).filter(Boolean);
}

function getInitialLanguage() {
  const supportedLanguages = getSupportedLanguages();
  const fallbackLanguage = config.language?.fallback || supportedLanguages[0] || 'en-US';
  const defaultLanguage = config.language?.default || fallbackLanguage;
  const storageKey = config.language?.storageKey || 'preferredLanguage';

  let savedLanguage = null;
  try {
    savedLanguage = localStorage.getItem(storageKey);
  } catch (error) {
    console.warn('Language preference storage is unavailable:', error);
  }

  if (supportedLanguages.includes(savedLanguage)) return savedLanguage;
  const detectedLanguage = detectLanguage(navigator.language || '', supportedLanguages, fallbackLanguage);
  if (supportedLanguages.includes(detectedLanguage)) return detectedLanguage;
  return supportedLanguages.includes(defaultLanguage) ? defaultLanguage : fallbackLanguage;
}

function detectLanguage(browserLanguage, supportedLanguages, fallbackLanguage) {
  if (supportedLanguages.includes(browserLanguage)) return browserLanguage;

  const languagePrefix = browserLanguage.toLowerCase().split('-')[0];
  const match = supportedLanguages.find(language => language.toLowerCase().split('-')[0] === languagePrefix);
  return match || fallbackLanguage;
}

function updateLanguageDisplay() {
  if (elements.languageSelect) {
    elements.languageSelect.value = currentLanguage;
    elements.languageSelect.setAttribute('aria-label', getNestedValue(contentData[currentLanguage], 'common.ariaLabels.selectLanguage') || 'Select language');
  }

  if (elements.navToggle) {
    elements.navToggle.setAttribute('aria-label', getNestedValue(contentData[currentLanguage], 'common.ariaLabels.toggleMenu') || 'Toggle menu');
  }

  if (elements.scrollTop) {
    elements.scrollTop.setAttribute('aria-label', getNestedValue(contentData[currentLanguage], 'common.ariaLabels.scrollToTop') || 'Scroll to top');
  }

  document.documentElement.lang = currentLanguage;
}

function getNestedValue(object, path) {
  if (!object || !path) return undefined;
  return path.split('.').reduce((value, key) => value == null ? undefined : value[key], object);
}

function updateContent() {
  const content = contentData[currentLanguage];
  if (!content) {
    console.warn(`No content found for language: ${currentLanguage}`);
    return;
  }

  renderAboutValues();

  document.querySelectorAll('[data-key]').forEach(element => {
    const key = element.dataset.key;
    const value = getNestedValue(content, key);
    if (value === undefined || value === null || typeof value === 'object') return;

    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      element.placeholder = String(value);
    } else {
      element.textContent = String(value);
    }
  });

  updateSiteMetadata(content);
  renderSocialLinks(content.footer?.social?.links || []);
  updateGalleryButtonText(content);
  updateLanguageDisplay();
  updateCarouselLabels(content);
}

function updateSiteMetadata(content) {
  if (content.site?.title) {
    document.title = `${content.site.title} - ${content.site.description || ''}`.trim();
  }
  if (elements.metaDescription && content.site?.description) {
    elements.metaDescription.content = content.site.description;
  }
}

function renderSocialLinks(links) {
  if (!elements.footerSocial) return;
  elements.footerSocial.replaceChildren();

  links.forEach(item => {
    if (!item?.url || !item?.name) return;
    const link = document.createElement('a');
    link.className = 'footer__social-link';
    link.href = item.url;
    link.textContent = item.name;

    if (/^https?:\/\//i.test(item.url)) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }

    elements.footerSocial.appendChild(link);
  });
}

function updateGalleryButtonText(content = contentData[currentLanguage]) {
  if (!elements.loadMoreGames) return;
  const isExpanded = elements.loadMoreGames.getAttribute('aria-expanded') === 'true';
  const key = isExpanded ? 'gallery.buttons.showLess' : 'gallery.buttons.loadMore';
  const text = getNestedValue(content, key);
  const textElement = elements.loadMoreGames.querySelector('.load-more-text');
  if (textElement && text) textElement.textContent = text;
}

function updateCarouselLabels(content = contentData[currentLanguage]) {
  if (!carouselManager) return;
  const labels = getNestedValue(content, 'common.ariaLabels.slideIndicator') || {};
  const standardLabels = [labels.first, labels.second, labels.third];

  elements.heroIndicators?.querySelectorAll('.hero__indicator').forEach((indicator, index) => {
    indicator.setAttribute('aria-label', standardLabels[index] || `Slide ${index + 1}`);
  });
}

function saveLanguagePreference(languageCode) {
  try {
    localStorage.setItem(config.language?.storageKey || 'preferredLanguage', languageCode);
  } catch (error) {
    console.warn('Could not save language preference:', error);
  }
}

function changeLanguage(languageCode) {
  if (!getSupportedLanguages().includes(languageCode)) return;
  currentLanguage = languageCode;
  saveLanguagePreference(languageCode);
  updateContent();
}

class CarouselManager {
  constructor(carouselConfig = {}) {
    this.config = carouselConfig;
    this.slides = Array.from(elements.heroSlider?.querySelectorAll('.hero__slide') || []);
    this.indicators = Array.from(elements.heroIndicators?.querySelectorAll('.hero__indicator') || []);
    this.currentSlide = 0;
    this.timer = null;
  }

  init() {
    if (this.slides.length === 0) return;
    this.showSlide(0);
    if (this.config.autoPlay === true && this.slides.length > 1) this.startSlideshow();
  }

  showSlide(index) {
    if (!this.slides.length || index < 0 || index >= this.slides.length) return;

    this.loadSlideImage(index);
    if (this.config.preloadNextSlide === true && this.slides.length > 1) {
      const nextIndex = index < this.slides.length - 1
        ? index + 1
        : (this.config.infiniteLoop !== false ? 0 : -1);
      if (nextIndex >= 0) this.loadSlideImage(nextIndex);
    }

    this.slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === index;
      slide.classList.toggle('hero__slide--active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });

    this.indicators.forEach((indicator, indicatorIndex) => {
      const isActive = indicatorIndex === index;
      indicator.classList.toggle('hero__indicator--active', isActive);
      indicator.setAttribute('aria-pressed', String(isActive));
    });

    this.currentSlide = index;
  }

  loadSlideImage(index) {
    const image = this.slides[index]?.querySelector('.hero__bg');
    if (!image || !image.dataset.src) return;
    image.src = image.dataset.src;
    image.loading = 'eager';
    delete image.dataset.src;
  }

  nextSlide() {
    if (this.currentSlide < this.slides.length - 1) {
      this.showSlide(this.currentSlide + 1);
    } else if (this.config.infiniteLoop !== false) {
      this.showSlide(0);
    } else {
      this.stopSlideshow();
    }
  }

  previousSlide() {
    if (this.currentSlide > 0) {
      this.showSlide(this.currentSlide - 1);
    } else if (this.config.infiniteLoop !== false) {
      this.showSlide(this.slides.length - 1);
    }
  }

  startSlideshow() {
    this.stopSlideshow();
    if (this.slides.length < 2 || this.config.autoPlay !== true) return;

    const interval = Math.max(1000, Number(this.config.interval) || 5000);
    this.timer = window.setInterval(() => this.nextSlide(), interval);
  }

  stopSlideshow() {
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }

  goToSlide(index) {
    this.showSlide(index);
    this.startSlideshow();
  }
}

class GameGalleryManager {
  constructor(galleryConfig = {}) {
    this.config = galleryConfig;
    this.cards = Array.from(elements.galleryGrid?.querySelectorAll('.game__card') || []);
    this.initialVisible = galleryConfig.showMore === true
      ? Math.max(1, Number(galleryConfig.initialVisible) || 3)
      : Number.POSITIVE_INFINITY;
    this.isExpanded = false;
  }

  init() {
    this.cards.forEach((card, index) => {
      card.hidden = index >= this.initialVisible;
    });
    this.updateLayoutClass();
    this.updateButton();
  }

  updateLayoutClass() {
    const visibleCount = this.isExpanded ? this.cards.length : Math.min(this.initialVisible, this.cards.length);
    elements.galleryGrid?.classList.toggle('has-3-games', visibleCount === 3);
  }

  updateButton() {
    if (!elements.galleryActions || !elements.loadMoreGames) return;
    const hasMore = this.cards.length > this.initialVisible && this.config.showMore === true;
    elements.galleryActions.hidden = !hasMore;
    elements.loadMoreGames.setAttribute('aria-expanded', String(this.isExpanded));
    updateGalleryButtonText();
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
    this.cards.forEach((card, index) => {
      card.hidden = !this.isExpanded && index >= this.initialVisible;
    });
    this.updateLayoutClass();
    this.updateButton();
  }
}

function initializeScrollEffects() {
  const scrollConfig = config.scrollEffects || {};
  const scrollTopThreshold = Number(scrollConfig.scrollTopThreshold) || 200;
  const headerBackgroundChange = Number(scrollConfig.headerBackgroundChange) || 50;
  const opacity = scrollConfig.headerOpacity || { normal: 0.95, scrolled: 0.98 };

  const updateOnScroll = () => {
    const scrollY = window.scrollY;
    elements.scrollTop?.classList.toggle('show', scrollY > scrollTopThreshold);

    if (elements.header) {
      const value = scrollY > headerBackgroundChange ? opacity.scrolled : opacity.normal;
      elements.header.style.backgroundColor = `rgba(26, 26, 26, ${value})`;
    }
    updateActiveNavItem();
  };

  window.addEventListener('scroll', debounce(updateOnScroll, config.performance?.debounceDelay || 150), { passive: true });
  updateOnScroll();
}

function updateActiveNavItem() {
  const links = Array.from(elements.navList?.querySelectorAll('.nav__link') || []);
  if (!links.length) return;

  const marker = window.scrollY + (elements.header?.offsetHeight || 0) + 60;
  const sections = links
    .map(link => document.getElementById(link.getAttribute('href')?.slice(1)))
    .filter(Boolean);

  let activeId = sections[0]?.id;
  sections.forEach(section => {
    if (section.offsetTop <= marker) activeId = section.id;
  });

  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
    activeId = sections[sections.length - 1]?.id || activeId;
  }

  links.forEach(link => {
    const active = link.getAttribute('href') === `#${activeId}`;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

function toggleMobileMenu() {
  if (!elements.navMenu || !elements.navToggle) return;
  const isOpen = elements.navMenu.classList.toggle('show');
  elements.navToggle.classList.toggle('active', isOpen);
  elements.navToggle.setAttribute('aria-expanded', String(isOpen));
}

function closeMobileMenu() {
  elements.navMenu?.classList.remove('show');
  elements.navToggle?.classList.remove('active');
  elements.navToggle?.setAttribute('aria-expanded', 'false');
}

function addEventListeners() {
  elements.languageSelect?.addEventListener('change', event => changeLanguage(event.target.value));
  elements.navToggle?.addEventListener('click', toggleMobileMenu);

  elements.navList?.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;

      const top = target.id === 'home'
        ? 0
        : target.getBoundingClientRect().top + window.scrollY - (elements.header?.offsetHeight || 0);
      window.scrollTo({ top, behavior: 'smooth' });
      closeMobileMenu();
    });
  });

  elements.loadMoreGames?.addEventListener('click', () => galleryManager?.toggle());

  elements.scrollTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  if (config.carousel?.pauseOnHover === true && elements.hero) {
    elements.hero.addEventListener('mouseenter', () => carouselManager?.stopSlideshow());
    elements.hero.addEventListener('mouseleave', () => carouselManager?.startSlideshow());
  }

  elements.heroIndicators?.querySelectorAll('.hero__indicator').forEach(indicator => {
    indicator.addEventListener('click', () => {
      const index = Number(indicator.dataset.slide);
      if (Number.isInteger(index)) carouselManager?.goToSlide(index);
    });
  });

  if (config.accessibility?.keyboardNavigation === true) {
    document.addEventListener('keydown', event => {
      if (!carouselManager || !elements.hero || elements.hero.hidden) return;
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.target instanceof Element && event.target.closest('input, textarea, select, button, a, [contenteditable="true"]')) return;

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        carouselManager.previousSlide();
        carouselManager.startSlideshow();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        carouselManager.nextSlide();
        carouselManager.startSlideshow();
      }
    });
  }

  window.addEventListener('resize', debounce(updateActiveNavItem, config.performance?.debounceDelay || 150), { passive: true });
}

function applyAccessibilitySettings() {
  if (config.accessibility?.reducedMotion !== true) return;
  const prefersReducedMotion = typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) return;

  document.documentElement.style.setProperty('--transition-fast', '0.01ms');
  document.documentElement.style.setProperty('--transition-normal', '0.01ms');
  document.documentElement.style.setProperty('--transition-slow', '0.01ms');
  document.documentElement.style.setProperty('--carousel-transition-duration', '0.01ms');
  carouselManager?.stopSlideshow();
}

function debounce(callback, wait) {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => callback(...args), wait);
  };
}

window.addEventListener('error', event => {
  console.error('Website runtime error:', event.error || event.message);
});

window.GameStudioApp = {
  changeLanguage,
  detectLanguage,
  get config() { return config; },
  get contentData() { return contentData; },
  get currentLanguage() { return currentLanguage; }
};

document.addEventListener('DOMContentLoaded', initializeApp);