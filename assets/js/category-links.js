document.querySelectorAll('.category-box').forEach(box => {
    box.addEventListener('click', () => {
      const category = box.dataset.category;
      window.location.href = `shop.html?category=${category}`;
    });
  });
  