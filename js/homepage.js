// Homepage — loads products and sliders

document.addEventListener("DOMContentLoaded", function () {
    if (typeof AOS !== "undefined") {
        AOS.init({ duration: 600, once: true, offset: 40 });
    }

    if (typeof Swiper !== "undefined") {
        new Swiper(".hero-swiper", {
            loop: true,
            autoplay: { delay: 5000, disableOnInteraction: false },
            effect: "fade",
            fadeEffect: { crossFade: true },
            pagination: { el: ".swiper-pagination", clickable: true },
            navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }
        });
    }

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

function loadCategories() {
    var box = document.getElementById("categories-slider-container");
    if (!box) return;

    var cats = window.TechVerseDB.getCategories();
    box.innerHTML = cats.map(function (cat) {
        return (
            '<a href="buyer/products.html?category=' + cat.id + '" class="cat-card shrink-0">' +
                '<img src="' + (cat.image || "") + '" alt="' + cat.name + '">' +
                '<span class="text-xs font-semibold text-slate-700">' + cat.name + '</span>' +
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

    box.innerHTML = items.map(card).join("");
}

function loadFlashSale() {
    var box = document.getElementById("flash-sale-products");
    if (!box) return;

    var items = window.TechVerseDB.getProducts()
        .filter(function (p) { return p.flashSale && p.status === "approved"; })
        .slice(0, 3);

    box.innerHTML = items.map(function (p) {
        return '<div class="flash-product-box">' + card(p).replace("czone-product-box", "czone-product-box h-full") + '</div>';
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
                b.classList.add("text-slate-600");
            });
            btn.classList.add("active-tab");
            btn.classList.remove("text-slate-600");
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
        : '<p class="col-span-full text-center py-10 text-slate-400">No products in this category.</p>';
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
            confirmButtonColor: "#132238"
        });
        form.querySelector("input[type='email']").value = "";
    });
}
