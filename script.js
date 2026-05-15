// config.js - замените на свои данные
const TELEGRAM_BOT_TOKEN = '8531904307:AAGwQ-dsKn8B32fSgPx8YoHrSXKM_COEvw0'; // Токен вашего бота от @BotFather
const TELEGRAM_CHAT_ID = '468095537'; // Ваш ID чата (можно получить через @userinfobot)

// Функция отправки данных в Telegram
async function sendToTelegram(data) {
    // Формируем красивое сообщение
    let message = `🎉 НОВОЕ ПОДТВЕРЖДЕНИЕ ГОСТЯ\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `👤 ФИО: ${data.fullName}\n`;
    message += `📞 Телефон: ${data.phone}\n`;
    message += `✅ Присутствие: ${data.presence}\n`;
    message += `🍽 Блюдо: ${data.mainDish}\n`;
    message += `🚗 Трансфер: ${data.transfer}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📅 ${new Date().toLocaleString('ru-RU')}`;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        const result = await response.json();
        
        if (result.ok) {
            alert('✅ Спасибо! Ваша заявка успешно отправлена.');
            // Опционально: очистить форму после успешной отправки
            // resetForm();
            return true;
        } else {
            console.error('Ошибка Telegram API:', result);
            throw new Error(result.description || 'Ошибка отправки');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('❌ Произошла ошибка при отправке. Пожалуйста, попробуйте позже.\n\n' + error.message);
        return false;
    }
}

// Функция валидации формы
function validateForm(formData) {
    if (!formData.fullName.trim()) {
        alert('❌ Пожалуйста, введите ФИО гостя');
        return false;
    }
    
    if (!formData.phone.trim()) {
        alert('❌ Пожалуйста, введите номер телефона');
        return false;
    }
    
    // Валидация телефона (минимум 10 цифр)
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
        alert('❌ Пожалуйста, введите корректный номер телефона (минимум 10 цифр)');
        return false;
    }
    
    if (!formData.mainDish) {
        alert('❌ Пожалуйста, выберите основное блюдо');
        return false;
    }
    
    if (!formData.transfer) {
        alert('❌ Пожалуйста, укажите, нужен ли трансфер');
        return false;
    }
    
    return true;
}

// Функция сбора данных из формы (РАБОТАЕТ С VALUE)
function collectFormData() {
    // Получаем ФИО
    const fullNameInput = document.querySelector('.fi[type="text"]');
    const fullName = fullNameInput ? fullNameInput.value : '';
    
    // Получаем телефон
    const phoneInput = document.querySelector('.fi[type="tel"]');
    const phone = phoneInput ? phoneInput.value : '';
    
    // Получаем присутствие (значение из select)
    const presenceSelect = document.querySelector('.presence');
    const presence = presenceSelect ? presenceSelect.value : '';
    
    // Получаем выбранное блюдо (используем value)
    let mainDish = '';
    const selectedDish = document.querySelector('input[name="choice"]:checked');
    if (selectedDish) {
        mainDish = selectedDish.value === 'птица' ? 'Птица' : 
                    selectedDish.value === 'мясо' ? 'Мясо' : 
                    selectedDish.value === 'рыба' ? 'Рыба' : selectedDish.value;
    }
    
    // Получаем выбор трансфера (используем value)
    let transfer = '';
    const selectedTransfer = document.querySelector('input[name="transf"]:checked');
    if (selectedTransfer) {
        transfer = selectedTransfer.value === 'да' ? 'Да' : 
                   selectedTransfer.value === 'нет' ? 'Нет' : selectedTransfer.value;
    }
    
    // Логируем для отладки
    console.log('Собранные данные:', { fullName, phone, presence, mainDish, transfer });
    
    return {
        fullName,
        phone,
        presence,
        mainDish,
        transfer
    };
}

// Обработчик отправки формы
async function handleSubmit(event) {
    event.preventDefault();
    
    // Блокируем кнопку на время отправки
    const submitBtn = document.querySelector('.ok');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';
    
    try {
        const formData = collectFormData();
        
        if (validateForm(formData)) {
            await sendToTelegram(formData);
        }
    } catch (error) {
        console.error('Ошибка при отправке:', error);
        alert('❌ Произошла ошибка. Пожалуйста, попробуйте еще раз.');
    } finally {
        // Разблокируем кнопку
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Опциональная функция очистки формы
function resetForm() {
    // Очищаем текстовые поля
    const fullNameInput = document.querySelector('.fi[type="text"]');
    const phoneInput = document.querySelector('.fi[type="tel"]');
    if (fullNameInput) fullNameInput.value = '';
    if (phoneInput) phoneInput.value = '';
    
    // Сбрасываем select на первый вариант
    const presenceSelect = document.querySelector('.presence');
    if (presenceSelect) presenceSelect.selectedIndex = 0;
    
    // Снимаем выделение со всех radio
    const allRadios = document.querySelectorAll('input[type="radio"]');
    allRadios.forEach(radio => {
        radio.checked = false;
    });
    
    console.log('Форма очищена');
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.querySelector('.ok');
    if (submitButton) {
        submitButton.addEventListener('click', handleSubmit);
    }
    
    console.log('✅ Анкета загружена и готова к работе');
    console.log('💡 Для тестирования Telegram бота введите в консоли: testTelegramConnection()');
});

window.resetForm = resetForm;
window.collectFormData = collectFormData;

console.log('🎉 Скрипт анкеты загружен!');
console.log('📝 Для проверки работоспособности используйте:');
console.log('   - testTelegramConnection() - проверить связь с Telegram');
console.log('   - collectFormData() - посмотреть текущие данные формы');
console.log('   - resetForm() - очистить форму');