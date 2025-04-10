document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const latinName = params.get("latinName");

  if (!latinName) {
    document.getElementById("plantDetails").innerHTML = "<p>No plant name provided.</p>";
    return;
  }

  try {
    const response = await fetch("https://house-plants2.p.rapidapi.com/all-lite", {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "5bda55fb28msh7505d5d7a16332fp1186d4jsn45f4eaba70db",
        "X-RapidAPI-Host": "house-plants2.p.rapidapi.com"
      }
    });

    const result = await response.json();
    const plant = result.find(p => p["Latin name"] === latinName);

    if (!plant) {
      document.getElementById("plantDetails").innerHTML = "<p>No plant data available.</p>";
      return;
    }

    showPlantDetails(plant);
  } catch (error) {
    console.error("Error fetching plant details:", error);
  }
});

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

function saveWishlist() {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function updateWishlistModal() {
  const wishlistItems = document.getElementById("wishlist-items");
  const wishlistCount = document.getElementById("wishlist-count");

  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  wishlistItems.innerHTML = "";

  wishlist.forEach(plant => {
    wishlistItems.innerHTML += `
      <div class="d-flex justify-content-between align-items-center border-bottom py-2">
        <div class="d-flex align-items-center">
          <img src="${plant.Img || 'assets/img/placeholder.png'}" alt="${plant["Common name"]?.[0] || 'Plant'}" width="60" class="me-3">
          <div>
            <strong>${plant["Common name"]?.[0] || plant["Latin name"]}</strong><br>
            <small class="text-muted">${plant.Family || 'Unknown'}</small><br>
            <small>${new Date().toLocaleDateString()}</small>
          </div>
        </div>
        <a href="plant-details.html?latinName=${encodeURIComponent(plant["Latin name"])}" class="btn btn-outline-dark btn-sm">View</a>
      </div>
    `;
  });

  wishlistCount.textContent = wishlist.length;
}

function showPlantDetails(plant) {
  const container = document.getElementById("plantDetails");
  const price = Math.floor(Math.random() * 50) + 10;

  container.innerHTML = `
    <div class="row align-items-center">
       <div class="col-md-6 text-center">
        <img id="main-image" src="${plant.Img || 'assets/img/placeholder.png'}" class="img-fluid rounded shadow" style="width: 100%; height: auto; max-height: 600px; object-fit: cover;" alt="${plant["Common name"]?.[0] || 'Plant'}">
      </div>
      <div class="col-md-6">
        <h2 class="fw-bold">${plant["Common name"]?.[0] || plant["Latin name"] || 'No name'}</h2>
        <h4 class="text-danger">$${price}</h4>
        <p><strong>Latin Name:</strong> ${plant["Latin name"] || 'N/A'}</p>
        <p><strong>Climate:</strong> ${plant.Climat || 'N/A'}</p>
        <p><strong>Family:</strong> ${plant.Family || 'N/A'}</p>
        <p><strong>Category:</strong> ${plant.Categories || 'N/A'}</p>
        <p><strong>Origin:</strong> ${plant.Origin?.join(", ") || 'N/A'}</p>
        <p><strong>Zone:</strong> ${plant.Zone?.join(", ") || 'N/A'}</p>

        <div class="d-flex align-items-center mb-4">
          <button class="btn btn-outline-secondary" id="minus-btn">-</button>
          <input type="text" id="quantity" class="form-control mx-2 text-center" value="1" style="width: 60px;" />
          <button class="btn btn-outline-secondary" id="plus-btn">+</button>
        </div>

        <div class="d-flex gap-2">
          <button class="btn btn-dark w-50">ADD TO CART</button>
          <button class="btn btn-outline-secondary wishlist-btn" id="add-to-wishlist">
            <i class="bi bi-heart"></i>
          </button>
        </div>

        <button class="btn btn-primary w-100 mt-3" style="background-color: #ff2c84; border: none;">BUY NOW</button>
      </div>
    </div>
  `;

  document.getElementById("add-to-wishlist").addEventListener("click", () => {
    if (!wishlist.find(item => item["Latin name"] === plant["Latin name"])) {
      wishlist.push(plant);
      saveWishlist();
      updateWishlistModal();
      const modalElement = document.getElementById("wishlistModal");
      const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
      modal.show();
    }
  });

  const minusBtn = document.getElementById("minus-btn");
  const plusBtn = document.getElementById("plus-btn");
  const quantityInput = document.getElementById("quantity");

  minusBtn.addEventListener("click", () => {
    let value = parseInt(quantityInput.value);
    if (value > 1) quantityInput.value = value - 1;
  });

  plusBtn.addEventListener("click", () => {
    let value = parseInt(quantityInput.value);
    quantityInput.value = value + 1;
  });
}
