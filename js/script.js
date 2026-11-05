
// Get HTML elements
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const sortFilter = document.getElementById("sort-filter");

const productList = document.getElementById("product-list");
const productCount = document.getElementById("product-count");

const loadingMessage = document.getElementById("loading-message");
const errorMessage = document.getElementById("error-message");
const emptyMessage = document.getElementById("empty-message");


// Store all products
let allProducts = [];


// Load products from JSON file
async function loadProducts() {

    loadingMessage.classList.remove("hidden");
    errorMessage.classList.add("hidden");
    emptyMessage.classList.add("hidden");

    productList.innerHTML = "";
    productCount.textContent = "Loading products...";

    try {

        const response = await fetch("data/products.json");

        if (!response.ok) {
            throw new Error("Unable to fetch product data.");
        }

        allProducts = await response.json();

        if (!Array.isArray(allProducts)) {
            throw new Error("Invalid product data.");
        }

        loadingMessage.classList.add("hidden");

        createCategoryOptions();

        displayProducts(allProducts);

    } catch (error) {

        console.error("Error loading products:", error);

        loadingMessage.classList.add("hidden");
        productList.innerHTML = "";
        productCount.textContent = "Products could not be loaded.";
        errorMessage.classList.remove("hidden");

    }

}


// Create category dropdown options dynamically
function createCategoryOptions() {

    const categories = [...new Set(
        allProducts.map(product => product.category)
    )];

    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    categories.sort().forEach(category => {

        const option = document.createElement("option");

        option.value = category;
        option.textContent = category;

        categoryFilter.appendChild(option);

    });

}


// Display product cards
function displayProducts(products) {

    productList.innerHTML = "";

    productCount.textContent =
        `Showing ${products.length} of ${allProducts.length} products`;

    if (products.length === 0) {

        emptyMessage.classList.remove("hidden");
        return;

    }

    emptyMessage.classList.add("hidden");

    products.forEach(product => {

        const card = document.createElement("article");

        card.className = "product-card";

        const icon = document.createElement("div");
        icon.className = "product-icon";
        icon.textContent = product.icon || "📦";

        const category = document.createElement("span");
        category.className = "product-category";
        category.textContent = product.category;

        const name = document.createElement("h3");
        name.textContent = product.name;

        const description = document.createElement("p");
        description.className = "product-description";
        description.textContent = product.description;

        const price = document.createElement("p");
        price.className = "product-price";
        price.textContent = `₹${Number(product.price).toLocaleString("en-IN")}`;

        card.append(
            icon,
            category,
            name,
            description,
            price
        );

        productList.appendChild(card);

    });

}


// Search, filter and sort products
function filterAndSortProducts() {

    const searchValue = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    const selectedSort = sortFilter.value;

    // Search by product name, category or description
    let filteredProducts = allProducts.filter(product => {

        const matchesSearch =
            product.name.toLowerCase().includes(searchValue) ||
            product.category.toLowerCase().includes(searchValue) ||
            product.description.toLowerCase().includes(searchValue);

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;

    });


    // Sorting
    switch (selectedSort) {

        case "name-asc":
            filteredProducts.sort((a, b) =>
                a.name.localeCompare(b.name)
            );
            break;

        case "name-desc":
            filteredProducts.sort((a, b) =>
                b.name.localeCompare(a.name)
            );
            break;

        case "price-low":
            filteredProducts.sort((a, b) =>
                Number(a.price) - Number(b.price)
            );
            break;

        case "price-high":
            filteredProducts.sort((a, b) =>
                Number(b.price) - Number(a.price)
            );
            break;

    }

    displayProducts(filteredProducts);

}


// Connect controls to filtering function
searchInput.addEventListener("input", filterAndSortProducts);

categoryFilter.addEventListener("change", filterAndSortProducts);

sortFilter.addEventListener("change", filterAndSortProducts);


// Start loading products
loadProducts();
