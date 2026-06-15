// ELEMENTS

const assetType = document.getElementById("assetType");
const form = document.getElementById("assetForm");

const allSections = document.querySelectorAll(".asset-section");
const assetGrid = document.querySelector(".asset-grid");

// SHOW SELECTED ASSET FORM

assetType.addEventListener("change", () => {

    const selected = assetType.value;

    // Hide all forms
    allSections.forEach(section => {
        section.style.display = "none";
    });

    if (!selected) return;

    const targetSection =
        document.getElementById(selected + "Section");

    if (targetSection) {
        targetSection.style.display = "block";
    }
});

// SAVE ASSET

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const selectedType = assetType.value;

    if (!selectedType) {
        alert("Please select an asset type");
        return;
    }

    const currentSection =
        document.getElementById(selectedType + "Section");

    const inputs =
        currentSection.querySelectorAll("input, select, textarea");

    const asset = {
        id: Date.now(),
        type: selectedType
    };

    inputs.forEach(input => {

        let key =
            input.name ||
            input.previousElementSibling?.textContent
                .trim()
                .replace(/\s+/g, "_")
                .toLowerCase();

        asset[key] = input.value;
    });

    saveAsset(asset);

    createAssetCard(asset);

    alert("Asset Saved Successfully");

    form.reset();

    allSections.forEach(section => {
        section.style.display = "none";
    });
});

// SAVE TO LOCAL STORAGE

function saveAsset(asset) {

    const assets =
        JSON.parse(localStorage.getItem("assets")) || [];

    assets.push(asset);

    localStorage.setItem(
        "assets",
        JSON.stringify(assets)
    );
}

// LOAD SAVED ASSETS

function loadAssets() {

    const assets =
        JSON.parse(localStorage.getItem("assets")) || [];

    assets.forEach(asset => {
        createAssetCard(asset);
    });
}

// CREATE CARD

function createAssetCard(asset) {

    const card = document.createElement("div");

    card.classList.add("asset-card");

    let details = "";

    for (let key in asset) {

        if (key === "id" || key === "type") continue;

        if (asset[key] !== "") {

            details += `
                <p>
                    <strong>${formatLabel(key)}:</strong>
                    ${asset[key]}
                </p>
            `;
        }
    }

    card.innerHTML = `
        <div class="asset-type">
            ${asset.type.toUpperCase()}
        </div>

        <h3>${getCardTitle(asset)}</h3>

        ${details}

        <div class="asset-actions">

            <button onclick="deleteAsset(${asset.id})">
                Delete
            </button>

        </div>
    `;

    assetGrid.appendChild(card);
}

// CARD TITLE

function getCardTitle(asset) {

    switch (asset.type) {

        case "sip":
            return asset.schemeName || "SIP";

        case "stock":
            return asset.company_name || "Stock";

        case "realEstate":
            return asset.property_name || "Property";

        case "gold":
            return "Gold Asset";

        case "silver":
            return "Silver Asset";

        case "vehicle":
            return asset.model || "Vehicle";

        case "crypto":
            return asset.coin_name || "Crypto";

        default:
            return asset.type;
    }
}

// FORMAT LABEL

function formatLabel(text) {

    return text
        .replace(/_/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase());
}

// DELETE ASSET

function deleteAsset(id) {

    let assets =
        JSON.parse(localStorage.getItem("assets")) || [];

    assets = assets.filter(
        asset => asset.id !== id
    );

    localStorage.setItem(
        "assets",
        JSON.stringify(assets)
    );

    location.reload();
}

window.deleteAsset = deleteAsset;

// INITIAL LOAD

allSections.forEach(section => {
    section.style.display = "none";
});

loadAssets();