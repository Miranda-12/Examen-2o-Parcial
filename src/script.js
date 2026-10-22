document.addEventListener('DOMContentLoaded', () => {
  // Simple interaction script for POS

  // People counter
  const peopleCounter = document.querySelector('.people-counter');
  if (peopleCounter) {
    const minusBtn = peopleCounter.querySelectorAll('.counter-btn')[0];
    const plusBtn = peopleCounter.querySelectorAll('.counter-btn')[1];
    const countSpan = peopleCounter.querySelector('.count');
    
    let peopleCount = 3;
    
    minusBtn.addEventListener('click', () => {
      if (peopleCount > 1) {
        peopleCount--;
        countSpan.innerHTML = `<span class="icon">👥</span> ${peopleCount}`;
      }
    });
    
    plusBtn.addEventListener('click', () => {
      peopleCount++;
      countSpan.innerHTML = `<span class="icon">👥</span> ${peopleCount}`;
    });
  }

  // Quantity controls in options list
  const qtyControls = document.querySelectorAll('.quantity-control');
  qtyControls.forEach(control => {
    const minusBtn = control.querySelectorAll('.qty-btn')[0];
    const plusBtn = control.querySelectorAll('.qty-btn')[1];
    const qtySpan = control.querySelector('.qty-value');
    
    minusBtn.addEventListener('click', () => {
      let val = parseInt(qtySpan.textContent);
      if (val > 0) {
        val--;
        qtySpan.textContent = val;
        if (val === 0) {
          qtySpan.classList.remove('active');
        }
      }
    });
    
    plusBtn.addEventListener('click', () => {
      let val = parseInt(qtySpan.textContent);
      val++;
      qtySpan.textContent = val;
      qtySpan.classList.add('active');
    });
  });

  // Category selection
  const categoryBtns = document.querySelectorAll('.category-btn');
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Bottom Nav selection
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
});