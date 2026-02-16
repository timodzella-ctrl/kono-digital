// State variables to hold selected course data
let currentCourse = {
    title: "",
    price: 0
};

// DOM Elements
const modal = document.getElementById("paymentModal");
const courseTitleEl = document.getElementById("courseTitle");
const coursePriceEl = document.getElementById("coursePrice");
const agreeCheckbox = document.getElementById("agreeTerms");
const paypalContainer = document.getElementById("paypal-button-container");
const closeModalBtn = document.getElementById("closeModalBtn");

// --- 1. MODAL LOGIC (OPEN) ---
function selectCourse(title, price) {
    currentCourse.title = title;
    currentCourse.price = price;

    // Update Modal Text
    courseTitleEl.innerText = title;
    coursePriceEl.innerText = `Price: €${price}`;
    
    // Reset Checkbox and hide PayPal buttons on every open
    agreeCheckbox.checked = false;
    paypalContainer.style.display = "none"; 
    paypalContainer.innerHTML = ""; // Clear any existing buttons
    
    // Show Modal
    modal.style.display = "block";
}

// --- 2. MODAL LOGIC (CLOSE) ---
function closeModal() {
    modal.style.display = "none";
    paypalContainer.innerHTML = ""; // Clean up to prevent duplicates
}

// Close on 'X' click
if (closeModalBtn) {
    closeModalBtn.onclick = closeModal;
}

// Close on click outside modal
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

// --- 3. CHECKBOX LOGIC (REQUIRED) ---
agreeCheckbox.addEventListener('change', function() {
    if (this.checked) {
        // User agreed -> Show PayPal buttons
        paypalContainer.style.display = "block";
        renderPayPalButtons();
    } else {
        // User unchecked -> Hide buttons
        paypalContainer.style.display = "none";
        paypalContainer.innerHTML = "";
    }
});

// --- 4. PAYPAL INTEGRATION ---
function renderPayPalButtons() {
    // Safety check: clear container
    paypalContainer.innerHTML = "";

    paypal.Buttons({
        style: {
            layout: 'vertical',
            color:  'blue', // Options: gold, blue, silver, black
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
                // SUCCESS ACTION
                alert(`Thank you, ${details.payer.name.given_name}! Payment successful.`);
                closeModal();
            });
        },

        onError: function (err) {
            console.error('PayPal Error:', err);
            alert("Payment Error. Please try again.");
        }
    }).render('#paypal-button-container');
}

// --- 5. LEGAL MODALS LOGIC ---
function openTerms() { document.getElementById("termsModal").style.display = "block"; }
function closeTerms() { document.getElementById("termsModal").style.display = "none"; }
function openPrivacy() { document.getElementById("privacyModal").style.display = "block"; }
function closePrivacy() { document.getElementById("privacyModal").style.display = "none"; }

// Close legal modals when clicking outside
window.addEventListener('click', function(e) {
    if (e.target == document.getElementById("termsModal")) closeTerms();
    if (e.target == document.getElementById("privacyModal")) closePrivacy();
});
