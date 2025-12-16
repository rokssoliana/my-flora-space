// product.js
document.addEventListener("DOMContentLoaded", () => {
    // Отримуємо id букета з URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (!id) {
        document.querySelector(".product-page").innerHTML = "<p>Букет не знайдено</p>";
        return;
    }

    // Підтягуємо дані з API
    fetch(`http://localhost:3000/api/flowers`)
        .then(res => res.json())
        .then(flowers => {
            const flower = flowers.find(f => f.id === id);
            if (!flower) {
                document.querySelector(".product-page").innerHTML = "<p>Букет не знайдено</p>";
                return;
            }

            // Вставляємо дані на сторінку
            document.getElementById("productName").textContent = flower.name;
            document.getElementById("productDescription").textContent = flower.description;
            document.getElementById("productPrice").textContent = flower.price;
            document.getElementById("productImage").src = flower.image;
            document.getElementById("productImage").alt = flower.name;
        })
        .catch(err => {
            document.querySelector(".product-page").innerHTML = "<p>Помилка завантаження букета</p>";
            console.error(err);
        });
});
