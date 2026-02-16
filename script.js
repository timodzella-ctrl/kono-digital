// Переменные для хранения данных
let currentCourse = {
    title: "",
    price: 0
};

// Получаем элементы со страницы
const modal = document.getElementById("paymentModal");
const courseTitleEl = document.getElementById("courseTitle");
const coursePriceEl = document.getElementById("coursePrice");
const agreeCheckbox = document.getElementById("agreeTerms");
const paypalContainer = document.getElementById("paypal-button-container");
const closeModalBtn = document.getElementById("closeModalBtn"); // Убедись, что в HTML у крестика есть id="closeModalBtn"

// --- 1. ОТКРЫТИЕ ОКНА ---
function selectCourse(title, price) {
    currentCourse.title = title;
    currentCourse.price = price;

    // Обновляем текст в модалке
    courseTitleEl.innerText = title;
    coursePriceEl.innerText = `Price: €${price}`;
    
    // Сбрасываем чекбокс и скрываем PayPal при каждом открытии
    agreeCheckbox.checked = false;
    paypalContainer.style.display = "none"; 
    paypalContainer.innerHTML = ""; // Очищаем старые кнопки
    
    // Показываем окно
    modal.style.display = "block";
}

// --- 2. ЗАКРЫТИЕ ОКНА ---
function closeModal() {
    modal.style.display = "none";
    paypalContainer.innerHTML = ""; // Очищаем кнопки при закрытии
}

// Закрытие по клику на крестик
if (closeModalBtn) {
    closeModalBtn.onclick = closeModal;
}

// Закрытие по клику вне окна
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

// --- 3. ЛОГИКА ГАЛОЧКИ (ГЛАВНОЕ ИСПРАВЛЕНИЕ) ---
agreeCheckbox.addEventListener('change', function() {
    if (this.checked) {
        // Если галочка стоит — показываем блок и рисуем кнопки
        paypalContainer.style.display = "block";
        renderPayPalButtons();
    } else {
        // Если галочку убрали — прячем всё
        paypalContainer.style.display = "none";
        paypalContainer.innerHTML = "";
    }
});

// --- 4. ФУНКЦИЯ ОТРИСОВКИ PAYPAL ---
function renderPayPalButtons() {
    // Защита от дублирования: очищаем контейнер перед отрисовкой
    paypalContainer.innerHTML = "";

    paypal.Buttons({
        style: {
            layout: 'vertical',
            color:  'blue',
            shape:  'rect',
            label:  'pay'
        },

        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    description: currentCourse.title,
                    amount: {
                        value: currentCourse.price
                    }
                }]
            });
        },

        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                console.log('Payment successful:', details);
                alert(`Спасибо, ${details.payer.name.given_name}! Оплата прошла успешно.`);
                closeModal();
            });
        },

        onError: function (err) {
            console.error('PayPal Error:', err);
            alert("Ошибка PayPal. Проверьте консоль.");
        }
    }).render('#paypal-button-container');
}

// --- 5. ФУНКЦИИ ДЛЯ ЮРИДИЧЕСКИХ ОКОН ---
function openTerms() { document.getElementById("termsModal").style.display = "block"; }
function closeTerms() { document.getElementById("termsModal").style.display = "none"; }
function openPrivacy() { document.getElementById("privacyModal").style.display = "block"; }
function closePrivacy() { document.getElementById("privacyModal").style.display = "none"; }

// Закрытие доп. окон по клику вне их области
window.addEventListener('click', function(e) {
    if (e.target == document.getElementById("termsModal")) closeTerms();
    if (e.target == document.getElementById("privacyModal")) closePrivacy();
});
