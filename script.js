// --- Глобальные переменные ---
let finalPriceBasics = 250;
let isPromoApplied = false;

// --- 1. ОТКРЫТИЕ БЛОКА ОПЛАТЫ ВНУТРИ КАРТОЧКИ ---
function initCheckout(type) {
    // Прячем кнопку "Buy Now"
    document.getElementById('btn-buy-' + type).style.display = 'none';
    
    // Показываем скрытый блок оплаты с анимацией
    document.getElementById('checkout-' + type).style.display = 'block';
}

// --- 2. ЛОГИКА ПРОМОКОДА (Только для Digital Basics) ---
function applyPromo() {
    if (isPromoApplied) return;
    
    const codeInput = document.getElementById('promo-input-basics').value.trim().toUpperCase();
    const msgEl = document.getElementById('promo-msg-basics');
    const priceEl = document.getElementById('price-display-basics');
    
    if (codeInput === 'KONO230') {
        finalPriceBasics = 230;
        isPromoApplied = true;
        
        // Красивое зачеркивание старой цены
        priceEl.innerHTML = '<span style="text-decoration: line-through; color: #9aa4b2; font-size: 1.2rem;">€250</span> €230';
        priceEl.style.color = '#5eead4';
        
        msgEl.innerText = 'Success! 8% discount applied.';
        msgEl.style.color = '#5eead4';
        
        // Если галочка уже стоит, перерисовываем PayPal с новой ценой
        if (document.getElementById('agree-basics').checked) {
            renderPayPal('basics', finalPriceBasics, 'Digital Basics (Promo: KONO230)');
        }
    } else {
        msgEl.innerText = 'Invalid promo code.';
        msgEl.style.color = '#ef4444';
    }
}

// --- 3. ЛОГИКА ГАЛОЧКИ ---
function togglePayPal(type) {
    const isChecked = document.getElementById('agree-' + type).checked;
    const container = document.getElementById('paypal-container-' + type);
    
    if (isChecked) {
        container.style.display = 'block';
        
        // Определяем цену и название в зависимости от выбранного курса
        const price = (type === 'basics') ? finalPriceBasics : 300;
        let description = (type === 'basics') ? 'Digital Basics' : 'Full Stack Developer';
        
        // Добавляем пометку в чек PayPal, если был применен промокод
        if (type === 'basics' && isPromoApplied) {
            description += ' (Promo: KONO230)';
        }
        
        renderPayPal(type, price, description);
    } else {
        container.style.display = 'none';
        container.innerHTML = ''; // Очищаем кнопки PayPal, чтобы не было дублей
    }
}

// --- 4. РЕНДЕР КНОПОК PAYPAL ---
function renderPayPal(type, price, description) {
    const containerId = '#paypal-container-' + type;
    document.querySelector(containerId).innerHTML = ''; // Зачистка перед рендером
    
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
                    description: description,
                    amount: { value: price.toString() }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                // Успешная оплата -> Прямой редирект к скачиванию курса
                window.location.href = "https://kono-digital.com/access-digital-basics";
            });
        },
        onError: function (err) {
            console.error('PayPal Error:', err);
            alert("Payment Error. Please try again.");
        }
    }).render(containerId);
}
