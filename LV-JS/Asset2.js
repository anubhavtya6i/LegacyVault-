const assetForm = document.getElementById("assetForm");
const assetType = document.getElementById("assetType");

const assetGrid = document.querySelector(".asset-grid");

const allSections = document.querySelectorAll(".asset-section");

const searchInput = document.getElementById("searchAsset");

const filterSelect = document.getElementById("filterAsset");

const assetCount = document.getElementById("assetCount");

const portfolioValue = document.getElementById("portfolioValue");

const investmentValue = document.getElementById("investmentValue");

const loanValue = document.getElementById("loanValue");

const themeBtn = document.getElementById("themeBtn");


/*        APPLICATION STATE */

let assets =
JSON.parse(localStorage.getItem("assets")) || [];

let editIndex = -1;


/* THEME */

const savedTheme =
localStorage.getItem("theme");

if(savedTheme==="dark"){

    document.body.classList.add("dark");

    themeBtn.textContent="☀️";

}

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    const dark =
    document.body.classList.contains("dark");

    themeBtn.textContent =
    dark ? "☀️" : "🌙";

    localStorage.setItem(
        "theme",
        dark ? "dark":"light"
    );

});


/* INITIALIZATION */

hideAllSections();

renderAssets();

updateDashboard();

/* SHOW FORM */

assetType.addEventListener("change",()=>{

    hideAllSections();

    const selected =
    assetType.value;

    if(selected==="") return;

    // Handle Loan
    if(
        selected==="loanGiven" ||
        selected==="loanTaken"
    ){

        document
        .getElementById("loanSection")
        .style.display="block";

        const heading =
        document.querySelector(
        "#loanSection h2");

        heading.textContent =
        selected==="loanGiven"
        ?
        "Loan Given Details"
        :
        "Loan Taken Details";

        return;

    }

    const section =
    document.getElementById(
        selected+"Section"
    );

    if(section){

        section.style.display="block";

    }

});


/* SAVE ASSET */

assetForm.addEventListener("submit",function(e){

    e.preventDefault();

    const selected =
    assetType.value;

    if(selected===""){

        alert(
        "Please Select Asset Type");

        return;

    }

    let currentSection;

    if(
        selected==="loanGiven" ||
        selected==="loanTaken"
    ){

        currentSection =
        document.getElementById(
        "loanSection");

    }

    else{

        currentSection =
        document.getElementById(
        selected+"Section");

    }

    const inputs =
    currentSection.querySelectorAll(
    "input,select,textarea"
    );

    const asset={

        id:Date.now(),

        type:selected,

        fields:{}

    };

    inputs.forEach(input=>{

        asset.fields[
            input.name
        ]=input.value;

    });

    if(editIndex===-1){

        assets.push(asset);

    }

    else{

        assets[editIndex]=asset;

        editIndex=-1;

    }

    saveAssets();

    renderAssets();

    updateDashboard();

    assetForm.reset();

    hideAllSections();

    assetType.value="";

    alert("Asset Saved Successfully");

});

/* UTILITIES */

function hideAllSections(){

    allSections.forEach(section=>{

        section.style.display="none";

    });

}

function saveAssets(){

    localStorage.setItem(
        "assets",
        JSON.stringify(assets)
    );

}
/* RENDER ASSETS */

function renderAssets() {

    assetGrid.innerHTML = "";

    if (assets.length === 0) {

        assetGrid.innerHTML = `
            <div class="empty-state">
                <h2>No Assets Added</h2>
                <p>Add your first asset to start building your portfolio.</p>
            </div>
        `;

        return;
    }

    assets.forEach((asset, index) => {

        assetGrid.appendChild(createAssetCard(asset, index));

    });

}

/* CREATE ASSET CARD */

function createAssetCard(asset, index) {

    const card = document.createElement("div");

    card.className = "asset-card";

    let details = "";

    for (const key in asset.fields) {

        if (asset.fields[key] === "") continue;

        details += `
            <p>
                <strong>${formatLabel(key)}</strong><br>
                ${asset.fields[key]}
            </p>
        `;

    }

    card.innerHTML = `

        <span class="asset-type">
            ${getAssetName(asset.type)}
        </span>

        <h3>
            ${getCardTitle(asset)}
        </h3>

        ${details}

        <div class="asset-actions">

            <button onclick="editAsset(${index})">
                Edit
            </button>

            <button onclick="deleteAsset(${index})">
                Delete
            </button>

        </div>

    `;

    return card;

}

/* CARD TITLE */

function getCardTitle(asset) {

    const fields = asset.fields;

    switch (asset.type) {

        case "sip":
            return fields.fundName || "SIP";

        case "mutualFund":
            return fields.fundName || "Mutual Fund";

        case "stock":
            return fields.companyName || "Stock";

        case "fd":
            return fields.bankName || "Fixed Deposit";

        case "crypto":
            return fields.coinName || "Crypto";

        case "realEstate":
            return fields.propertyName || "Property";

        case "gold":
            return "Gold";

        case "silver":
            return "Silver";

        case "vehicle":
            return fields.vehicleName || "Vehicle";

        case "insurance":
            return fields.policyName || "Insurance";

        case "loanGiven":
            return fields.borrowerName || "Loan Given";

        case "loanTaken":
            return fields.lenderName || "Loan Taken";

        default:
            return "Asset";

    }

}

/* ASSET DISPLAY NAME */

function getAssetName(type) {

    const names = {

        sip: "SIP",

        mutualFund: "Mutual Fund",

        stock: "Stock",

        fd: "FD",

        crypto: "Crypto",

        realEstate: "Property",

        gold: "Gold",

        silver: "Silver",

        vehicle: "Vehicle",

        insurance: "Insurance",

        loanGiven: "Loan Given",

        loanTaken: "Loan Taken",

        other: "Other"

    };

    return names[type] || type;

}


/* FORMAT LABEL */

function formatLabel(label) {

    return label

        .replace(/([A-Z])/g, " $1")

        .replace(/^./, c => c.toUpperCase());

}

/* DASHBOARD */

function updateDashboard() {

    assetCount.textContent = assets.length;

    let investments = 0;

    let liabilities = 0;

    assets.forEach(asset => {

        const values = Object.values(asset.fields);

        values.forEach(value => {

            const number = parseFloat(value);

            if (isNaN(number)) return;

            if (asset.type === "loanTaken") {

                liabilities += number;

            }

            else {

                investments += number;

            }

        });

    });

    portfolioValue.textContent =
        "₹" + (investments - liabilities).toLocaleString();

    investmentValue.textContent =
        "₹" + investments.toLocaleString();

    loanValue.textContent =
        "₹" + liabilities.toLocaleString();

}
/* DELETE ASSET */

function deleteAsset(index) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this asset?"
    );

    if (!confirmDelete) return;

    assets.splice(index, 1);

    saveAssets();

    renderAssets();

    updateDashboard();

}


/* EDIT ASSET */

function editAsset(index) {

    editIndex = index;

    const asset = assets[index];

    assetType.value = asset.type;

    hideAllSections();

    let section;

    if (
        asset.type === "loanGiven" ||
        asset.type === "loanTaken"
    ) {

        section = document.getElementById("loanSection");

        section.style.display = "block";

    }

    else {

        section = document.getElementById(
            asset.type + "Section"
        );

        section.style.display = "block";

    }

    const inputs = section.querySelectorAll(
        "input,select,textarea"
    );

    inputs.forEach(input => {

        input.value =
            asset.fields[input.name] || "";

    });

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

/* SEARCH */

searchInput.addEventListener("input", () => {

    const keyword =
        searchInput.value.toLowerCase();

    const cards =
        document.querySelectorAll(".asset-card");

    cards.forEach(card => {

        if (
            card.innerText
                .toLowerCase()
                .includes(keyword)
        ) {

            card.style.display = "block";

        }

        else {

            card.style.display = "none";

        }

    });

});

/* FILTER */

filterSelect.addEventListener("change", () => {

    const value = filterSelect.value;

    const cards =
        document.querySelectorAll(".asset-card");

    cards.forEach((card, index) => {

        if (
            value === "all" ||
            assets[index].type === value
        ) {

            card.style.display = "block";

        }

        else {

            card.style.display = "none";

        }

    });

});

/* CLEAR FORM */

function clearForm() {

    assetForm.reset();

    assetType.value = "";

    editIndex = -1;

    hideAllSections();

}

/* AUTO SAVE */

window.addEventListener("beforeunload", () => {

    saveAssets();

});

/* REFRESH UI */

function refreshUI() {

    renderAssets();

    updateDashboard();

    saveAssets();

}
/* PORTFOLIO CALCULATION */

function getAssetValue(asset) {

    const f = asset.fields;

    switch (asset.type) {

        case "sip":
            return Number(f.sipAmount || 0);

        case "mutualFund":
            return Number(f.investmentAmount || 0);

        case "stock":
            return Number(f.totalInvestment || 0);

        case "fd":
            return Number(f.depositAmount || 0);

        case "crypto":
            return Number(f.investmentAmount || 0);

        case "realEstate":
            return Number(f.marketValue || 0);

        case "gold":
            return Number(f.totalValue || 0);

        case "silver":
            return Number(f.totalValue || 0);

        case "vehicle":
            return Number(f.currentValue || 0);

        case "insurance":
            return Number(f.coverAmount || 0);

        case "loanGiven":
            return Number(f.loanAmount || 0);

        case "loanTaken":
            return -Number(f.loanAmount || 0);

        default:
            return 0;
    }

}

/* DASHBOARD */

function updateDashboard() {

    assetCount.textContent = assets.length;

    let investments = 0;

    let liabilities = 0;

    assets.forEach(asset => {

        const value = getAssetValue(asset);

        if (value >= 0)
            investments += value;
        else
            liabilities += Math.abs(value);

    });

    portfolioValue.textContent =
        formatCurrency(investments - liabilities);

    investmentValue.textContent =
        formatCurrency(investments);

    loanValue.textContent =
        formatCurrency(liabilities);

}

/* CURRENCY FORMATTER */

function formatCurrency(value){

    return new Intl.NumberFormat("en-IN",{

        style:"currency",

        currency:"INR",

        maximumFractionDigits:0

    }).format(value);

}

/*  SORT ASSETS */

function sortAssets(){

    assets.sort((a,b)=>{

        return getAssetName(a.type)
            .localeCompare(getAssetName(b.type));

    });

    refreshUI();

}

/* EXPORT DATA */

function exportAssets(){

    const data = JSON.stringify(
        assets,
        null,
        2
    );

    const blob = new Blob(
        [data],
        {type:"application/json"}
    );

    const link =
        document.createElement("a");

    link.href =
        URL.createObjectURL(blob);

    link.download =
        "legacyvault-assets.json";

    link.click();

}

/* IMPORT DATA */

function importAssets(file){

    const reader = new FileReader();

    reader.onload = function(e){

        assets =
            JSON.parse(e.target.result);

        refreshUI();

    }

    reader.readAsText(file);

}

/* LAST UPDATED */

function updateLastSaved(){

    localStorage.setItem(

        "lastSaved",

        new Date().toLocaleString()

    );

}

/* SAVE OVERRIDE */

const originalSave = saveAssets;

saveAssets = function(){

    originalSave();

    updateLastSaved();

}
/* INITIAL RENDER */

refreshUI();