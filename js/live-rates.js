/**
 * Live Rates Script for Gold & Silver
 * Primary source: GoldAPI.io INR endpoints.
 * Backup source: gold-api.com USD metal prices + public USD/INR exchange rate.
 */

const GOLDAPI_KEY = 'goldapi-22df21b5666ffb9da3b28a6434da17fe-io';
const TROY_OUNCE_IN_GRAMS = 31.1034768;
const RATE_REFRESH_MS = 5 * 60 * 1000;

function formatINR(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(price);
}

function setRateText(goldText, silverText) {
    const goldEl = document.getElementById('live-gold-price');
    const silverEl = document.getElementById('live-silver-price');

    if (goldEl) goldEl.textContent = goldText;
    if (silverEl) silverEl.textContent = silverText;
}

function flashIfChanged(element, newPrice) {
    if (!element) return;

    const oldPrice = element.dataset.price;
    if (oldPrice && oldPrice !== String(newPrice)) {
        element.classList.add('price-flash');
        setTimeout(() => element.classList.remove('price-flash'), 1000);
    }

    element.dataset.price = String(newPrice);
}

function updateDOM(goldPer10g, silverPer1kg) {
    const goldEl = document.getElementById('live-gold-price');
    const silverEl = document.getElementById('live-silver-price');

    flashIfChanged(goldEl, goldPer10g);
    flashIfChanged(silverEl, silverPer1kg);

    setRateText(`${formatINR(goldPer10g)} / 10g`, `${formatINR(silverPer1kg)} / 1kg`);
}

async function fetchJSON(url, options = {}) {
    const response = await fetch(url, {
        cache: 'no-store',
        ...options
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.error || `${url} failed with status ${response.status}`);
    }

    return data;
}

async function fetchGoldApiRate(symbol) {
    return fetchJSON(`https://www.goldapi.io/api/${symbol}/INR`, {
        method: 'GET',
        headers: {
            'x-access-token': GOLDAPI_KEY,
            'Content-Type': 'application/json'
        }
    });
}

async function fetchPrimaryRates() {
    const [goldData, silverData] = await Promise.all([
        fetchGoldApiRate('XAU'),
        fetchGoldApiRate('XAG')
    ]);

    return {
        goldPer10g: Math.round((goldData.price / TROY_OUNCE_IN_GRAMS) * 10),
        silverPer1kg: Math.round((silverData.price / TROY_OUNCE_IN_GRAMS) * 1000)
    };
}

async function fetchBackupRates() {
    const [goldData, silverData, exchangeData] = await Promise.all([
        fetchJSON('https://api.gold-api.com/price/XAU'),
        fetchJSON('https://api.gold-api.com/price/XAG'),
        fetchJSON('https://open.er-api.com/v6/latest/USD')
    ]);

    const usdToInr = exchangeData.rates && exchangeData.rates.INR;
    if (!usdToInr) {
        throw new Error('USD to INR exchange rate unavailable');
    }

    const goldInrPerOunce = goldData.price * usdToInr;
    const silverInrPerOunce = silverData.price * usdToInr;

    return {
        goldPer10g: Math.round((goldInrPerOunce / TROY_OUNCE_IN_GRAMS) * 10),
        silverPer1kg: Math.round((silverInrPerOunce / TROY_OUNCE_IN_GRAMS) * 1000)
    };
}

async function fetchRealLiveRates() {
    setRateText('Fetching live...', 'Fetching live...');

    try {
        const rates = await fetchPrimaryRates();
        updateDOM(rates.goldPer10g, rates.silverPer1kg);
    } catch (primaryError) {
        console.warn('GoldAPI.io unavailable, trying backup live rate source:', primaryError);

        try {
            const rates = await fetchBackupRates();
            updateDOM(rates.goldPer10g, rates.silverPer1kg);
        } catch (backupError) {
            console.error('All live metal rate sources failed:', backupError);
            setRateText('Live rate unavailable', 'Live rate unavailable');
        }
    }
}

fetchRealLiveRates();
setInterval(fetchRealLiveRates, RATE_REFRESH_MS);
