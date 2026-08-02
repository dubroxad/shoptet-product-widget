document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-product]").forEach(loadProduct);
});

async function loadProduct(container) {

    const url = container.dataset.product;
    const theme = container.dataset.theme || "horizontal";
    const buttonText = container.dataset.button || "Zobraziť produkt";
    const badge = container.dataset.badge || "";

    try {

        const response = await fetch(url);

        if (!response.ok)
            throw new Error("Produkt sa nepodarilo načítať.");

        const html = await response.text();

        const doc = new DOMParser().parseFromString(html, "text/html");

        const title =
            doc.querySelector("h1")?.textContent.trim() || "";

        const priceElement =
            doc.querySelector('[itemprop="price"]');

        const price =
            priceElement?.getAttribute("content") ||
            priceElement?.textContent.trim() ||
            "";

        const image =
            doc.querySelector('[itemprop="image"]')?.src ||
            doc.querySelector('[itemprop="image"]')?.getAttribute("content") ||
            doc.querySelector(".p-image img")?.src ||
            "";

        const availability =
            doc.querySelector('[itemprop="availability"]')?.getAttribute("href") ||
            "";

        const stock =
            availability.includes("InStock")
                ? "Skladom"
                : "Nedostupné";

        container.innerHTML = `
            <div class="am-widget am-${theme}">

                <a href="${url}" class="am-image-link">
                    <img class="am-image"
                         src="${image}"
                         alt="${title}"
                         loading="lazy">
                </a>

                <div class="am-content">
                    
                    ${badge ? `<div class="am-badge">${badge}</div>` : ""}
                    
                    <h3 class="am-title">
                        <a href="${url}">
                            ${title}
                        </a>
                    </h3>

                    <div class="am-price">
                        ${price} €
                    </div>

                    <div class="am-stock">
                        ${stock}
                    </div>

                    <a href="${url}" class="am-button">
                        ${buttonText}
                    </a>

                </div>

            </div>
        `;

    }

    catch (e) {

        console.error(e);

        container.innerHTML = `
            <div class="am-error">
                Produkt sa nepodarilo načítať.
            </div>
        `;

    }

}