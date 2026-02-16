// Данные текущего выбора
let currentCourse = {
    title: "",
    price: 0
};

// Элементы DOM
const modal = document.getElementById("paymentModal");
const courseTitleEl = document.getElementById("courseTitle");
const coursePriceEl = document.getElementById("coursePrice");
const agreeCheckbox = document.getElementById("agreeTerms");
const paypalContainer = document.getElementById("paypal-button-container");
const closeModalBtn = document.getElementById("closeModalBtn");

// --- 1. Управление окном оплаты ---

function selectCourse(title, price) {
    currentCourse.title = title;
    currentCourse.price = price;

    courseTitleEl.innerText = title;
    coursePriceEl.innerText = `Price: €${price}`;
    
    // Сброс при новом открытии
    agreeCheckbox.checked = false;
    paypalContainer.style.display = "none"; 
    paypalContainer.innerHTML = ""; // Очистка старых кнопок
    
    modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
    paypalContainer.innerHTML = ""; 
}

closeModalBtn.onclick = closeModal;
window.onclick = function(event) {
    if (event.target == modal) closeModal();
}

// --- 2. Логика Галочки (Согласие) ---

agreeCheckbox.addEventListener('change', function() {
    if (this.checked) {
        paypalContainer.style.display = "block";
        renderPayPalButtons();
    } else {
        paypalContainer.style.display = "none";
        paypalContainer.innerHTML = "";
    }
});

// --- 3. Логика PayPal ---

function renderPayPalButtons() {
    paypalContainer.innerHTML = ""; // Защита от дублей

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
                // ДЕЙСТВИЕ ПОСЛЕ УСПЕШНОЙ ОПЛАТЫ
                alert(`Спасибо, ${details.payer.name.given_name}! Оплата прошла успешно. Проверьте почту.`);
                closeModal();
            });
        },

        onError: function (err) {
            console.error('PayPal Error:', err);
            alert("Ошибка соединения с PayPal. Попробуйте позже.");
        }
    }).render('#paypal-button-container');
}

// --- 4. Управление окнами Terms и Privacy ---
function openTerms() { document.getElementById("termsModal").style.display = "block"; }
function closeTerms() { document.getElementById("termsModal").style.display = "none"; }
function openPrivacy() { document.getElementById("privacyModal").style.display = "block"; }
function closePrivacy() { document.getElementById("privacyModal").style.display = "none"; }

// Закрытие доп. окон по клику вне (для удобства)
window.addEventListener('click', function(e) {
    if (e.target == document.getElementById("termsModal")) closeTerms();
    if (e.target == document.getElementById("privacyModal")) closePrivacy();
});
