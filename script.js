// --- STATE VARIABLES ---
let currentCourse = {
    title: "",
    basePrice: 0,
    finalPrice: 0,
    isPromoApplied: false
};

// --- DOM ELEMENTS ---
const modal = document.getElementById("paymentModal");
const courseTitleEl = document.getElementById("courseTitle");
const coursePriceEl = document.getElementById("coursePrice");
const agreeCheckbox = document.getElementById("agreeTerms");
const paypalContainer = document.getElementById("paypal-button-container");
const closeModalBtn = document.getElementById("closeModalBtn");

// Promo DOM Elements
const promoContainer = document.getElementById("promoContainer");
const promoCodeInput = document.getElementById("promoCodeInput");
const promoMessage = document.getElementById("promoMessage");

// --- 1. MODAL LOGIC (OPEN) ---
function selectCourse(title, price) {
    currentCourse.title = title;
    currentCourse.basePrice = price;
    currentCourse.finalPrice = price; // По умолчанию финальная цена равна базовой
    currentCourse.isPromoApplied = false;

    // Обновляем текст в модалке
    courseTitleEl.innerText = title;
    coursePriceEl.innerText = `Price: €${price}`;
    coursePriceEl.style.color = "white"; // Сброс цвета
    
    // Сбрасываем промо-блок
    if (promoCodeInput) promoCodeInput.value = "";
    if (promoMessage) promoMessage.innerText = "";
    
    // Показываем поле ввода промокода ТОЛЬКО для Digital Basics
    if (promoContainer) {
        promoContainer.style.display = (title === 'Digital Basics') ? "block" : "none";
    }

    // Сбрасываем чекбокс и прячем кнопки PayPal
    agreeCheckbox.checked = false;
    paypalContainer.style.display = "none"; 
    paypalContainer.innerHTML = ""; 
    
    // Показываем модалку
    modal.style.display = "block";
}

// --- 2. MODAL LOGIC (CLOSE) ---
function closeModal() {
    modal.style.display = "none";
    paypalContainer.innerHTML = ""; // Очищаем, чтобы не плодить дубликаты кнопок
}

// Закрытие по крестику
if (closeModalBtn) {
    closeModalBtn.onclick = closeModal;
}

// Закрытие при клике мимо модалки (оставил твою логику, но добавил проверку на другие модалки)
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
}

// --- 3. PROMO CODE LOGIC ---
function applyPromo() {
    if (currentCourse.isPromoApplied) {
        promoMessage.innerText = "Promo code already applied!";
        promoMessage.style.color = "#fbbf24"; // Желтый
        return;
    }

    const code = promoCodeInput.value.trim().toUpperCase();
    
    if (code === "KONO230" && currentCourse.title === 'Digital Basics') {
        currentCourse.finalPrice = 230; // Применяем скидку
        currentCourse.isPromoApplied = true;
        
        // Визуальное подтверждение
        coursePriceEl.innerText = "Price: €230 (Discount Applied)";
        coursePriceEl.style.color = "#5eead4"; 
        
        promoMessage.innerText = "Success! 8% discount applied.";
        promoMessage.style.color = "#5eead4";
        
        // Если чекбокс уже нажат, перерисовываем кнопки с новой ценой
        if (agreeCheckbox.checked) {
            renderPayPalButtons();
        }
    } else {
        promoMessage.innerText = "Invalid promo code.";
        promoMessage.style.color = "#ef4444"; // Красный
    }
}

// --- 4. CHECKBOX LOGIC (REQUIRED) ---
agreeCheckbox.addEventListener('change', function() {
    if (this.checked) {
        // Юзер согласен -> Показываем кнопки
        paypalContainer.style.display = "block";
        renderPayPalButtons();
    } else {
        // Юзер убрал галочку -> Прячем кнопки
        paypalContainer.style.display = "none";
        paypalContainer.innerHTML = "";
    }
});

// --- 5. PAYPAL INTEGRATION ---
function renderPayPalButtons() {
    paypalContainer.innerHTML = ""; // Очищаем контейнер

    paypal.Buttons({
        style: {
            layout: 'vertical',
            color:  'blue', 
            shape:  'rect',
            label:  'pay'
        },

        createOrder: function(data, actions) {
            // Добавляем пометку о промокоде в чек PayPal для твоей защиты
            let description = currentCourse.title;
            if (currentCourse.isPromoApplied) {
                description += " (Promo: KONO230)";
            }

            return actions.order.create({
                purchase_units: [{
                    description: description,
                    amount: {
                        value: currentCourse.finalPrice.toString() // Берем цену со скидкой
                    }
                }]
            });
        },

        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                // ГЛАВНОЕ ИСПРАВЛЕНИЕ: Автоматический редирект на курс вместо простого "Спасибо"
                window.location.href = "https://kono-digital.com/access-digital-basics";
            });
        },

        onError: function (err) {
            console.error('PayPal Error:', err);
            alert("Payment Error. Please try again.");
        }
    }).render('#paypal-button-container');
}
