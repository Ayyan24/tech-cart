// Homepage — loads products and sliders

document.addEventListener("DOMContentLoaded", function () {
    if (typeof AOS !== "undefined") {
        AOS.init({ duration: 550, once: true, offset: 30 });
    }

    if (typeof Swiper !== "undefined") {
        new Swiper(".hero-swiper", {
            loop: true,
            autoplay: { delay: 4500, disableOnInteraction: false },
            effect: "slide",
            speed: 600,
            pagination: { el: ".swiper-pagination", clickable: true },
            navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }
        });
    }

    loadSidebarCategories();
    loadCategories();
    loadFlashSale();
    loadSection("featured-products-grid", function (p) { return p.featured; }, 8);
    loadSection("new-arrivals-grid", function (p) { return p.newArrival; }, 4);
    loadSection("best-sellers-grid", function (p) { return p.bestSeller; }, 4);
    loadTrending("all");
    setupTrendingTabs();
    setupNewsletter();
});

var card = function (p) { return window.TechVerseUtils.createProductCard(p, "buyer/"); };

// Build the left-side category sidebar (desktop)
function loadSidebarCategories() {
    var list = document.getElementById("sidebar-cat-list");
    if (!list) return;

    var cats = window.TechVerseDB.getCategories();
    list.innerHTML = cats.map(function (cat) {
        return (
            '<li>' +
                '<a href="buyer/products.html?category=' + cat.id + '">' +
                    '<i class="fas ' + cat.icon + '"></i>' +
                    cat.name +
                    '<i class="fas fa-chevron-right" style="margin-left: auto; font-size: 9px; opacity: 0.5;"></i>' +
                '</a>' +
            '</li>'
        );
    }).join("");
}

// Horizontal category strip
function loadCategories() {
    var box = document.getElementById("categories-slider-container");
    if (!box) return;

    var cats = window.TechVerseDB.getCategories();
    box.innerHTML = cats.map(function (cat) {
        return (
            '<a href="buyer/products.html?category=' + cat.id + '" class="cat-card shrink-0">' +
                '<img src="' + (cat.image || "") + '" alt="' + cat.name + '" loading="lazy">' +
                '<span style="display: block; font-size: 11px; font-weight: 600; color: #333; margin-top: 4px;">' + cat.name + '</span>' +
            '</a>'
        );
    }).join("");
}

function loadSection(elementId, filterFn, limit) {
    var box = document.getElementById(elementId);
    if (!box) return;

    var items = window.TechVerseDB.getProducts()
        .filter(function (p) { return p.status === "approved" && filterFn(p); })
        .slice(0, limit);

    box.innerHTML = items.length
        ? items.map(card).join("")
        : '<p style="grid-column: 1/-1; text-align: center; padding: 24px; color: #999; font-size: 13px;">No products available.</p>';
}

function loadFlashSale() {
    var box = document.getElementById("flash-sale-products");
    if (!box) return;

    var items = window.TechVerseDB.getProducts()
        .filter(function (p) { return p.flashSale && p.status === "approved"; })
        .slice(0, 3);

    box.innerHTML = items.map(function (p) {
        return '<div class="flash-product-box">' + card(p) + '</div>';
    }).join("");

    startCountdown();
}

function startCountdown() {
    var seconds = 36000;
    var hoursEl = document.getElementById("timer-hours");
    var minsEl = document.getElementById("timer-mins");
    var secsEl = document.getElementById("timer-secs");

    setInterval(function () {
        if (seconds <= 0) return;
        seconds--;
        var h = Math.floor(seconds / 3600);
        var m = Math.floor((seconds % 3600) / 60);
        var s = seconds % 60;
        if (hoursEl) hoursEl.textContent = String(h).padStart(2, "0");
        if (minsEl) minsEl.textContent = String(m).padStart(2, "0");
        if (secsEl) secsEl.textContent = String(s).padStart(2, "0");
    }, 1000);
}

function setupTrendingTabs() {
    var tabs = document.querySelectorAll(".trending-tab-btn");
    tabs.forEach(function (btn) {
        btn.addEventListener("click", function () {
            tabs.forEach(function (b) {
                b.classList.remove("active-tab");
                b.style.background = "#f5f5f5";
                b.style.color = "#333";
            });
            btn.classList.add("active-tab");
            btn.style.background = "";
            btn.style.color = "";
            loadTrending(btn.getAttribute("data-tab"));
        });
    });
}

function loadTrending(tab) {
    var box = document.getElementById("trending-products-grid");
    if (!box) return;

    var items = window.TechVerseDB.getProducts().filter(function (p) {
        if (p.status !== "approved") return false;
        if (tab === "all") return true;
        return p.category === tab;
    }).slice(0, 8);

    box.innerHTML = items.length
        ? items.map(card).join("")
        : '<p style="grid-column: 1/-1; text-align: center; padding: 24px; color: #999; font-size: 13px;">No products in this category.</p>';
}

function setupNewsletter() {
    var form = document.getElementById("newsletter-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        Swal.fire({
            icon: "success",
            title: "Subscribed!",
            text: "Thank you for subscribing to our newsletter.",
            confirmButtonColor: "#da251c"
        });
        form.querySelector("input[type='email']").value = "";
    });
}
