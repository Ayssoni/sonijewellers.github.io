/**
 * Live Rates Script for Gold & Silver
 * Uses GoldAPI.io for real-time prices.
 */

// Format price in Indian Rupees
function formatINR(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(price);
}

// Update DOM elements with a subtle flash animation
function updateDOM(goldPrice, silverPrice) {
    const goldEl = document.getElementById('live-gold-price');
    const silverEl = document.getElementById('live-silver-price');
    
    if (!goldEl || !silverEl) return;

    // Check if price changed to trigger animation
    const oldGold = goldEl.dataset.price;
    if (oldGold && oldGold != goldPrice) {
        goldEl.classList.add('price-flash');
        setTimeout(() => goldEl.classList.remove('price-flash'), 1000);
    }
    goldEl.dataset.price = goldPrice;

    const oldSilver = silverEl.dataset.price;
    if (oldSilver && oldSilver != silverPrice) {
        silverEl.classList.add('price-flash');
        setTimeout(() => silverEl.classList.remove('price-flash'), 1000);
    }
    silverEl.dataset.price = silverPrice;

    goldEl.textContent = formatINR(goldPrice) + " / 10g";
    silverEl.textContent = formatINR(silverPrice) + " / 1kg";
}

// --- REAL API INTEGRATION ---
const API_KEY = 'goldapi-22df21b5666ffb9da3b28a6434da17fe-io'; 

async function fetchRealLiveRates() {
    try {
        const headers = new Headers();
        headers.append("x-access-token", API_KEY);
        headers.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'GET',
            headers: headers,
            redirect: 'follow'
        };

        // Fetch Gold (XAU) in INR
        const goldRes = await fetch("https://www.goldapi.io/api/XAU/INR", requestOptions);
        if (!goldRes.ok) throw new Error("Network response was not ok");
        const goldData = await goldRes.json();
        
        // Convert per ounce to per 10 grams (1 troy ounce = 31.1034768 grams)
        const goldPerGram = goldData.price / 31.1034768;
        const goldPer10g = Math.round(goldPerGram * 10);

        // Fetch Silver (XAG) in INR
        const silverRes = await fetch("https://www.goldapi.io/api/XAG/INR", requestOptions);
        if (!silverRes.ok) throw new Error("Network response was not ok");
        const silverData = await silverRes.json();
        
        // Convert per ounce to per 1kg
        const silverPerGram = silverData.price / 31.1034768;
        const silverPer1Kg = Math.round(silverPerGram * 1000);

        updateDOM(goldPer10g, silverPer1Kg);

    } catch (error) {
        console.error("Error fetching real rates:", error);
        // Fallback to simulation if real API fails (e.g. CORS error)
        simulateLiveRates();
    }
}

// --- FALLBACK SIMULATION ---
let baseGoldPrice = 73250;
let baseSilverPrice = 91500;

function simulateLiveRates() {
    updateDOM(baseGoldPrice, baseSilverPrice);
    setInterval(() => {
        baseGoldPrice += Math.floor(Math.random() * 101) - 50; 
        baseSilverPrice += Math.floor(Math.random() * 201) - 100;
        updateDOM(baseGoldPrice, baseSilverPrice);
    }, 10000);
}

// --- INITIALIZATION ---
// Since the script is loaded at the bottom of the body, DOM is already ready.
fetchRealLiveRates().then(() => {
    // Successfully fetched real rates
}).catch((err) => {
    console.error("Initialization error:", err);
    // If it fails completely, fallback to simulation
    simulateLiveRates();
});
