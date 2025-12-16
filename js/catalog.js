document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("catalogGrid");
    const searchInput = document.getElementById("searchInput");
    const filterButtons = document.querySelectorAll(".filters button");
    const priceRange = document.getElementById("priceRange");
    const priceValue = document.getElementById("priceValue");

    let flowers = [];
    let currentCategory = "all";
    let maxPrice = Number(priceRange.value);

    // ================== ЗАВАНТАЖЕННЯ КВІТІВ ==================
    fetch("/api/flowers")
        .then(res => res.json())
        .then(data => {
            flowers = data.flowers; // важливо: data.flowers
            applyFilters();
        })
        .catch(() => {
            if (grid) grid.innerHTML = "<p>Помилка завантаження каталогу</p>";
        });

    // ================== РЕНДЕР КАРТОЧОК ==================
    function render(list) {
        if (!grid) return;
        grid.innerHTML = ""; // очищаємо контейнер

        if (list.length === 0) {
            grid.innerHTML = "<p>Нічого не знайдено</p>";
            return;
        }

        list.forEach(flower => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <img src="${flower.image}" alt="${flower.name}">
                <h3>${flower.name}</h3>
                <p>${flower.description}</p>
                <span>${flower.price} грн</span>
            `;

            // Перехід на окрему сторінку продукту
            card.addEventListener("click", () => {
                sessionStorage.setItem('catalogState', JSON.stringify({
                    category: currentCategory,
                    search: searchInput.value,
                    maxPrice: maxPrice
                }));
                window.location.href = `/product/${flower.id}`;
            });

            grid.appendChild(card);
        });
    }

    // ================== ФІЛЬТРИ ==================
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentCategory = btn.dataset.filter;
            applyFilters();
        });
    });

    // ================== ПОШУК ==================
    if (searchInput) {
        searchInput.addEventListener("input", applyFilters);
    }

    // ================== ФІЛЬТРАЦІЯ ЗА ЦІНОЮ ==================
    if (priceRange && priceValue) {
        priceRange.addEventListener("input", () => {
            maxPrice = Number(priceRange.value);
            priceValue.textContent = maxPrice;
            applyFilters();
        });
    }

    // ================== ПРИМІНЕННЯ ФІЛЬТРІВ ==================
    function applyFilters() {
        if (!flowers) return;

        const query = searchInput.value.toLowerCase();

        const filtered = flowers.filter(flower => {
            const matchCategory = currentCategory === "all" || flower.category === currentCategory;
            const matchSearch = flower.name.toLowerCase().includes(query) || flower.description.toLowerCase().includes(query);
            const matchPrice = flower.price <= maxPrice;
            return matchCategory && matchSearch && matchPrice;
        });

        render(filtered);
    }
});
