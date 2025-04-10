document.addEventListener("DOMContentLoaded", async () => {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const container = document.getElementById("wishlist-container");

  try {
    const response = await fetch("https://house-plants2.p.rapidapi.com/all-lite", {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "5bda55fb28msh7505d5d7a16332fp1186d4jsn45f4eaba70db",
        "X-RapidAPI-Host": "house-plants2.p.rapidapi.com"
      }
    });

    const allPlants = await response.json();

    // نطابق wishlist مع البيانات الأصلية حسب الاسم اللاتيني
    const fullWishlistData = wishlist
      .map(wish => allPlants.find(p => p["Latin name"] === wish["Latin name"]))
      .filter(Boolean); // نستبعد العناصر اللي ما إلها تطابق

    renderWishlist(fullWishlistData);

  } catch (error) {
    console.error("Error fetching plant data:", error);
    container.innerHTML = '<p class="text-danger">Failed to load wishlist.</p>';
  }

  function renderWishlist(data) {
    container.innerHTML = "";

    if (data.length === 0) {
      container.innerHTML = '<p class="text-muted">Your wishlist is empty.</p>';
      return;
    }

    data.forEach((plant, index) => {
      const card = document.createElement("div");
      card.className = "d-flex justify-content-between align-items-center border p-3 mb-3";

      const name = plant["Common name"]?.[0] || plant["Latin name"];
      const family = plant.Family || "Unknown";
      const image = plant.Img || "assets/img/placeholder.png";

      card.innerHTML = `
        <div class="d-flex align-items-center">
          <button class="btn btn-sm btn-link text-muted me-3 remove-item" data-index="${index}"><i class="bi bi-x"></i></button>
          <a href="plant-details.html?latinName=${encodeURIComponent(plant["Latin name"])}" class="d-flex align-items-center text-decoration-none text-dark">
            <img src="${image}" alt="${name}" width="60" class="me-3">
            <div>
              <strong>${name}</strong><br>
              <span class="text-muted">${family}</span><br>
              <small>${new Date().toLocaleDateString()}</small>
            </div>
          </a>
        </div>
        <button class="btn btn-pink">Select options</button>
      `;

      container.appendChild(card);
    });

   
    

    document.querySelectorAll(".remove-item").forEach(button => {
      button.addEventListener("click", function () {
        const index = this.getAttribute("data-index");
        wishlist.splice(index, 1);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        location.reload(); // نعمل reload عشان يعيد بناء القائمة من الـ API
      });
    });
  }
});
