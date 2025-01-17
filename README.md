# Exchange Rate Calculator

This project is a simple exchange rate calculator built with plain JavaScript. It allows users to convert amounts between different currencies based on real-time exchange rates. 

The application supports swapping currencies, viewing conversion rates, and displaying the converted amounts. 

The API keys for currency exchange rates and conversion are stored in the app and can be entered by the user or fetched from a `.json` file.

You can see a [live demo here](https://amaumaill.github.io/exchangerate/).

## Features

- **Currency Conversion**: Users can select two currencies and enter an amount to get the exchange rate and converted amount.
- **Swap Currencies**: Users can swap the selected currencies and get the updated conversion rate and result.
- **API Integration**: The app integrates with external APIs to get the latest currency exchange rates and conversion results.
- **API Key Management**: Users can input their own API keys or load them from a local `.json` file (if running code locally).
- **Real-time Updates**: The app calculates and displays the real-time conversion rate and converted amount as soon as the user clicks the "Convert" button or swaps the currencies.

## How It Works

### Core Functions

1. **Currency Selection**: Users can select the currencies they wish to convert between using dropdown menus.
2. **Amount Input**: Users can input the amount they want to convert. The app will calculate the converted amount based on the current exchange rate.
3. **API Keys**: The application requires two API keys, one for fetching available currencies and another for conversion calculations. These can be entered manually by the user or fetched from a `.json` file.
4. **Swap Functionality**: Users can swap the two selected currencies by clicking a "Swap" button, which will re-trigger the conversion with the new selected currencies.
5. **LocalStorage for Currencies**: The app stores currency data in `localStorage` to reduce API calls and improve performance.

### Code Highlights

- **Currency Selection**: Dynamic population of currency codes from the API for both currency dropdowns.
- **Real-Time Conversion**: Fetches the conversion rate from an API and calculates the converted amount on user input.
- **Persistent API Keys**: The app fetches API keys from the user input or from a local `.json` file for security.
- **Event Listeners**: Event listeners handle the "Convert" and "Swap" actions, updating the UI with the latest data.

### Example Code Snippet

```javascript
// Event listener for the convert button
document.getElementById("convert").addEventListener("click", async () => {
    const { currencyOne, currencyTwo } = getSelectedCurrencies();
    const amountOne = document.getElementById("amount-one").value;

    try {
        const data = await loadConversion(currencyOne.value, currencyTwo.value, amountOne);
        if (data.result === "success") {
            const conversionRate = data.conversion_rate;
            document.getElementById("rate").innerText = `${conversionRate.toFixed(4)}`;
            const convertedAmount = data.conversion_result;
            document.getElementById("amount-two").value = convertedAmount.toFixed(2);
        }
    } catch (error) {
        console.error("Error fetching conversion data:", error);
    }
});
```

## How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/AmauMaill/exchangerate.git
   ```
2. Open the project directory and launch `index.html` in your browser.
3. Enter your API keys in the provided input fields or use the `.json` file to load them automatically.
4. Select the currencies, input the amount, and click "Convert" to see the exchange rate and converted value.

### Getting API Keys

To use this app, you will need API keys for currency data and conversion rates. These keys can be obtained from the following services:

- [Exchange Rates API](https://exchangeratesapi.io/) - API for getting available currencies and exchange rates.
- [ExchangeRate-API](https://www.exchangerate-api.com/) - API for converting between different currencies.

Once you have your API keys, enter them into the input fields in the app to enable functionality.

## Credits

- Currency data provided by [Exchange Rates API](https://exchangeratesapi.io/) and [ExchangeRate-API](https://www.exchangerate-api.com/).
- Tutorial by [Brad Traversy](https://www.traversymedia.com).

## License

This project is licensed under the MIT License and is intended for educational purposes.