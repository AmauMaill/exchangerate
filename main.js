async function loadApiKeys() {
    const currencyApiKeyField = document.getElementById("currency-api-key");
    const conversionApiKeyField = document.getElementById("conversion-api-key");

    // Check if the input fields are populated
    const currencyApiKey = currencyApiKeyField.value.trim();
    const conversionApiKey = conversionApiKeyField.value.trim();

    if (currencyApiKey && conversionApiKey) {
        // If fields are populated, return the keys from the fields
        return {
            api_key_currency: currencyApiKey,
            api_key_conversion: conversionApiKey
        };
    } else {
        // If fields are empty, fetch from the .json file
        const url = "./data/api.json";
        try {
            const res = await fetch(url);
            const data = await res.json();
            return {
                api_key_currency: data.api_key_currency,
                api_key_conversion: data.api_key_conversion
            };
        } catch (error) {
            console.error("Error loading API keys from JSON:", error);
            throw error;
        }
    }
}


// Refactor loadCurrencies to use async/await
async function loadCurrencies() {
    const cacheKey = 'currenciesData';
    const cacheTimeKey = 'currenciesCacheTime';
    const cacheExpiryTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    try {
        const apiKey = await loadApiKeys();
        const url = `https://api.exchangeratesapi.io/v1/symbols?access_key=${apiKey.api_key_currency}`;

        // Check if we have a cached result and if it's not expired
        const cachedData = localStorage.getItem(cacheKey);
        const cacheTime = localStorage.getItem(cacheTimeKey);

        if (cachedData && cacheTime && (Date.now() - cacheTime) < cacheExpiryTime) {
            // If cached data is available and not expired, return it
            return JSON.parse(cachedData);
        } else {
            // Fetch new data and cache it
            const res = await fetch(url);
            const data = await res.json();
            localStorage.setItem(cacheKey, JSON.stringify(data));
            localStorage.setItem(cacheTimeKey, Date.now().toString());
            return data;
        }
    } catch (error) {
        console.error("Error fetching currencies:", error);
    }
}

function getSelectedCurrencies() {
    const currencyOne = document.getElementById("currency-one");
    const currencyTwo = document.getElementById("currency-two");
    return { currencyOne, currencyTwo };
}

// Refactor loadConversion to use async/await with the new API endpoint
async function loadConversion(fromCurrency, toCurrency, amount) {
    try {
        const apiKey = await loadApiKeys();
        const url = `https://v6.exchangerate-api.com/v6/${apiKey.api_key_conversion}/pair/${fromCurrency}/${toCurrency}/${amount}`;
        
        // Fetch the conversion data from the API
        const res = await fetch(url);
        
        // Check if the response is ok
        if (!res.ok) {
            throw new Error(`Failed to fetch conversion data: ${res.statusText}`);
        }

        // Parse the response as JSON
        const data = await res.json();

        // Ensure the response is successful and matches the query
        if (data.result === "success") {
            return data;
        } else {
            throw new Error("Conversion data not found or query mismatch.");
        }
    } catch (error) {
        console.error("Error fetching conversion data:", error);
    }
}


// Refactor populateSelectOptions to use async/await
async function populateSelectOptions() {
    const { currencyOne, currencyTwo } = getSelectedCurrencies();

    try {
        const data = await loadCurrencies();
        if (data.success) {
            const symbols = data.symbols;

            // Clear existing options (optional)
            currencyOne.innerHTML = '';
            currencyTwo.innerHTML = '';

            // Populate the select elements with currency codes
            for (const code in symbols) {
                const optionOne = document.createElement("option");
                const optionTwo = document.createElement("option");

                optionOne.value = code;
                optionOne.textContent = code;

                optionTwo.value = code;
                optionTwo.textContent = code;

                currencyOne.appendChild(optionOne);
                currencyTwo.appendChild(optionTwo);
            }
        } else {
            console.error("Failed to load currencies");
        }
    } catch (error) {
        console.error("Error fetching currencies:", error);
    }
}

// Handle the convert action using async/await
document.getElementById("convert").addEventListener("click", async () => {
    const { currencyOne, currencyTwo } = getSelectedCurrencies();
    const amountOne = document.getElementById("amount-one").value;

    try {
        // Call loadConversion with the selected currencies
        const data = await loadConversion(currencyOne.value, currencyTwo.value, amountOne);

        if (data.result === "success") {
            // Get the conversion rate
            const conversionRate = data.conversion_rate;

            // Populate the #rate
            const rate = document.getElementById("rate");
            rate.innerText = `${conversionRate.toFixed(4)}`;

            // Get the converted amount based on the input amount and conversion rate
            const convertedAmount = data.conversion_result;

            // Populate the #amount-two input field with the converted value
            const amountTwoInput = document.getElementById("amount-two");
            amountTwoInput.value = convertedAmount.toFixed(2); // Format to 2 decimal places
        } else {
            console.error("Failed to load conversion data.");
        }
    } catch (error) {
        console.error("Error fetching conversion data:", error);
    }
});

// Function to handle the swap action using async/await
document.getElementById("swap").addEventListener("click", async () => {
    const { currencyOne, currencyTwo } = getSelectedCurrencies();
    const amountOne = document.getElementById("amount-one").value;

    // Swap the selected currencies
    const temp = currencyOne.value;
    currencyOne.value = currencyTwo.value;
    currencyTwo.value = temp;

    try {
        // After swapping, re-trigger the conversion
        const data = await loadConversion(currencyOne.value, currencyTwo.value, amountOne);

        if (data.success) {
            // Get the conversion rate
            const conversionRate = data.info.rate;

            // Populate the #rate
            const rate = document.getElementById("rate");
            rate.innerText = `${conversionRate.toFixed(4)}`;

            // Get the converted amount based on the input amount and conversion rate
            const convertedAmount = data.result;

            // Populate the #amount-two input field with the converted value
            const amountTwoInput = document.getElementById("amount-two");
            amountTwoInput.value = convertedAmount.toFixed(2); // Format to 2 decimal places
        } else {
            console.error("Failed to load conversion data.");
        }
    } catch (error) {
        console.error("Error fetching conversion data:", error);
    }
});

// Call the function to populate the selects
populateSelectOptions();
