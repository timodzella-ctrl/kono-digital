// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const href=a.getAttribute('href');
    if(href.length>1){
      e.preventDefault();
      document.querySelector(href).scrollIntoView({behavior:'smooth',block:'start'});
    }
  });
});

let selectedCourse = null;
let selectedPrice = null;

function selectCourse(courseName, price) {
  selectedCourse = courseName;
  selectedPrice = price;
  document.getElementById('courseTitle').textContent = courseName;
  document.getElementById('coursePrice').textContent = `Price: €${price}`;
  document.getElementById('agreeTerms').checked = false;
  updatePayPalButton();
  document.getElementById('paymentModal').classList.add('show');
}

function closeModal() {
  document.getElementById('paymentModal').classList.remove('show');
}

function openTerms() {
  document.getElementById('termsModal').classList.add('show');
}

function closeTerms() {
  document.getElementById('termsModal').classList.remove('show');
}

function openPrivacy() {
  document.getElementById('privacyModal').classList.add('show');
}

function closePrivacy() {
  document.getElementById('privacyModal').classList.remove('show');
}

document.getElementById('agreeTerms').addEventListener('change', updatePayPalButton);

function updatePayPalButton() {
  const isChecked = document.getElementById('agreeTerms').checked;
  document.getElementById('paypalBtn').disabled = !isChecked;
}

function proceedToPayPal() {
  if (!selectedCourse || !selectedPrice) return;
  
  // PayPal Business account integration
  // Replace with your actual PayPal Business ID and credentials
  const paypalEmail = 'your-paypal-business@email.com'; // Замените на ваш PayPal Business email
  const amount = selectedPrice;
  const itemName = selectedCourse;
  
  // Redirect to PayPal checkout
  const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${paypalEmail}&item_name=${encodeURIComponent(itemName)}&amount=${amount}&currency_code=EUR&return=https://timodzella-ctrl.github.io/kono-digital/&cancel_return=https://timodzella-ctrl.github.io/kono-digital/`;
  
  window.location.href = paypalUrl;
}

// Close modal when clicking outside
window.onclick = function(event) {
  let modal = document.getElementById('paymentModal');
  if (event.target == modal) modal.classList.remove('show');
  
  modal = document.getElementById('termsModal');
  if (event.target == modal) modal.classList.remove('show');
  
  modal = document.getElementById('privacyModal');
  if (event.target == modal) modal.classList.remove('show');
}
