// ===== 全局变量 =====
let currentLanguage = 'zh-CN';
let currentSlide = 0;
let slideInterval;
let config = {};
let contentData = {};

// ===== DOM元素 =====
const elements = {
  navToggle: document.getElementById('nav-toggle'),
  navMenu: document.getElementById('nav-menu'),
  languageToggle: document.getElementById('language-toggle'),
  heroSlides: document.querySelectorAll('.hero__slide'),
  heroIndicators: document.querySelectorAll('.hero__indicator'),
  scrollTop: document.getElementById('scroll-top'),
  navLinks: document.querySelectorAll('.nav__link'),
  loadMoreGames: document.getElementById('load-more-games'),
  galleryGrid: document.getElementById('gallery-grid'),
  hiddenGames: document.querySelectorAll('.hidden-game')
};

// ===== 配置加载器 =====
class ConfigLoader {
  constructor() {
    this.config = null;
    this.content = null;
  }

  async loadConfig() {
    try {
      const response = await fetch('data/config.json');
      if (!response.ok) {
        throw new Error(`Failed to load config: ${response.status}`);
      }
      this.config = await response.json();
      console.log('配置加载成功:', this.config);
      return this.config;
    } catch (error) {
      console.error('配置加载失败:', error);
      throw new Error('Unable to load application configuration. Please check that data/config.json exists and is valid.');
    }
  }

  async loadContent() {
    try {
      const response = await fetch('data/content.json');
      if (!response.ok) {
        throw new Error(`Failed to load content: ${response.status}`);
      }
      this.content = await response.json();
      console.log('内容数据加载成功');
      return this.content;
    } catch (error) {
      console.error('内容数据加载失败:', error);
      throw new Error('Unable to load content data. Please check that data/content.json exists and is valid.');
    }
  }


}

// ===== 图片管理器 =====
class ImageManager {
  constructor(config) {
    this.config = config;
    this.loadedImages = new Set();
  }

  preloadImages() {
    if (!this.config.performance?.preloadImages) return;

    const imagesToPreload = [
      ...this.config.images?.hero || [],
      ...this.config.images?.logos || [],
      ...this.config.images?.team || []
    ];

    imagesToPreload.forEach(imageInfo => {
      if (!this.loadedImages.has(imageInfo.src)) {
        const img = new Image();
        img.src = imageInfo.src;
        this.loadedImages.add(imageInfo.src);
      }
    });
  }

  getImageByCategory(category) {
    return this.config.images?.gallery?.filter(img => img.category === category) || [];
  }

  getHeroImages() {
    return this.config.images?.hero || [];
  }

  getLogoImages() {
    return this.config.images?.logos || [];
  }
}

// ===== 轮播管理器 =====
/**
 * 轮播图管理器
 * 功能说明：
 * - 自动轮播：每5秒自动切换到下一张图片
 * - 手动控制：用户点击指示器时立即切换
 * - 定时器重置：用户点击后重置5秒定时器
 * - 悬停暂停：鼠标悬停时暂停自动轮播
 * 
 * 时间配置说明：
 * - interval: 轮播间隔时间（毫秒），默认5000ms（5秒）
 * - transitionDuration: 过渡动画时间（毫秒）
 */
class CarouselManager {
  constructor(config, elements) {
    this.config = config.carousel;
    this.elements = elements;
    this.currentSlide = 0;
    this.slideInterval = null;
  }

  /**
   * 初始化轮播图
   */
  init() {
    this.showSlide(0);
    if (this.config.autoPlay) {
      this.startSlideshow();
    }
  }

  /**
   * 显示指定索引的幻灯片
   * @param {number} index - 幻灯片索引
   */
  showSlide(index) {
    // 隐藏所有幻灯片
    this.elements.heroSlides.forEach(slide => {
      slide.classList.remove('hero__slide--active');
    });
    
    // 移除所有指示器的active状态
    this.elements.heroIndicators.forEach(indicator => {
      indicator.classList.remove('hero__indicator--active');
    });
    
    // 显示当前幻灯片
    if (this.elements.heroSlides[index]) {
      this.elements.heroSlides[index].classList.add('hero__slide--active');
    }
    
    if (this.elements.heroIndicators[index]) {
      this.elements.heroIndicators[index].classList.add('hero__indicator--active');
    }
    
    this.currentSlide = index;
  }

  /**
   * 切换到下一张幻灯片
   */
  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.elements.heroSlides.length;
    this.showSlide(nextIndex);
  }

  /**
   * 启动自动轮播
   * 每隔指定间隔时间自动切换到下一张图片
   */
  startSlideshow() {
    if (this.elements.heroSlides.length === 0) {
      console.warn('Hero slides not found');
      return;
    }
    
    // 清除可能存在的旧定时器
    this.stopSlideshow();
    
    // 启动新的轮播定时器
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, this.config.interval);
    
    console.log(`轮播定时器已启动，间隔：${this.config.interval}ms`);
  }

  /**
   * 停止自动轮播
   */
  stopSlideshow() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
      console.log('轮播定时器已停止');
    }
  }

  /**
   * 跳转到指定幻灯片（用户手动点击时调用）
   * @param {number} index - 目标幻灯片索引
   */
  goToSlide(index) {
    console.log(`用户点击跳转到幻灯片：${index}`);
    
    // 1. 立即停止当前定时器
    this.stopSlideshow();
    
    // 2. 立即切换到目标幻灯片
    this.showSlide(index);
    
    // 3. 如果开启了自动轮播，重置定时器
    if (this.config.autoPlay) {
      // 延迟重启，给用户足够时间查看当前图片
      setTimeout(() => {
        this.startSlideshow();
      }, this.config.interval);
      
      console.log(`将在 ${this.config.interval}ms 后重启轮播定时器`);
    }
  }
}

// ===== 游戏Gallery管理器 =====
class GameGalleryManager {
  constructor() {
    this.elements = elements;
    this.isExpanded = false;
    this.maxVisibleGames = 3; // 默认显示3个游戏
  }

  init() {
    this.setupGalleryLayout();
    this.setupLoadMoreButton();
  }

  setupGalleryLayout() {
    const { galleryGrid, hiddenGames } = this.elements;
    
    if (!galleryGrid) return;

    // 检查当前可见的游戏数量
    const visibleGames = galleryGrid.querySelectorAll('.game__card:not(.hidden-game)');
    const totalGames = galleryGrid.querySelectorAll('.game__card').length;
    
    console.log(`Gallery布局: 可见游戏 ${visibleGames.length}, 总游戏 ${totalGames}`);
    
    // 如果只有3个游戏，应用特殊布局
    if (totalGames === 3) {
      galleryGrid.classList.add('has-3-games');
    }
    
    // 初始化"发现更多"按钮状态
    this.updateLoadMoreButton();
  }

  setupLoadMoreButton() {
    const { loadMoreGames } = this.elements;
    
    if (!loadMoreGames) return;
    
    loadMoreGames.addEventListener('click', () => {
      this.toggleGamesDisplay();
    });
  }

  toggleGamesDisplay() {
    const { hiddenGames, loadMoreGames } = this.elements;
    
    if (!loadMoreGames) return;
    
    // 添加加载状态
    loadMoreGames.classList.add('loading');
    loadMoreGames.disabled = true;
    
    setTimeout(() => {
      if (!this.isExpanded) {
        // 显示更多游戏
        hiddenGames.forEach((game, index) => {
          setTimeout(() => {
            game.style.display = 'block';
            game.classList.remove('hidden-game');
            game.classList.add('show');
          }, index * 100);
        });
        
        // 更新按钮文本和图标
        const loadMoreText = loadMoreGames.querySelector('.load-more-text');
        if (loadMoreText) {
          loadMoreText.textContent = currentLanguage === 'zh-CN' ? '收起游戏' : 'Show Less';
        }
        
        // 更新图标
        const loadMoreIcon = loadMoreGames.querySelector('.load-more-icon');
        if (loadMoreIcon) {
          loadMoreIcon.innerHTML = '<path d="M18 15L12 9L6 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
        }
        
        this.isExpanded = true;
        loadMoreGames.setAttribute('data-expanded', 'true');
      } else {
        // 隐藏游戏
        hiddenGames.forEach((game, index) => {
          setTimeout(() => {
            game.classList.remove('show');
            game.classList.add('hidden-game');
            setTimeout(() => {
              game.style.display = 'none';
            }, 300);
          }, index * 100);
        });
        
        // 更新按钮文本和图标
        const loadMoreText = loadMoreGames.querySelector('.load-more-text');
        if (loadMoreText) {
          loadMoreText.textContent = currentLanguage === 'zh-CN' ? '发现更多游戏' : 'Discover More Games';
        }
        
        // 更新图标
        const loadMoreIcon = loadMoreGames.querySelector('.load-more-icon');
        if (loadMoreIcon) {
          loadMoreIcon.innerHTML = '<path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
        }
        
        this.isExpanded = false;
        loadMoreGames.setAttribute('data-expanded', 'false');
      }
      
      // 移除加载状态
      loadMoreGames.classList.remove('loading');
      loadMoreGames.disabled = false;
      
      // 滚动到gallery区域
      setTimeout(() => {
        const gallerySection = document.querySelector('.gallery');
        if (gallerySection) {
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = gallerySection.offsetTop - headerHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }, 500);
      
    }, 500);
  }

  updateLoadMoreButton() {
    const { loadMoreGames, hiddenGames } = this.elements;
    
    if (!loadMoreGames || hiddenGames.length === 0) {
      // 如果没有隐藏的游戏或按钮不存在，隐藏按钮
      if (loadMoreGames) {
        loadMoreGames.style.display = 'none';
      }
      return;
    }
    
    // 显示按钮
    loadMoreGames.style.display = 'inline-flex';
    
    // 设置初始状态
    loadMoreGames.setAttribute('data-expanded', 'false');
    
    // 设置初始文本
    const loadMoreText = loadMoreGames.querySelector('.load-more-text');
    if (loadMoreText) {
      loadMoreText.textContent = currentLanguage === 'zh-CN' ? '发现更多游戏' : 'Discover More Games';
    }
  }
}

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', async function() {
  console.log('开始初始化应用...');
  
  // 初始化配置加载器
  const configLoader = new ConfigLoader();
  
  try {
    // 并行加载配置和内容
    const [configData, contentDataResult] = await Promise.all([
      configLoader.loadConfig(),
      configLoader.loadContent()
    ]);
    
    config = configData;
    contentData = contentDataResult;
    
    // 初始化各个管理器
    const imageManager = new ImageManager(config);
    const carouselManager = new CarouselManager(config, elements);
    
    // 预加载图片
    imageManager.preloadImages();
    
    // 初始化各个功能模块
    initializeLanguage(config);
    carouselManager.init();
    initializeNavigation(config);
    initializeScrollEffects(config);
    initializeLazyLoading(config);
    
    // 初始化游戏Gallery管理器
    const gameGalleryManager = new GameGalleryManager();
    gameGalleryManager.init();
    
    addEventListeners(config, carouselManager);
    
    // 页面加载完成后的处理
    handlePageLoad(config);
    
    console.log('应用初始化完成');
    
  } catch (error) {
    console.error('应用初始化失败:', error);
  }
});

// ===== 多语言功能 =====
function initializeLanguage(config) {
  // 获取支持的语言列表和fallback语言
  const supportedLanguages = config.content?.supportedLanguages || ['zh-CN', 'en-US'];
  const fallbackLanguage = config.content?.fallbackLanguage || 'en-US';
  
  // 检测浏览器语言或从本地存储获取
  const savedLanguage = localStorage.getItem('preferredLanguage');
  const detectedLanguage = detectLanguage(navigator.language, supportedLanguages, fallbackLanguage);
  
  // 优先级：本地存储 > 检测到的语言 > 默认语言 > fallback语言
  currentLanguage = savedLanguage || detectedLanguage || config.content?.defaultLanguage || fallbackLanguage;
  
  // 确保当前语言在支持列表中，否则使用fallback
  if (!supportedLanguages.includes(currentLanguage)) {
    console.warn(`语言 ${currentLanguage} 不在支持列表中，使用fallback语言 ${fallbackLanguage}`);
    currentLanguage = fallbackLanguage;
    localStorage.setItem('preferredLanguage', currentLanguage);
  }
  
  console.log(`语言初始化完成: ${currentLanguage}`, {
    savedLanguage,
    detectedLanguage,
    fallbackLanguage,
    supportedLanguages
  });
  
  updateLanguageDisplay();
  updateContent();
}

/**
 * 检测浏览器语言，支持多种语言代码格式
 * @param {string} browserLanguage - 浏览器语言代码
 * @param {Array} supportedLanguages - 支持的语言列表
 * @param {string} fallbackLanguage - fallback语言
 * @returns {string} 检测到的语言代码
 */
function detectLanguage(browserLanguage, supportedLanguages, fallbackLanguage) {
  console.log('检测浏览器语言:', browserLanguage);
  
  // 直接匹配
  if (supportedLanguages.includes(browserLanguage)) {
    console.log('直接匹配到支持的语言:', browserLanguage);
    return browserLanguage;
  }
  
  // 提取语言前缀（如 'zh-CN' -> 'zh', 'en-US' -> 'en'）
  const languagePrefix = browserLanguage.split('-')[0];
  
  // 尝试匹配语言前缀
  const matchedLanguage = supportedLanguages.find(lang => {
    const langPrefix = lang.split('-')[0];
    return langPrefix === languagePrefix;
  });
  
  if (matchedLanguage) {
    console.log(`通过语言前缀匹配: ${browserLanguage} -> ${matchedLanguage}`);
    return matchedLanguage;
  }
  
  // 特殊语言代码映射
  const languageMap = {
    'zh': 'zh-CN',
    'en': 'en-US',
    'zh-cn': 'zh-CN',
    'zh-tw': 'zh-CN', // 繁体中文也使用简体中文
    'en-us': 'en-US',
    'en-gb': 'en-US'  // 英式英语也使用美式英语
  };
  
  const normalizedLanguage = browserLanguage.toLowerCase();
  if (languageMap[normalizedLanguage]) {
    console.log(`通过语言映射匹配: ${browserLanguage} -> ${languageMap[normalizedLanguage]}`);
    return languageMap[normalizedLanguage];
  }
  
  console.log(`未找到匹配的语言，使用fallback: ${fallbackLanguage}`);
  return fallbackLanguage;
}

function updateLanguageDisplay() {
  // 更新select元素（如果存在）
  const languageSelect = document.getElementById('language-select');
  if (languageSelect) {
    languageSelect.value = currentLanguage;
  }
  
  // 更新按钮元素（如果存在）
  const languageCurrent = document.querySelector('.language-current');
  const languageOther = document.querySelector('.language-other');
  
  if (languageCurrent && languageOther) {
    if (currentLanguage === 'zh-CN') {
      languageCurrent.textContent = '中文';
      languageOther.textContent = 'EN';
    } else {
      languageCurrent.textContent = 'EN';
      languageOther.textContent = '中文';
    }
  }
  
  // 更新HTML lang属性
  document.documentElement.lang = currentLanguage === 'zh-CN' ? 'zh-CN' : 'en-US';
}

function updateContent() {
  const content = contentData[currentLanguage];

  if (!content) {
    console.warn(`内容数据未找到，语言: ${currentLanguage}`);
    return;
  }

  // 更新所有带有data-key的元素
  document.querySelectorAll('[data-key]').forEach(element => {
    const key = element.getAttribute('data-key');
    const value = getNestedValue(content, key);

    if (value !== undefined && value !== null) {
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = value;
      } else if (element.tagName === 'A' && typeof value === 'object' && value.name && value.url) {
        // 特殊处理链接元素，设置文本和href
        element.textContent = value.name;
        element.href = value.url;
        
        // 为外部链接添加 target="_blank" 和 rel="noopener"（安全最佳实践）
        if (value.url.startsWith('http') || value.url.startsWith('mailto')) {
          element.setAttribute('target', '_blank');
          element.setAttribute('rel', 'noopener noreferrer');
        }
        
        console.log(`链接更新成功: ${key} -> name: ${value.name}, url: ${value.url}`); // 调试日志
      } else {
        element.textContent = value;
      }
    } else {
      console.warn(`未找到 data-key="${key}" 的值，使用默认值`); // 警告日志
      // 可选：为A标签设置默认文本和href，防止完全失效
      if (element.tagName === 'A') {
        element.textContent = '默认链接';
        element.href = '#';
      }
    }
  });

  // 特殊处理
  updateSiteTitle();
  updateGameGalleryButton();
  updateGameGallery();
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current && current[key], obj);
}

function updateSiteTitle() {
  const content = contentData[currentLanguage];
  if (content?.site) {
    document.title = `${content.site.title} - ${content.site.description}`;
  }
}

function updateGameGalleryButton() {
  const loadMoreButton = document.getElementById('load-more-games');
  if (!loadMoreButton) return;

  const loadMoreText = loadMoreButton.querySelector('.load-more-text');
  if (!loadMoreText) return;

  // 检查按钮当前状态
  const isExpanded = loadMoreButton.getAttribute('data-expanded') === 'true';

  if (isExpanded) {
    // 收起状态
    loadMoreText.textContent = currentLanguage === 'zh-CN' ? '收起游戏' : 'Show Less';
  } else {
    // 展开状态
    loadMoreText.textContent = currentLanguage === 'zh-CN' ? '发现更多游戏' : 'Discover More Games';
  }
}

function updateGameGallery() {
  const content = contentData[currentLanguage];

  if (!content) {
    console.warn(`内容数据未找到，语言: ${currentLanguage}`);
    return;
  }

  // 更新所有游戏卡片的本地化内容
  document.querySelectorAll('.game__card').forEach((card, index) => {
    const gameData = content.gallery?.games?.[index];
    if (!gameData) {
      console.warn(`游戏数据未找到，索引: ${index}, 语言: ${currentLanguage}`);
      return;
    }

    // 更新游戏标题
    const titleElement = card.querySelector('.game__title');
    if (titleElement) {
      titleElement.textContent = gameData.name;
    }

    // 更新游戏类型
    const genreElement = card.querySelector('.game__genre');
    if (genreElement) {
      genreElement.textContent = gameData.genre;
    }

    // 更新游戏描述
    const descElement = card.querySelector('.game__description');
    if (descElement) {
      descElement.textContent = gameData.description;
    }
  });

  console.log(`游戏Gallery已更新为 ${currentLanguage} 语言`);
}

function toggleLanguage() {
  const supportedLanguages = config.content?.supportedLanguages || ['zh-CN', 'en-US'];
  const fallbackLanguage = config.content?.fallbackLanguage || 'en-US';
  
  const currentIndex = supportedLanguages.indexOf(currentLanguage);
  const nextIndex = (currentIndex + 1) % supportedLanguages.length;
  
  const newLanguage = supportedLanguages[nextIndex];
  
  // 确保切换到的语言在支持列表中
  if (supportedLanguages.includes(newLanguage)) {
    currentLanguage = newLanguage;
    localStorage.setItem('preferredLanguage', currentLanguage);
    console.log(`语言切换到: ${currentLanguage}`);
    updateLanguageDisplay();
    updateContent();
  } else {
    console.warn(`目标语言 ${newLanguage} 不在支持列表中，使用fallback语言 ${fallbackLanguage}`);
    currentLanguage = fallbackLanguage;
    localStorage.setItem('preferredLanguage', currentLanguage);
    updateLanguageDisplay();
    updateContent();
  }
}

/**
 * 通过select下拉框切换语言
 * @param {string} languageCode - 选择的语言代码
 */
function changeLanguage(languageCode) {
  const supportedLanguages = config.content?.supportedLanguages || ['zh-CN', 'en-US'];
  const fallbackLanguage = config.content?.fallbackLanguage || 'en-US';
  
  // 验证语言代码
  if (supportedLanguages.includes(languageCode)) {
    currentLanguage = languageCode;
    localStorage.setItem('preferredLanguage', currentLanguage);
    console.log(`语言切换到: ${currentLanguage}`);
    updateLanguageDisplay();
    updateContent();
  } else {
    console.warn(`选择的语言 ${languageCode} 不在支持列表中，使用fallback语言 ${fallbackLanguage}`);
    currentLanguage = fallbackLanguage;
    localStorage.setItem('preferredLanguage', currentLanguage);
    updateLanguageDisplay();
    updateContent();
  }
}

// ===== 导航功能 =====
function initializeNavigation(config) {
  // 首先设置首页为初始active状态
  setInitialActiveState();
  
  // 平滑滚动
  elements.navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      console.log('导航链接点击:', targetId);
      
      if (targetSection) {
        // 立即更新导航状态（点击时立即反馈）
        elements.navLinks.forEach(navLink => {
          navLink.classList.remove('active');
        });
        this.classList.add('active');
        
        let targetPosition;
        
        // 特殊处理home链接 - 滚动到页面最顶部
        if (targetId === '#home') {
          targetPosition = 0;
        } else {
          // 其他链接减去header高度，避免被导航栏遮挡
          const headerHeight = document.querySelector('.header').offsetHeight;
          targetPosition = targetSection.offsetTop - headerHeight;
        }
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // 滚动完成后再次更新导航状态（确保准确性）
        setTimeout(() => {
          updateActiveNavItem();
        }, 500);
      }
      
      // 关闭移动端菜单
      closeMobileMenu();
    });
  });
  
  // 滚动时更新活动导航项（使用节流优化性能）
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(updateActiveNavItem, 10);
  });
  
  // 延迟设置初始状态，确保DOM完全加载
  setTimeout(() => {
    updateActiveNavItem();
  }, 200);
}

function updateActiveNavItem() {
  // 获取所有导航链接的href目标，只考虑导航中实际存在的section
  const validSectionIds = Array.from(elements.navLinks).map(link => {
    return link.getAttribute('href').substring(1); // 移除#符号
  });
  
  console.log('有效的导航section IDs:', validSectionIds);
  
  // 只获取导航中实际存在的section
  const sections = validSectionIds.map(id => {
    return document.getElementById(id);
  }).filter(section => section !== null);
  
  const headerHeight = document.querySelector('.header').offsetHeight;
  const scrollPosition = window.scrollY + headerHeight + 50;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  
  console.log('当前滚动位置:', scrollPosition, '窗口高度:', windowHeight, '文档高度:', documentHeight);
  
  // 检查是否接近或已经到达页面底部
  const isNearBottom = (window.scrollY + windowHeight) >= (documentHeight - 100);
  
  let activeSection = null;
  let maxSectionTop = -1;
  
  // 如果接近底部，直接选择最后一个section（contact）
  if (isNearBottom && sections.length > 0) {
    const lastSection = sections[sections.length - 1];
    activeSection = lastSection.getAttribute('id');
    console.log('接近页面底部，选择最后一个section:', activeSection);
  } else {
    // 找到当前可见区域对应的section
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      console.log(`检查section: ${sectionId}, 顶部: ${sectionTop}, 高度: ${sectionHeight}`);
      
      // 如果滚动位置在当前section范围内
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        if (sectionTop > maxSectionTop) {
          maxSectionTop = sectionTop;
          activeSection = sectionId;
        }
      }
    });
    
    // 如果没有找到匹配的section（可能在页面顶部），默认选中home
    if (!activeSection && scrollPosition < 100) {
      activeSection = 'home';
    }
  }
  
  console.log('当前活动section:', activeSection);
  
  // 更新导航链接的active状态
  elements.navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === `#${activeSection}`) {
      link.classList.add('active');
      console.log('设置active状态:', href);
    }
  });
}



// 强制设置首页为初始active状态
function setInitialActiveState() {
  console.log('设置初始导航状态 - 首页');
  elements.navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#home') {
      link.classList.add('active');
      console.log('首页设置为active状态');
    }
  });
}

function toggleMobileMenu() {
  elements.navMenu.classList.toggle('show');
  elements.navToggle.classList.toggle('active');
}

function closeMobileMenu() {
  elements.navMenu.classList.remove('show');
  elements.navToggle.classList.remove('active');
}

// ===== 滚动效果 =====
function initializeScrollEffects(config) {
  const scrollConfig = config.scrollEffects;
  
  window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    
    // 显示/隐藏返回顶部按钮
    if (scrollY > scrollConfig.scrollTopThreshold) {
      elements.scrollTop.classList.add('show');
    } else {
      elements.scrollTop.classList.remove('show');
    }
    
    // 导航栏背景透明度
    const header = document.querySelector('.header');
    if (header) {
      if (scrollY > scrollConfig.headerBackgroundChange) {
        header.style.backgroundColor = `rgba(26, 26, 26, ${scrollConfig.headerOpacity.scrolled})`;
      } else {
        header.style.backgroundColor = `rgba(26, 26, 26, ${scrollConfig.headerOpacity.normal})`;
      }
    }
  });
  
  // 初始化时检查滚动位置
  if (window.scrollY > scrollConfig.scrollTopThreshold && elements.scrollTop) {
    elements.scrollTop.classList.add('show');
  }
}

// ===== 图片懒加载 =====
function initializeLazyLoading(config) {
  const lazyConfig = config.lazyLoading;
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  }, {
    threshold: lazyConfig.threshold,
    rootMargin: lazyConfig.rootMargin
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// ===== 事件监听器 =====
function addEventListeners(config, carouselManager) {
  // 语言切换 - 按钮方式
  if (elements.languageToggle) {
    elements.languageToggle.addEventListener('click', toggleLanguage);
  }
  
  // 语言切换 - select下拉框方式
  const languageSelect = document.getElementById('language-select');
  if (languageSelect) {
    languageSelect.addEventListener('change', function(e) {
      const selectedLanguage = e.target.value;
      changeLanguage(selectedLanguage);
    });
  }
  
  // 移动端菜单切换
  if (elements.navToggle) {
    elements.navToggle.addEventListener('click', toggleMobileMenu);
  }
  
  // Hero轮播指示器点击事件
  elements.heroIndicators.forEach((indicator, index) => {
    indicator.addEventListener('click', function() {
      console.log(`点击轮播指示器：${index}`);
      
      // 用户点击指示器时立即切换到对应幻灯片
      // goToSlide方法会自动处理定时器的停止和重启
      carouselManager.goToSlide(index);
    });
  });
  
  // 返回顶部
  if (elements.scrollTop) {
    elements.scrollTop.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // 鼠标悬停暂停/恢复轮播
  if (config.carousel.pauseOnHover) {
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      // 鼠标进入Hero区域时暂停轮播
      heroSection.addEventListener('mouseenter', () => {
        console.log('鼠标悬停，暂停轮播');
        carouselManager.stopSlideshow();
      });
      
      // 鼠标离开Hero区域时恢复轮播
      heroSection.addEventListener('mouseleave', () => {
        console.log('鼠标离开，恢复轮播');
        if (config.carousel.autoPlay) {
          carouselManager.startSlideshow();
        }
      });
    }
  }
  
  // 键盘导航支持（左右箭头键）
  if (config.accessibility.keyboardNavigation) {
    document.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') {
        console.log('键盘导航：左箭头键');
        
        // 停止当前轮播
        carouselManager.stopSlideshow();
        
        // 切换到上一张
        const prevIndex = carouselManager.currentSlide === 0 ? elements.heroSlides.length - 1 : carouselManager.currentSlide - 1;
        carouselManager.showSlide(prevIndex);
        
        // 延迟重启轮播定时器，给用户足够时间查看
        setTimeout(() => {
          carouselManager.startSlideshow();
        }, carouselManager.config.interval);
        
      } else if (e.key === 'ArrowRight') {
        console.log('键盘导航：右箭头键');
        
        // 停止当前轮播
        carouselManager.stopSlideshow();
        
        // 切换到下一张
        carouselManager.nextSlide();
        
        // 延迟重启轮播定时器，给用户足够时间查看
        setTimeout(() => {
          carouselManager.startSlideshow();
        }, carouselManager.config.interval);
      }
    });
  }
  
  // 窗口大小改变时重新计算
  window.addEventListener('resize', debounce(function() {
    updateActiveNavItem();
  }, config.performance.debounceDelay));
}

// ===== 工具函数 =====
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ===== 页面加载完成后的处理 =====
function handlePageLoad(config) {
  window.addEventListener('load', function() {
    // 添加页面加载完成的类
    document.body.classList.add('loaded');
    
    // 立即设置初始导航状态
    console.log('页面加载完成，设置初始导航状态');
    setInitialActiveState();
    
    // 触发进入动画
    const animations = config.animations;
    setTimeout(() => {
      const animatedElements = document.querySelectorAll('.hero__title, .hero__subtitle, .hero__cta');
      animatedElements.forEach((el, index) => {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, index * animations.pageLoad.staggerDelay);
      });
    }, 300);
  });
  
  // 无障碍支持
  if (config.accessibility.reducedMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-fast', '0.01ms');
    document.documentElement.style.setProperty('--transition-normal', '0.01ms');
    document.documentElement.style.setProperty('--transition-slow', '0.01ms');
  }
}

// ===== 错误处理 =====
window.addEventListener('error', function(e) {
  console.error('页面错误:', e.error);
});

// ===== 导出函数（用于调试） =====
window.GameStudioApp = {
  toggleLanguage,
  changeLanguage,
  detectLanguage,
  config: () => config,
  contentData: () => contentData,
  currentLanguage: () => currentLanguage
};