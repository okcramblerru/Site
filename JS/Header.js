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
    })();