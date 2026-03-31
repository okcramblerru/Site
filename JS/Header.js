//Header
(function() {
    // Все пункты меню с data-dropdown
    const menuItems = document.querySelectorAll('.main-menu__item[data-dropdown]');
    
    // Собираем дропдауны по их id, которые соответствуют data-dropdown пунктов
    const dropdowns = {};
    menuItems.forEach(item => {
        const key = item.getAttribute('data-dropdown'); // например 'item1'
        const dropdownId = `dropdown-${key}`;           // 'dropdown-item1'
        const dropdown = document.getElementById(dropdownId);
        if (dropdown) {
            dropdowns[key] = dropdown;
        }
    });

    let activeDropdown = null;
    let closeTimeout = null;

    function closeAllDropdowns(immediate = false) {
        if (closeTimeout) {
            clearTimeout(closeTimeout);
            closeTimeout = null;
        }
        if (immediate) {
            Object.values(dropdowns).forEach(drop => drop && drop.classList.remove('active'));
            activeDropdown = null;
            // Закрываем подменю (если есть)
            document.querySelectorAll('.submenu').forEach(sub => sub.classList.remove('active'));
        } else {
            closeTimeout = setTimeout(() => {
                Object.values(dropdowns).forEach(drop => drop && drop.classList.remove('active'));
                activeDropdown = null;
                document.querySelectorAll('.submenu').forEach(sub => sub.classList.remove('active'));
                closeTimeout = null;
            }, 1000);
        }
    }

    function cancelClose() {
        if (closeTimeout) {
            clearTimeout(closeTimeout);
            closeTimeout = null;
        }
    }

    function showDropdown(key) {
        cancelClose();
        const target = dropdowns[key];
        if (!target) return;
        if (activeDropdown === target) return;

        Object.values(dropdowns).forEach(drop => drop && drop !== target && drop.classList.remove('active'));

        target.classList.add('active');
        activeDropdown = target;
        
        // Сброс прокрутки для всех скроллящихся элементов внутри дропдауна
        const scrollContainers = target.querySelectorAll('.dropdown__list');
        scrollContainers.forEach(container => {
            container.scrollTop = 0;
        });
    }

    // События на пунктах меню
    menuItems.forEach(item => {
        const key = item.getAttribute('data-dropdown');
        if (!key || !dropdowns[key]) return;

        item.addEventListener('mouseenter', () => showDropdown(key));
        // mouseleave не нужен
    });

    // События на самих дропдаунах
    Object.values(dropdowns).forEach(drop => {
        if (!drop) return;
        drop.addEventListener('mouseenter', cancelClose);
        drop.addEventListener('mouseleave', () => closeAllDropdowns(false));
    });

    // Закрытие при клике вне навигации и дропдауна
    document.addEventListener('click', (e) => {
        const isInsideNav = e.target.closest('.navigation');
        const isInsideDropdown = e.target.closest('.dropdown'); // <- важно
        if (!isInsideNav && !isInsideDropdown) {
            closeAllDropdowns(true);
        }
    });

    // Если есть вложенные подменю с классами .has-submenu и .submenu
    const submenuTriggers = document.querySelectorAll('.has-submenu');
    submenuTriggers.forEach(trigger => {
        const submenu = trigger.querySelector('.submenu');
        if (!submenu) return;
        let submenuCloseTimer = null;
        function cancelSubmenuClose() {
            if (submenuCloseTimer) {
                clearTimeout(submenuCloseTimer);
                submenuCloseTimer = null;
            }
        }
        function closeSubmenu(delayed = true) {
            cancelSubmenuClose();
            if (delayed) {
                submenuCloseTimer = setTimeout(() => {
                    submenu.classList.remove('active');
                    submenuCloseTimer = null;
                }, 80);
            } else {
                submenu.classList.remove('active');
            }
        }
        trigger.addEventListener('mouseenter', () => {
            cancelSubmenuClose();
            const parentDropdown = trigger.closest('.dropdown');
            if (parentDropdown) {
                parentDropdown.querySelectorAll('.submenu').forEach(otherSub => {
                    if (otherSub !== submenu) otherSub.classList.remove('active');
                });
            }
            submenu.classList.add('active');
        });
        trigger.addEventListener('mouseleave', (event) => {
            const leaveX = event.clientX;
            const leaveY = event.clientY;
            cancelSubmenuClose();
            submenuCloseTimer = setTimeout(() => {
                const elemUnderCursor = document.elementFromPoint(leaveX, leaveY);
                if (elemUnderCursor && (trigger.contains(elemUnderCursor) || submenu.contains(elemUnderCursor))) {
                    return;
                }
                submenu.classList.remove('active');
                submenuCloseTimer = null;
            }, 50);
        });
        submenu.addEventListener('mouseenter', cancelSubmenuClose);
        submenu.addEventListener('mouseleave', (event) => {
            const leaveX = event.clientX;
            const leaveY = event.clientY;
            cancelSubmenuClose();
            submenuCloseTimer = setTimeout(() => {
                const elemUnderCursor = document.elementFromPoint(leaveX, leaveY);
                if (elemUnderCursor && (trigger.contains(elemUnderCursor) || submenu.contains(elemUnderCursor))) {
                    return;
                }
                submenu.classList.remove('active');
                submenuCloseTimer = null;
            }, 50);
        });
    });
    
})();

/*Анимация на главной странице*/
(function() {
    const introBlock = document.querySelector('.intro');
    const mainContent = document.querySelector('.main-content');

      // Длительность анимации указана в CSS: 7 секунд
      const animationDuration = 3000; // мс

    setTimeout(() => {
        // Показываем основной контент
        mainContent.style.opacity = '1';
        mainContent.style.visibility = 'visible';

        // Плавно скрываем блок анимации
        introBlock.style.opacity = '0';
        introBlock.style.visibility = 'hidden';

        // Полностью удаляем из DOM после завершения перехода
        setTimeout(() => {
        introBlock.style.display = 'none';
        }, 600);
    }, animationDuration);

    document.addEventListener('DOMContentLoaded', () => {
  const intro = document.querySelector('.intro');
  intro.addEventListener('animationend', () => {
    intro.style.display = 'none';
  });
});
    })();

    (function() {
  // Элементы окна поиска
  const searchIcon = document.querySelector('.secondary-menu__item:first-child .secondary-menu__link');
  const searchDropdown = document.getElementById('search-dropdown');
  const searchInput = document.querySelector('.search-dropdown__input');
  const searchBtn = document.querySelector('.search-dropdown__search-btn');
  const suggestionsContainer = document.querySelector('.search-dropdown__suggestions');
  const closeBtn = document.querySelector('.search-dropdown__close');
  const searchContainer = document.querySelector('.search-dropdown__container');

  if (!searchDropdown) return;

  // Собираем все ссылки на товары из всех дропдаунов
  function collectProducts() {
    const productLinks = document.querySelectorAll('.dropdown__link');
    const products = [];
    productLinks.forEach(link => {
      const textElement = link.querySelector('.dropdown__text');
      if (textElement) {
        products.push({
          text: textElement.textContent.trim(),
          href: link.getAttribute('href'),
          element: link
        });
      }
    });
    return products;
  }

  let products = collectProducts();

  // Фильтрация продуктов по запросу
  function filterProducts(query) {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return [];
    return products.filter(product => 
      product.text.toLowerCase().includes(lowerQuery)
    );
  }

  let currentSelectedIndex = -1;

  // Подсветка выбранной подсказки
  function highlightSuggestion(index) {
    const suggestions = document.querySelectorAll('.search-dropdown__suggestion');
    suggestions.forEach(s => s.classList.remove('selected'));
    if (index >= 0 && index < suggestions.length) {
      suggestions[index].classList.add('selected');
      suggestions[index].scrollIntoView({ block: 'nearest' });
      currentSelectedIndex = index;
    } else {
      currentSelectedIndex = -1;
    }
  }

  // Обновление списка подсказок
  function updateSuggestions(query) {
    const filtered = filterProducts(query);
    suggestionsContainer.innerHTML = '';
    if (filtered.length === 0) {
      if (query.trim()) {
        suggestionsContainer.innerHTML = '<div class="search-dropdown__suggestion" style="color: #86868b; cursor: default;">Ничего не найдено</div>';
      }
      currentSelectedIndex = -1;
      return;
    }
    filtered.forEach((product, idx) => {
      const suggestion = document.createElement('a');
      suggestion.className = 'search-dropdown__suggestion';
      suggestion.textContent = product.text;
      suggestion.href = product.href;
      suggestion.setAttribute('data-index', idx);
      suggestion.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = product.href;
        closeSearch();
      });
      suggestionsContainer.appendChild(suggestion);
    });
    currentSelectedIndex = -1;
  }

  // Закрыть окно
  function closeSearch() {
    searchDropdown.classList.remove('active');
    searchInput.value = '';
    suggestionsContainer.innerHTML = '';
    currentSelectedIndex = -1;
  }

  // Открыть окно с позиционированием под кнопкой
  function openSearch() {
    if (!searchIcon) return;
    const rect = searchIcon.getBoundingClientRect();
    if (searchContainer) {
      // Позиционируем окно: сверху на 8px ниже кнопки, справа на 0 (вровень с правым краем кнопки)
      searchContainer.style.top = (rect.bottom + 8) + 'px';
      searchContainer.style.right = (window.innerWidth - rect.right) + 'px';
    }
    searchDropdown.classList.add('active');
    searchInput.focus();
  }

  // Выполнить поиск: перейти по первому результату
  function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;
    const filtered = filterProducts(query);
    if (filtered.length > 0) {
      window.location.href = filtered[0].href;
      closeSearch();
    }
  }

  // Обработчики
  if (searchIcon) {
    searchIcon.addEventListener('click', (e) => {
      e.preventDefault();
      openSearch();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeSearch);
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      updateSuggestions(e.target.value);
    });

    searchInput.addEventListener('keydown', (e) => {
      const suggestions = document.querySelectorAll('.search-dropdown__suggestion');
      if (suggestions.length === 0) {
        if (e.key === 'Enter') {
          e.preventDefault();
          performSearch();
        }
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        let next = currentSelectedIndex + 1;
        if (next >= suggestions.length) next = 0;
        highlightSuggestion(next);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        let prev = currentSelectedIndex - 1;
        if (prev < 0) prev = suggestions.length - 1;
        highlightSuggestion(prev);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentSelectedIndex >= 0 && currentSelectedIndex < suggestions.length) {
          const selected = suggestions[currentSelectedIndex];
          if (selected.href) {
            window.location.href = selected.href;
            closeSearch();
          }
        } else {
          performSearch();
        }
      }
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      performSearch();
    });
  }

  // Закрытие по клику вне окна
  searchDropdown.addEventListener('click', (e) => {
    if (e.target === searchDropdown) {
      closeSearch();
    }
  });

  // Закрытие по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchDropdown.classList.contains('active')) {
      closeSearch();
    }
  });

  // Обновляем список продуктов после загрузки страницы
  window.addEventListener('load', () => {
    products = collectProducts();
  });
})();




(function() {
  // Элементы корзины
  const cartIcon = document.querySelector('.secondary-menu__item:nth-child(2) .secondary-menu__link');
  const cartDropdown = document.getElementById('cart-dropdown');
  const cartCloseBtn = document.querySelector('.cart-dropdown__close');
  const cartContainer = document.querySelector('.cart-dropdown__container');
  const cartCounter = document.querySelector('.cart-counter'); // элемент счётчика

  if (!cartDropdown) return;

  // Функция обновления счётчика
  function updateCartCounter(cart) {
    if (!cartCounter) return;
    const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    if (totalQuantity > 0) {
      cartCounter.textContent = totalQuantity;
      cartCounter.style.display = 'flex';
    } else {
      cartCounter.style.display = 'none';
    }
  }

  // Функция позиционирования окна корзины (под кнопкой)
  function positionCartDropdown() {
    if (!cartIcon || !cartContainer) return;
    const rect = cartIcon.getBoundingClientRect();
    cartContainer.style.top = (rect.bottom + 8) + 'px';
    cartContainer.style.right = (window.innerWidth - rect.right - 50) + 'px';
    const containerRect = cartContainer.getBoundingClientRect();
    if (containerRect.left < 10) {
      cartContainer.style.right = 'auto';
      cartContainer.style.left = '10px';
    }
  }

  // Открыть корзину
  function openCart() {
    cartDropdown.classList.add('active');
    positionCartDropdown();
    updateCartDisplay();
  }

  // Закрыть корзину
  function closeCart() {
    cartDropdown.classList.remove('active');
  }

  // Удалить один товар (полностью)
  function removeCartItem(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id != productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
  }

  // Очистить всю корзину
  function clearCart() {
    localStorage.setItem('cart', JSON.stringify([]));
    updateCartDisplay();
  }

  // Изменить количество товара
  function updateCartQuantity(productId, delta) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item.id == productId);
    if (index !== -1) {
      cart[index].quantity += delta;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartDisplay();
    }
  }

  // Обработчики для кнопок +/- (чтобы не навешивать повторно)
  function handleDecr(e) {
    e.stopPropagation();
    const id = parseInt(e.currentTarget.dataset.id);
    updateCartQuantity(id, -1);
  }
  function handleIncr(e) {
    e.stopPropagation();
    const id = parseInt(e.currentTarget.dataset.id);
    updateCartQuantity(id, 1);
  }
  function handleRemove(e) {
    e.stopPropagation();
    const id = parseInt(e.currentTarget.dataset.id);
    removeCartItem(id);
  }

  // Обновление отображения корзины (таблица, итог, кнопки)
  function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const emptyEl = document.querySelector('.cart-dropdown__empty');
    const contentEl = document.querySelector('.cart-dropdown__content');
    const listEl = document.querySelector('.cart-dropdown__list');
    const totalPriceEl = document.querySelector('.cart-dropdown__total-price');

    updateCartCounter(cart);

    if (!cart.length) {
      if (emptyEl) emptyEl.style.display = 'block';
      if (contentEl) contentEl.style.display = 'none';
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    if (contentEl) contentEl.style.display = 'block';
    if (!listEl) return;

    listEl.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
      const li = document.createElement('li');
      li.className = 'cart-dropdown__item';
      // Для веса/объёма используем значения из товара, если есть, иначе заглушку
      const weight = item.weight || '—';
      const volume = item.volume || '—';
      li.innerHTML = `
        <img class="cart-dropdown__item-image" src="${item.image || '/img/placeholder.png'}" alt="${item.name}">
        <div class="cart-dropdown__item-info">
          <div class="cart-dropdown__item-name">${item.name}</div>
          <div class="cart-dropdown__item-weight">Вес: ${weight} г · объем: ${volume} дм³</div>
          <button class="cart-dropdown__item-remove" data-id="${item.id}">Удалить позицию</button>
        </div>
        <div class="cart-dropdown__item-price">${item.price.toLocaleString()} ₽</div>
        <div class="cart-dropdown__item-quantity">
          <button class="cart-decr" data-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button class="cart-incr" data-id="${item.id}">+</button>
        </div>
        <div class="cart-dropdown__item-sum">${(item.price * item.quantity).toLocaleString()} ₽</div>
      `;
      listEl.appendChild(li);
      total += item.price * item.quantity;
    });

    if (totalPriceEl) totalPriceEl.textContent = total.toLocaleString() + ' ₽';

    // Навешиваем обработчики на кнопки
    document.querySelectorAll('.cart-decr').forEach(btn => {
      btn.removeEventListener('click', handleDecr);
      btn.addEventListener('click', handleDecr);
    });
    document.querySelectorAll('.cart-incr').forEach(btn => {
      btn.removeEventListener('click', handleIncr);
      btn.addEventListener('click', handleIncr);
    });
    document.querySelectorAll('.cart-dropdown__item-remove').forEach(btn => {
      btn.removeEventListener('click', handleRemove);
      btn.addEventListener('click', handleRemove);
    });
  }

  // Обработчики для кнопок "Очистить корзину" и "Оформить заказ"
  const clearBtn = document.querySelector('.cart-dropdown__clear');
  const checkoutBtn = document.querySelector('.cart-dropdown__checkout');
  if (clearBtn) clearBtn.addEventListener('click', clearCart);
  if (checkoutBtn) checkoutBtn.addEventListener('click', () => {
    alert('Оформление заказа будет реализовано позже.');
  });

  // Обработчики событий открытия/закрытия
  if (cartIcon) {
    cartIcon.addEventListener('click', (e) => {
      e.preventDefault();
      openCart();
    });
  }
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);

  cartDropdown.addEventListener('click', (e) => {
    if (e.target === cartDropdown) closeCart();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartDropdown.classList.contains('active')) closeCart();
  });
  window.addEventListener('resize', () => {
    if (cartDropdown.classList.contains('active')) positionCartDropdown();
  });

  // Инициализация тестовыми данными (можно удалить, если данные уже есть)
  if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([
      { id: 1, name: 'ECD100-D2-R', price: 5612, image: '/img/main-menu/item1/1.png', quantity: 1, weight: 220, volume: 0.3 },
      { id: 2, name: 'Товар 2', price: 2500, image: '/img/main-menu/item1/2.png', quantity: 1 }
    ]));
  }

  updateCartDisplay();
})();