import { productData } from './NPdata.js';

document.addEventListener("DOMContentLoaded", function() {
    const data = productData.feedback;

    let totalRating = 0;
    let reviewCount = data.length;
    let reviewsContainer = document.getElementById("reviews");

    data.forEach(review => {
        totalRating += review.rating;

        let reviewElement = document.createElement("div");
        reviewElement.classList.add("review");

        reviewElement.innerHTML = `
            <h3>${review.name}</h3>
            <div class="stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
            <p>${review.comment}</p>
        `;

        reviewsContainer.appendChild(reviewElement);
    });

    let averageRating = (totalRating / reviewCount).toFixed(1);
    document.getElementById("rating-score").innerText = averageRating;
    document.getElementById("overall-stars").innerText = '★'.repeat(Math.round(averageRating)) + '☆'.repeat(5 - Math.round(averageRating));
    document.getElementById("review-count").innerText = `${reviewCount} reviews`;
});