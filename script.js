// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const href=a.getAttribute('href');
    if(href.length>1){
      e.preventDefault();
      document.querySelector(href).scrollIntoView({behavior:'smooth',block:'start'});
    }
  });
});

// Simple contact form handler (no backend) — shows a success message
const form=document.getElementById('contactForm');
if(form){
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const msg=document.getElementById('formMessage');
    msg.textContent='Thank you! We received your message and will get back to you soon.';
    form.reset();
  });
}
