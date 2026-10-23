/**
 * FREIGHT BROKERAGE & LOAD-MATCHING PLATFORM (FREIGHTHAWK)
 * Phase 1: Shared Foundation JavaScript
 * - Theme Switcher (Light / Dark) with localStorage persistence
 * - Direction Switcher (LTR / RTL) with localStorage persistence
 * - Mobile Navigation Drawer & Backdrop
 * - System Status & Live Load Ticker Simulator
 * - Interactive UI State Handlers
 */

(function () {
  'use strict';

  // Storage Keys
  const THEME_KEY = 'freighthawk_theme';
  const DIR_KEY = 'freighthawk_direction';

  /**
   * Theme Controller
   */
  const ThemeController = {
    init: function () {
      const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
      this.setTheme(savedTheme);
      this.bindEvents();
    },

    setTheme: function (theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(THEME_KEY, theme);

      // Update UI Switcher buttons if present
      document.querySelectorAll('[data-set-theme]').forEach(btn => {
        const targetTheme = btn.getAttribute('data-set-theme');
        if (targetTheme === theme) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Update icon-only theme toggle buttons
      document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
        const icon = btn.querySelector('i');
        if (icon) {
          if (theme === 'dark') {
            icon.className = 'fa-solid fa-sun';
            btn.setAttribute('title', 'Switch to Light Mode');
            btn.setAttribute('aria-label', 'Switch to Light Mode');
          } else {
            icon.className = 'fa-solid fa-moon';
            btn.setAttribute('title', 'Switch to Dark Mode');
            btn.setAttribute('aria-label', 'Switch to Dark Mode');
          }
        }
      });

      window.dispatchEvent(new CustomEvent('freighthawk:theme-changed', { detail: { theme } }));
    },

    toggle: function () {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      this.setTheme(next);
    },

    bindEvents: function () {
      document.querySelectorAll('[data-set-theme]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const targetTheme = btn.getAttribute('data-set-theme');
          this.setTheme(targetTheme);
        });
      });

      document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggle();
        });
      });
    }
  };

  /**
   * Direction (LTR / RTL) Controller
   */
  const DirectionController = {
    init: function () {
      const savedDir = localStorage.getItem(DIR_KEY) || 'ltr';
      this.setDirection(savedDir);
      this.bindEvents();
    },

    setDirection: function (dir) {
      document.documentElement.setAttribute('dir', dir);
      localStorage.setItem(DIR_KEY, dir);

      // Update UI Switcher buttons if present
      document.querySelectorAll('[data-set-dir]').forEach(btn => {
        const targetDir = btn.getAttribute('data-set-dir');
        if (targetDir === dir) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Update icon-only dir toggle buttons
      document.querySelectorAll('[data-dir-toggle]').forEach(btn => {
        const indicator = btn.querySelector('.fh-dir-indicator');
        if (indicator) {
          indicator.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
        }
        const titleText = dir === 'rtl' ? 'Switch to LTR Direction' : 'Switch to RTL Direction';
        btn.setAttribute('title', titleText);
        btn.setAttribute('aria-label', titleText);
      });

      window.dispatchEvent(new CustomEvent('freighthawk:dir-changed', { detail: { dir } }));
    },

    toggle: function () {
      const current = document.documentElement.getAttribute('dir') || 'ltr';
      const next = current === 'rtl' ? 'ltr' : 'rtl';
      this.setDirection(next);
    },

    bindEvents: function () {
      document.querySelectorAll('[data-set-dir]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const targetDir = btn.getAttribute('data-set-dir');
          this.setDirection(targetDir);
        });
      });

      document.querySelectorAll('[data-dir-toggle]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggle();
        });
      });
    }
  };

  /**
   * Mobile Drawer Controller
   */
  const MobileDrawer = {
    init: function () {
      this.drawer = document.querySelector('.fh-mobile-drawer');
      this.backdrop = document.querySelector('.fh-drawer-backdrop');
      this.openBtn = document.querySelector('.fh-nav-toggle');
      this.closeBtn = document.querySelector('.fh-drawer-close');

      if (!this.drawer) return;

      if (this.openBtn) {
        this.openBtn.addEventListener('click', () => this.open());
      }
      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.close());
      }
      if (this.backdrop) {
        this.backdrop.addEventListener('click', () => this.close());
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen()) {
          this.close();
        }
      });

      // Toggle mobile dropdown (e.g. Home 1 / Home 2 dropdown)
      if (this.drawer) {
        this.drawer.querySelectorAll('.fh-mobile-dropdown-toggle').forEach(toggle => {
          toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const targetId = toggle.getAttribute('data-target') || 'mobileHomeDropdown';
            const subnav = document.getElementById(targetId);
            const isOpen = toggle.classList.contains('open');

            if (isOpen) {
              toggle.classList.remove('open');
              toggle.setAttribute('aria-expanded', 'false');
              if (subnav) subnav.classList.remove('open');
            } else {
              toggle.classList.add('open');
              toggle.setAttribute('aria-expanded', 'true');
              if (subnav) subnav.classList.add('open');
            }
          });
        });

        // Auto close drawer when any navigation link is clicked (excluding dropdown toggle buttons)
        this.drawer.querySelectorAll('a[href]').forEach(link => {
          link.addEventListener('click', () => {
            this.close();
          });
        });
      }
    },

    isOpen: function () {
      return this.drawer && this.drawer.classList.contains('open');
    },

    open: function () {
      if (this.drawer) this.drawer.classList.add('open');
      if (this.backdrop) this.backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    },

    close: function () {
      if (this.drawer) this.drawer.classList.remove('open');
      if (this.backdrop) this.backdrop.classList.remove('active');
      document.body.style.overflow = '';
      // Close any active desktop dropdowns
      document.querySelectorAll('.fh-dropdown-menu').forEach(menu => {
        menu.style.display = '';
      });
      // Close any active mobile drawer dropdowns (Home dropdown)
      document.querySelectorAll('.fh-mobile-dropdown-toggle').forEach(btn => {
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
      document.querySelectorAll('.fh-mobile-subnav').forEach(subnav => {
        subnav.classList.remove('open');
      });
    }
  };

  /**
   * Live Active Loads Ticker Simulator
   */
  const LiveTicker = {
    init: function () {
      const tickerCount = document.getElementById('liveLoadCount');
      if (!tickerCount) return;

      let count = 1482;
      setInterval(() => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        count = Math.max(1200, count + delta);
        tickerCount.textContent = count.toLocaleString();
      }, 4000);
    }
  };

  /**
   * Modal Controller (Post a Load / Quick Book)
   */
  const ModalController = {
    init: function () {
      // Open modal triggers
      document.querySelectorAll('[data-open-modal]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          const modalId = trigger.getAttribute('data-open-modal');
          this.open(modalId);
        });
      });

      // Close modal triggers
      document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', () => {
          this.closeAll();
        });
      });

      // Overlay background click to close
      document.querySelectorAll('.fh-modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) {
            this.closeAll();
          }
        });
      });

      // Escape key to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeAll();
        }
      });
    },

    open: function (modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Dashboard active highlight logic
        if (modalId === 'shipperDashboardModal' || modalId === 'carrierDashboardModal') {
          // Highlight desktop Dashboards nav link
          document.querySelectorAll('[data-nav="dashboards"]').forEach(nav => {
            nav.classList.add('active');
          });
          // Highlight mobile Dashboards dropdown toggle
          const mobDashToggle = document.getElementById('mobileDashboardsToggle');
          if (mobDashToggle) {
            mobDashToggle.classList.add('active');
          }

          // Highlight the chosen dashboard in dropdowns
          document.querySelectorAll(`[data-open-modal="${modalId}"]`).forEach(el => {
            el.classList.add('active');
          });
          const otherModalId = modalId === 'shipperDashboardModal' ? 'carrierDashboardModal' : 'shipperDashboardModal';
          document.querySelectorAll(`[data-open-modal="${otherModalId}"]`).forEach(el => {
            el.classList.remove('active');
          });
        }
      }
    },

    closeAll: function () {
      document.querySelectorAll('.fh-modal-overlay.active').forEach(modal => {
        modal.classList.remove('active');
      });
      document.body.style.overflow = '';
    }
  };

  /**
   * Back To Top Floating Button Controller
   */
  const BackToTop = {
    init: function () {
      const btn = document.getElementById('backToTop');
      if (!btn) return;

      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          btn.classList.add('visible');
        } else {
          btn.classList.remove('visible');
        }
      });

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  };

  /**
   * Accordion Controller (FAQ and collapsible components)
   */
  const AccordionController = {
    init: function () {
      const headers = document.querySelectorAll('.fh-accordion-header');
      headers.forEach(header => {
        header.addEventListener('click', () => {
          const item = header.closest('.fh-accordion-item');
          if (!item) return;
          const body = item.querySelector('.fh-accordion-body');
          const isOpen = item.classList.contains('active');

          // Close other open items in the same accordion container
          const parentAccordion = item.closest('.fh-accordion');
          if (parentAccordion) {
            parentAccordion.querySelectorAll('.fh-accordion-item.active').forEach(activeItem => {
              if (activeItem !== item) {
                activeItem.classList.remove('active');
                const b = activeItem.querySelector('.fh-accordion-body');
                if (b) b.style.maxHeight = null;
              }
            });
          }

          if (isOpen) {
            item.classList.remove('active');
            if (body) body.style.maxHeight = null;
          } else {
            item.classList.add('active');
            if (body) body.style.maxHeight = body.scrollHeight + 'px';
          }
        });
      });

      // Auto-expand any item initially marked active
      document.querySelectorAll('.fh-accordion-item.active').forEach(item => {
        const body = item.querySelector('.fh-accordion-body');
        if (body) body.style.maxHeight = body.scrollHeight + 'px';
      });
    }
  };

  /**
   * Preloader Controller
   */
  const PreloaderController = {
    init: function () {
      const loader = document.getElementById('pageLoader');
      if (!loader) return;

      const hideLoader = function () {
        if (!loader.classList.contains('fade-out')) {
          loader.classList.add('fade-out');
          setTimeout(() => {
            if (loader.parentNode) {
              loader.parentNode.removeChild(loader);
            }
          }, 450);
        }
      };

      if (document.readyState === 'complete') {
        setTimeout(hideLoader, 150);
      } else {
        window.addEventListener('load', () => setTimeout(hideLoader, 200));
        // Fallback safeguard so loader never gets stuck
        setTimeout(hideLoader, 2500);
      }
    }
  };

  /**
   * Sticky Header Controller
   */
  const StickyHeader = {
    init: function () {
      const header = document.getElementById('mainHeader');
      if (!header) return;

      const onScroll = function () {
        if (window.scrollY > 15) {
          header.classList.add('is-scrolled');
        } else {
          header.classList.remove('is-scrolled');
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  };

  // Immediate preloader attachment
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    PreloaderController.init();
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      PreloaderController.init();
    });
  }

  /**
   * Initialize on DOM Content Loaded
   */
  document.addEventListener('DOMContentLoaded', function () {
    PreloaderController.init();
    StickyHeader.init();
    ThemeController.init();
    DirectionController.init();
    MobileDrawer.init();
    LiveTicker.init();
    ModalController.init();
    BackToTop.init();
    AccordionController.init();
  });

  // Export globally for page integration
  window.FreightHawk = {
    Theme: ThemeController,
    Direction: DirectionController,
    Drawer: MobileDrawer,
    Modal: ModalController,
    BackToTop: BackToTop,
    Accordion: AccordionController,
    Preloader: PreloaderController,
    StickyHeader: StickyHeader
  };
})();
