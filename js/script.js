document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("catalogGrid");
    const searchInput = document.getElementById("searchInput");
    const filterButtons = document.querySelectorAll(".filters button");
    const priceRange = document.getElementById("priceRange");
    const priceValue = document.getElementById("priceValue");

    let flowers = [];
    let currentCategory = "all";
    let maxPrice = priceRange ? Number(priceRange.value) : 5000;

    // ================== ЗАВАНТАЖЕННЯ КВІТІВ ==================
    fetch("/api/flowers")
        .then(res => res.json())
        .then(data => {
            flowers = data;
            render(flowers);
        })
        .catch(() => {
            if (grid) grid.innerHTML = "<p>Помилка завантаження каталогу</p>";
        });

    // ================== РЕНДЕР КАРТОЧОК ==================
    function render(list) {
        if (!grid) return;

        grid.innerHTML = ""; // очищаємо контейнер завжди

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
                window.location.href = `/product/${flower.id}`;
            });

            grid.appendChild(card);
        });
    }

    // ================== ФІЛЬТРИ ==================
    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                filterButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                currentCategory = btn.dataset.filter;
                applyFilters();
            });
        });
    }

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

    function applyFilters() {
        if (!flowers) return;

        const query = searchInput ? searchInput.value.toLowerCase() : "";

        const filtered = flowers.filter(f =>
            (currentCategory === "all" || f.category === currentCategory) &&
            f.price <= maxPrice &&
            f.name.toLowerCase().includes(query)
        );

        render(filtered);
    }

    // ================== SLIDER ==================
    const slides = document.querySelectorAll(".slide");
    let currentSlide = 0;
    if (slides.length > 0) {
        setInterval(() => {
            slides[currentSlide].classList.remove("active");
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add("active");
        }, 4000);
    }
});
