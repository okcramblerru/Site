(function() {
  const footer = document.querySelector('.footer');
  const expandedPanels = {
    about: document.getElementById('expanded-about'),
    support: document.getElementById('expanded-support'),
    other: document.getElementById('expanded-other')
  };
  let activePanel = null;
  let closeTimeout = null;

  function closeFooter(immediate = false) {
    if (closeTimeout) clearTimeout(closeTimeout);
    if (immediate) {
      if (activePanel) {
        activePanel.classList.remove('active');
        activePanel = null;
      }
    } else {
      closeTimeout = setTimeout(() => {
        if (activePanel) {
          activePanel.classList.remove('active');
          activePanel = null;
        }
      }, 2000);
    }
  }

  function openFooter(panelKey) {
    if (closeTimeout) clearTimeout(closeTimeout);
    if (activePanel === expandedPanels[panelKey]) return;

    // закрыть текущий
    if (activePanel) {
      activePanel.classList.remove('active');
    }

    // открыть новый
    activePanel = expandedPanels[panelKey];
    if (activePanel) {
      activePanel.classList.add('active');
    }
  }

  // Обработка кликов по пунктам меню
  const footerLinks = document.querySelectorAll('.footer__item');
  footerLinks.forEach(item => {
    const link = item.querySelector('.footer__link');
    const type = item.getAttribute('data-expand');
    if (!type) return;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openFooter(type);
    });
  });

  // Закрытие при уходе мыши с футера
  footer.addEventListener('mouseleave', () => {
    closeFooter(false);
  });

  // Отмена закрытия при входе мыши в футер
  footer.addEventListener('mouseenter', () => {
    if (closeTimeout) clearTimeout(closeTimeout);
  });

  // Закрытие при клике вне футера
  document.addEventListener('click', (e) => {
    if (!footer.contains(e.target)) {
      closeFooter(true);
    }
  });

  // Предотвращаем закрытие при клике внутри футера
  footer.addEventListener('click', (e) => {
    e.stopPropagation();
  });
})();





