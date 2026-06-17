// TechVerse Market Product Details Operations

document.addEventListener("DOMContentLoaded", () => {
    // 1. Retrieve product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
        window.location.href = "products.html";
        return;
    }

    const products = window.TechVerseDB.getProducts();
    const product = products.find(p => p.id === productId);

    if (!product) {
        Swal.fire({
            icon: "error",
            title: "Product Not Found",
            text: "The requested product does not exist or has been removed.",
            confirmButtonColor: "#132238"
          }).then(() => {
            window.location.href = "products.html";
          });
        return;
    }

    // 2. Render Details
    renderProductDetails(product);

    // 3. Set Quantity Adjustments
    setupQuantitySelector(product.stock);

    // 4. Set Tab Switchers
    setupTabSwitchers(product);

    // 5. Related Products Loader
    loadRelatedProducts(product, products);

    // 6. Action Listeners
    setupActionListeners(product);
});

// Render Stars Helper
function renderStars(rating) {
    let starsHtml = "";
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            starsHtml += '<i class="fas fa-star text-yellow-400"></i>';
        } else if (i === fullStars + 1 && hasHalf) {
            starsHtml += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
        } else {
            starsHtml += '<i class="far fa-star text-slate-300"></i>';
        }
    }
    return starsHtml;
}

// Render Core Elements
function renderProductDetails(product) {
    // Page Title
    document.title = `${product.name} - TechVerse Market`;

    // Breadcrumb
    const breadcrumbName = document.getElementById("breadcrumb-product-name");
    if (breadcrumbName) breadcrumbName.textContent = product.name;

    // Image
    const mainImg = document.getElementById("detail-main-img");
    const thumb1 = document.getElementById("thumb-img-1");
    if (mainImg) mainImg.src = product.image;
    if (thumb1) thumb1.src = product.image;

    // Brand and Stock Status
    const brandEl = document.getElementById("detail-brand");
    const stockEl = document.getElementById("detail-stock-badge");
    if (brandEl) brandEl.textContent = product.brand;
    if (stockEl) {
        if (product.stock > 0) {
            stockEl.textContent = `In Stock (${product.stock} items)`;
            stockEl.className = "text-xs font-bold px-3 py-1 rounded-full text-emerald-700 bg-emerald-50 border border-emerald-100";
        } else {
            stockEl.textContent = "Out of Stock";
            stockEl.className = "text-xs font-bold px-3 py-1 rounded-full text-rose-700 bg-rose-50 border border-rose-100";
        }
    }

    // Title
    const titleEl = document.getElementById("detail-title");
    if (titleEl) titleEl.textContent = product.name;

    // Stars & Review Stats
    const starsEl = document.getElementById("detail-stars");
    const ratingsText = document.getElementById("detail-rating-text");
    if (starsEl) starsEl.innerHTML = renderStars(product.rating);
    if (ratingsText) ratingsText.textContent = `${product.rating.toFixed(1)} (${product.reviewsCount} Verified Buyer Reviews)`;

    // Price
    const priceEl = document.getElementById("detail-price");
    const oldPriceEl = document.getElementById("detail-old-price");
    if (priceEl) {
        priceEl.textContent = `PKR ${(product.discountPrice || product.price).toLocaleString()}`;
    }
    if (oldPriceEl && product.discountPrice) {
        oldPriceEl.textContent = `PKR ${product.price.toLocaleString()}`;
        oldPriceEl.classList.remove("hidden");
    }

    // Description
    const descEl = document.getElementById("detail-desc");
    if (descEl) descEl.textContent = product.description;

    // Specs Table
    const specsTable = document.getElementById("detail-specs-table");
    if (specsTable && product.specifications) {
        specsTable.innerHTML = Object.entries(product.specifications).map(([key, val]) => `
            <tr>
                <td class="py-3.5 pr-4 font-bold text-slate-800 w-1/3">${key}</td>
                <td class="py-3.5 pl-4 text-slate-500">${val}</td>
            </tr>
        `).join("");
    }

    // Initialize mock reviews count on tab trigger
    const tabReviewsBtn = document.getElementById("tab-reviews-btn");
    if (tabReviewsBtn) {
        tabReviewsBtn.textContent = `Reviews (${product.reviewsCount})`;
    }
}

// Quantity adjusters
function setupQuantitySelector(maxStock) {
    const minusBtn = document.getElementById("qty-minus");
    const plusBtn = document.getElementById("qty-plus");
    const valEl = document.getElementById("qty-val");

    if (!valEl) return;

    if (minusBtn) {
        minusBtn.addEventListener("click", () => {
            let current = parseInt(valEl.textContent);
            if (current > 1) {
                valEl.textContent = current - 1;
            }
        });
    }

    if (plusBtn) {
        plusBtn.addEventListener("click", () => {
            let current = parseInt(valEl.textContent);
            if (current < maxStock) {
                valEl.textContent = current + 1;
            } else {
                Swal.fire({
                    icon: "warning",
                    title: "Stock Limit",
                    text: `Only ${maxStock} items available in stock.`,
                    confirmButtonColor: "#132238"
                });
            }
        });
    }
}

// Tabs
function setupTabSwitchers(product) {
    const tabSpecsBtn = document.getElementById("tab-specs-btn");
    const tabReviewsBtn = document.getElementById("tab-reviews-btn");
    const tabSpecsContent = document.getElementById("tab-specs-content");
    const tabReviewsContent = document.getElementById("tab-reviews-content");

    if (tabSpecsBtn && tabReviewsBtn) {
        tabSpecsBtn.addEventListener("click", () => {
            tabSpecsBtn.className = "tab-btn px-6 py-4 text-sm font-bold border-b-2 border-teal-500 text-teal-600 focus:outline-none";
            tabReviewsBtn.className = "tab-btn px-6 py-4 text-sm font-bold border-b-2 border-transparent text-slate-450 hover:text-slate-800 focus:outline-none";
            if (tabSpecsContent) tabSpecsContent.classList.remove("hidden");
            if (tabReviewsContent) tabReviewsContent.classList.add("hidden");
        });

        tabReviewsBtn.addEventListener("click", () => {
            tabReviewsBtn.className = "tab-btn px-6 py-4 text-sm font-bold border-b-2 border-teal-500 text-teal-600 focus:outline-none";
            tabSpecsBtn.className = "tab-btn px-6 py-4 text-sm font-bold border-b-2 border-transparent text-slate-450 hover:text-slate-800 focus:outline-none";
            if (tabReviewsContent) tabReviewsContent.classList.remove("hidden");
            if (tabSpecsContent) tabSpecsContent.classList.add("hidden");

            // Lazy load reviews
            loadMockReviews(product);
        });
    }
}

// Generate Mock Reviews
let localReviews = [];
function loadMockReviews(product) {
    const avgRatingEl = document.getElementById("reviews-avg-rating");
    const avgStarsEl = document.getElementById("reviews-avg-stars");
    const badgeEl = document.getElementById("reviews-count-badge");
    const listEl = document.getElementById("reviews-list");

    if (!avgRatingEl || !listEl) return;

    // Populate initial reviews if array empty
    if (localReviews.length === 0) {
        localReviews = [
            { author: "Hassan Khan", rating: 5, date: "2026-06-10", content: "Amazing product! Renders games exceptionally well. Worth every rupee." },
            { author: "Zainab Malik", rating: 4, date: "2026-06-12", content: "Solid performance, but thermals can run warm during long renders. Recommend a cooling pad." }
        ];
    }

    // Calculations
    const totalRating = localReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / localReviews.length;

    avgRatingEl.textContent = avgRating.toFixed(1);
    avgStarsEl.innerHTML = renderStars(avgRating);
    badgeEl.textContent = `Based on ${localReviews.length} reviews`;

    listEl.innerHTML = localReviews.map(r => `
        <div class="py-5">
            <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-2">
                    <span class="font-bold text-slate-800 text-sm">${r.author}</span>
                    <span class="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Verified Purchase</span>
                </div>
                <span class="text-xs text-slate-400">${r.date}</span>
            </div>
            <div class="flex text-yellow-400 text-[10px] mt-1.5 mb-2">
                ${renderStars(r.rating)}
            </div>
            <p class="text-slate-600 text-xs leading-relaxed">${r.content}</p>
        </div>
    `).join("");
}

// Add Review Action
function setupActionListeners(product) {
    const addCartBtn = document.getElementById("detail-add-cart-btn");
    const addWishBtn = document.getElementById("detail-add-wish-btn");
    const reviewBtn = document.getElementById("write-review-btn");

    if (addCartBtn) {
        addCartBtn.addEventListener("click", () => {
            const qtyVal = parseInt(document.getElementById("qty-val").textContent);
            window.CartActions.addToCart(product.id, qtyVal);
        });
    }

    if (addWishBtn) {
        addWishBtn.addEventListener("click", () => {
            window.CartActions.addToWishlist(product.id);
        });
    }

    if (reviewBtn) {
        reviewBtn.addEventListener("click", () => {
            const user = window.TechVerseDB.getCurrentUser();
            if (!user) {
                Swal.fire({
                    icon: "warning",
                    title: "Authentication Required",
                    text: "You must be logged in to leave a review.",
                    confirmButtonColor: "#2563eb"
                });
                return;
            }

            Swal.fire({
                title: "Write a Review",
                html: `
                    <div class="text-left">
                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Rating</label>
                        <select id="swal-rating" class="w-full border border-slate-200 rounded-lg p-2.5 text-sm mb-4">
                            <option value="5">5 Stars (Excellent)</option>
                            <option value="4">4 Stars (Good)</option>
                            <option value="3">3 Stars (Average)</option>
                            <option value="2">2 Stars (Poor)</option>
                            <option value="1">1 Star (Terrible)</option>
                        </select>
                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Review Comment</label>
                        <textarea id="swal-comment" placeholder="What did you like or dislike about this device?" class="w-full border border-slate-200 rounded-lg p-2.5 text-sm h-24 focus:outline-none focus:border-blue-500"></textarea>
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: "Submit Review",
                confirmButtonColor: "#2563eb",
                cancelButtonColor: "#64748b",
                preConfirm: () => {
                    const r = document.getElementById("swal-rating").value;
                    const c = document.getElementById("swal-comment").value.trim();
                    if (!c) {
                        Swal.showValidationMessage("Please write a comment.");
                    }
                    return { rating: parseInt(r), comment: c };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const newRev = {
                        author: user.name,
                        rating: result.value.rating,
                        date: new Date().toISOString().split("T")[0],
                        content: result.value.comment
                    };
                    localReviews.unshift(newRev);
                    loadMockReviews(product);

                    Swal.fire({
                        icon: "success",
                        title: "Review Submitted",
                        text: "Thank you! Your feedback has been published.",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
        });
    }
}

// Related Products Grid Render
function loadRelatedProducts(currentProduct, allProducts) {
    const grid = document.getElementById("detail-related-grid");
    if (!grid) return;

    // Filter products of same category, approved, excluding current
    const related = allProducts.filter(p => p.category === currentProduct.category && p.status === "approved" && p.id !== currentProduct.id).slice(0, 4);

    if (related.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-6 text-slate-400 text-xs font-semibold">
                No related products found in this category.
            </div>
        `;
        return;
    }

    grid.innerHTML = related.map(function (p) {
        return window.TechVerseUtils.createProductCard(p, "");
    }).join("");
}
