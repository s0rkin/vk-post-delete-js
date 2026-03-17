(function() {
    'use strict';
    
    if (!confirm('Запустить удаление ВСЕХ записей?\n\nСкрипт будет работать в автоматическом режиме.\nНе закрывайте вкладку!')) return;
    
    let deletedCount = 0;
    let errorCount = 0;
    let noMoreButtons = false;
    
    console.log('🚀 Скрипт запущен. Ищем кнопки с data-testid="post_context_menu_toggle"...');
    
    // Функция задержки
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    // Функция для поиска всех кнопок меню
    function findAllMenuButtons() {
        // Ищем по точному data-testid, который ты прислал
        const buttons = document.querySelectorAll('button[data-testid="post_context_menu_toggle"]');
        console.log(`🔍 Найдено кнопок меню: ${buttons.length}`);
        return buttons;
    }
    
    // Функция для клика по кнопке удаления в открывшемся меню
    async function clickDeleteInMenu() {
        await sleep(300);
        
        // Ищем пункт "Удалить" (из предыдущего HTML)
        const deleteItem = document.querySelector('[data-testid="post_context_menu_item_delete"]');
        
        if (deleteItem) {
            deleteItem.click();
            console.log('✅ Нажали "Удалить"');
            
            await sleep(300);
            
            // Ищем кнопку подтверждения
            const confirmButton = document.querySelector('button.vkuiButton--mode-primary, .flat_button.primary');
            if (confirmButton && confirmButton.textContent.includes('Удалить')) {
                confirmButton.click();
                console.log('✅ Подтвердили удаление');
            }
            
            return true;
        } else {
            console.log('❌ Пункт "Удалить" не найден в меню');
            return false;
        }
    }
    
    // Основная функция
    async function deleteAllPosts() {
        while (!noMoreButtons) {
            // Находим все кнопки меню
            const menuButtons = findAllMenuButtons();
            
            if (menuButtons.length === 0) {
                console.log('🏁 Кнопки меню закончились. Прокручиваю страницу...');
                
                // Прокручиваем вниз для загрузки новых постов
                window.scrollBy(0, 1000);
                await sleep(3000);
                
                // Проверяем снова
                const newButtons = findAllMenuButtons();
                if (newButtons.length === 0) {
                    console.log('🏁 Новых постов нет. Завершаю работу.');
                    noMoreButtons = true;
                    break;
                }
                continue;
            }
            
            // Берем первую кнопку
            const button = menuButtons[0];
            
            try {
                // Прокручиваем к кнопке
                button.scrollIntoView({ behavior: 'smooth', block: 'center' });
                await sleep(500);
                
                // Кликаем по кнопке меню
                button.click();
                console.log('📌 Открыли меню');
                
                // Удаляем пост
                const deleted = await clickDeleteInMenu();
                
                if (deleted) {
                    deletedCount++;
                    console.log(`✨ Удалено: ${deletedCount}`);
                } else {
                    errorCount++;
                }
                
                // Закрываем возможные всплывающие окна
                document.body.click();
                
                // Пауза между удалениями
                await sleep(1500);
                
            } catch (error) {
                console.error('Ошибка:', error);
                errorCount++;
                await sleep(2000);
            }
        }
        
        // Финальный отчет
        console.log('══════════════════════════════');
        console.log(`✅ Удалено: ${deletedCount}`);
        console.log(`❌ Ошибок: ${errorCount}`);
        console.log('══════════════════════════════');
        
        alert(`🎉 Готово!\n\nУдалено: ${deletedCount}\nОшибок: ${errorCount}`);
    }
    
    // Запуск
    deleteAllPosts();
})();