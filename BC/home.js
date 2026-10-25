const section3 = [
    {
        image: "imgs/GraphOf3Section_1.png",
        name: "Algre Origin Blend",
        text: "Our signature complex house blend, delivering smooth caramel notes and a beautifully clean, balanced finish.",
        price: "8,500 Ks",
        alt: "Algre Origin Blend"
    },
    {
        image: "imgs/icedVanillaLatte.png",
        name: "Iced Vanilla Latte",
        text: "Rich espresso poured gently over chilled fresh milk and infused with premium natural sweet Madagascar vanilla syrup.",
        price: "9,500 Ks",
        alt: "Iced vanilla latte"
    },
    {
        image: "imgs/butterCrossiant.png",
        name: "Signature Butter Croissant",
        text: "Flaky, golden-brown laminated layers made with pure French butter, baked to crispy perfection every morning.",
        price: "8,500 Ks",
        alt: "Butter croissant"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    const image = document.getElementById("image");
    const heading = document.getElementById("h2OfGraphOf3Section_1");
    const description = document.getElementById("pOfGraphOf3Section_1");
    const price = document.getElementById("h5ofGraphOf3Section_1");
    const previousButton = document.querySelector(".GraphOf3Section .prev");
    const nextButton = document.querySelector(".GraphOf3Section .next");

    if (!image || !heading || !description || !price || !previousButton || !nextButton) {
        throw new Error("Home slider markup is incomplete.");
    }

    let slideIndex = 0;
    let intervalId;

    function showSlide(index) {
        slideIndex = (index + section3.length) % section3.length;
        const slide = section3[slideIndex];

        image.src = slide.image;
        image.alt = slide.alt;
        heading.textContent = slide.name;
        description.textContent = slide.text;
        price.textContent = slide.price;
    }

    function startAutoplay() {
        window.clearInterval(intervalId);
        intervalId = window.setInterval(() => showSlide(slideIndex + 1), 4000);
    }

    previousButton.addEventListener("click", () => {
        showSlide(slideIndex - 1);
        startAutoplay();
    });

    nextButton.addEventListener("click", () => {
        showSlide(slideIndex + 1);
        startAutoplay();
    });

    showSlide(slideIndex);
    startAutoplay();
});
