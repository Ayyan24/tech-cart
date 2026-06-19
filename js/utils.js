// Simple shared helpers used across the site
(function () {
    function formatPrice(amount) {
        return "Rs. " + Number(amount).toLocaleString();
    }

    function renderStars(rating) {
        var html = "";
        var full = Math.floor(rating);
        for (var i = 1; i <= 5; i++) {
            html += i <= full
                ? '<i class="fas fa-star"></i>'
                : '<i class="far fa-star"></i>';
        }
        return html;
    }

    function getDiscountPercent(product) {
        if (!product.discountPrice || product.discountPrice >= product.price) return 0;
        return Math.round((1 - product.discountPrice / product.price) * 100);
    }

    // Czone-style product box — one place for all product cards
    function createProductCard(product, linkPrefix) {
        linkPrefix = linkPrefix || "";
        var discount = getDiscountPercent(product);
        var salePrice = product.discountPrice || product.price;
        var outOfStock = product.stock <= 0;
        var badges = "";
        var ratingText = product.rating > 0
            ? product.rating.toFixed(1) + " (" + (product.reviewsCount || 0) + " reviews)"
            : "New arrival";
        var stockLabel = outOfStock ? "Out of stock" : (product.stock || 0) + " in stock";
        var stockClass = outOfStock ? "out-stock" : "in-stock";

        if (product.newArrival) {
            badges += '<span class="czone-badge czone-badge-new">New</span>';
        }
        if (discount > 0) {
            badges += '<span class="czone-badge czone-badge-sale">' + discount + '% Off</span>';
        }

        var priceHtml = product.discountPrice
            ? '<span class="czone-price-old">' + formatPrice(product.price) + '</span>' +
              '<span class="czone-price">' + formatPrice(product.discountPrice) + '</span>'
            : '<span class="czone-price">' + formatPrice(product.price) + '</span>';

        var cartBtn = outOfStock
            ? '<button class="czone-btn czone-btn-disabled" disabled>Out Of Stock</button>'
            : '<button class="czone-btn" onclick="window.CartActions.addToCart(\'' + product.id + '\')">Add To Cart</button>';

        return (
            '<div class="czone-product-box">' +
                (badges ? '<div class="czone-badges">' + badges + '</div>' : '') +
                '<a href="' + linkPrefix + 'product-details.html?id=' + product.id + '" class="czone-product-img">' +
                    '<img src="' + product.image + '" alt="' + product.name + '" loading="lazy">' +
                '</a>' +
                '<div class="czone-product-body">' +
                    '<div class="czone-product-top">' +
                        '<span class="czone-product-brand">' + (product.brand || 'Techcart') + '</span>' +
                        '<span class="czone-stock-pill ' + stockClass + '"><i class="fas fa-box"></i>' + stockLabel + '</span>' +
                    '</div>' +
                    '<a href="' + linkPrefix + 'product-details.html?id=' + product.id + '" class="czone-product-title">' + product.name + '</a>' +
                    '<div class="czone-rating-row">' +
                        '<div class="czone-stars">' + renderStars(product.rating) + '</div>' +
                        '<span class="czone-rating-copy">' + ratingText + '</span>' +
                    '</div>' +
                    '<div class="czone-prices">' + priceHtml + '</div>' +
                    '<div class="czone-card-actions">' +
                        '<button class="czone-icon-btn" aria-label="Add to wishlist" onclick="window.CartActions.addToWishlist(\'' + product.id + '\')"><i class="far fa-heart"></i></button>' +
                        cartBtn +
                    '</div>' +
                '</div>' +
            '</div>'
        );
    }

    window.TechcartUtils = {
        formatPrice: formatPrice,
        renderStars: renderStars,
        getDiscountPercent: getDiscountPercent,
        createProductCard: createProductCard
    };
})();
