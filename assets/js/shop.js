let plantsData = [];
let currentPage = 1;
const itemsPerPage = 9;

const plantList = document.getElementById("plantList");
const pagination = document.getElementById("pagination");
const familySelect = document.getElementById("familySelect");
const loader = document.getElementById("loader");

async function fetchPlants() {
    try {
        loader.style.display = "block";

        const response = await fetch("https://house-plants2.p.rapidapi.com/all-lite", {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": "5bda55fb28msh7505d5d7a16332fp1186d4jsn45f4eaba70db",
                "X-RapidAPI-Host": "house-plants2.p.rapidapi.com"
            }
        });

        

        const jsonData = await response.json();
        plantsData = jsonData;

        const families = Array.from(new Set(plantsData.map(p => p.Family).filter(f => f))).sort();
        families.forEach(family => {
            const option = document.createElement("option");
            option.value = family;
            option.textContent = family;
            familySelect.appendChild(option);
        });

        renderPlants(plantsData);
        renderPagination(plantsData);
    } catch (error) {
        console.error("Error fetching plants:", error);
    } finally {
        loader.style.display = "none";
    }
}

function renderPlants(data) {
    plantList.innerHTML = "";
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentPlants = data.slice(start, end);

    currentPlants.forEach((plant, index) => {
        const col = document.createElement("div");
        col.className = "col-md-4";

        const card = document.createElement("div");
        card.className = "card h-100";

        const img = document.createElement("img");
        img.src = plant.Img || "https://via.placeholder.com/300x200?text=No+Image";
        img.className = "card-img-top";
        img.alt = plant["Common name"]?.[0] || plant["Latin name"] || "Plant";

        const body = document.createElement("div");
        body.className = "card-body text-center";

        const title = document.createElement("h5");
        title.className = "card-title";
        title.textContent = plant["Common name"]?.[0] || plant["Latin name"];

        const viewButton = document.createElement("a");
        viewButton.textContent = "View Details";
        viewButton.className = "btn btn-outline-dark mt-2";
        viewButton.href = `plant-details.html?latinName=${encodeURIComponent(plant["Latin name"])}`;

        body.appendChild(title);
        body.appendChild(viewButton);
        card.appendChild(img);
        card.appendChild(body);
        col.appendChild(card);
        plantList.appendChild(col);
    });
}

function renderPagination(data) {
    pagination.innerHTML = "";
    const pageCount = Math.ceil(data.length / itemsPerPage);
    const maxVisible = 4; // كم صفحة بدنا نعرض بجانب الحالية

    // زر السابق
    const prevBtn = document.createElement("li");
    prevBtn.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
    prevBtn.innerHTML = `<button class="page-link">&laquo;</button>`;
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderPlants(data);
            renderPagination(data);
        }
    });
    pagination.appendChild(prevBtn);

    let start = Math.max(currentPage - Math.floor(maxVisible / 2), 1);
    let end = start + maxVisible - 1;
    if (end > pageCount) {
        end = pageCount;
        start = Math.max(end - maxVisible + 1, 1);
    }

    for (let i = start; i <= end; i++) {
        const li = document.createElement("li");
        li.className = `page-item ${i === currentPage ? "active" : ""}`;
        li.innerHTML = `<button class="page-link">${i}</button>`;
        li.addEventListener("click", () => {
            currentPage = i;
            renderPlants(data);
            renderPagination(data);
        });
        pagination.appendChild(li);
    }

    // زر التالي
    const nextBtn = document.createElement("li");
    nextBtn.className = `page-item ${currentPage === pageCount ? "disabled" : ""}`;
    nextBtn.innerHTML = `<button class="page-link">&raquo;</button>`;
    nextBtn.addEventListener("click", () => {
        if (currentPage < pageCount) {
            currentPage++;
            renderPlants(data);
            renderPagination(data);
        }
    });
    pagination.appendChild(nextBtn);
}

familySelect.addEventListener("change", () => {
    const selectedFamily = familySelect.value;
    currentPage = 1;
    if (selectedFamily) {
        const filtered = plantsData.filter(p => p.Family === selectedFamily);
        renderPlants(filtered);
        renderPagination(filtered);
    } else {
        renderPlants(plantsData);
        renderPagination(plantsData);
    }
});

fetchPlants();
