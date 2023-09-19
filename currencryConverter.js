async function fetchCurrencyRates(amount, fromCurrency, toCurrency) {

  const apiKey = '';
  const apiUrl = `https://api.freecurrencyapi.com/v1/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}&apikey=${apiKey}`;

  try {
      // Make a GET request to the API
      const response = await fetch(apiUrl);

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Return the data
      return data;
  } catch (error) {
      // Handle errors, e.g., network errors or API errors
      console.error('Error fetching currency rates:', error);
      throw error; // Re-throw the error for handling in the calling function
  }
}

// Declare variables and constants
const currencyFrom = document.querySelector('#from-currency-select');
const currencyTo = document.querySelector('#to-currency-select');
const amount = document.querySelector('#currency-input');
const convertButton = document.querySelector('#convert-button');
const resultContainer = document.querySelector('.converted-result');
const resultAmount = document.querySelector('#converted-result-text');

// Define a function to update the currency rate options in the select elements
async function updateCurrencyRateOptions() {
  try {
      // Fetch the latest currency rates from the API (e.g., when the page loads)
      const data = await fetchCurrencyRates(1, 'USD', 'EUR'); // Example conversion (you can adjust it)

      // Extract currency rate data from the API response and populate the select elements
      const currencyRates = {}; // Initialize an empty object for currency rates

      for (const currency in data.rates) {
          currencyRates[currency] = data.rates[currency];
      }

      // Update the select elements with the latest currency options and rates
      const fromCurrencySelect = document.querySelector('#from-currency-select');
      const toCurrencySelect = document.querySelector('#to-currency-select');


      // Populate select options
      for (const currency in currencyRates) {
          const optionFrom = document.createElement('option');
          optionFrom.value = currency;
          optionFrom.textContent = currency;
          fromCurrencySelect.appendChild(optionFrom);

          const optionTo = document.createElement('option');
          optionTo.value = currency;
          optionTo.textContent = currency;
          toCurrencySelect.appendChild(optionTo);
      }
  } catch (error) {
      // Handle errors, e.g., network errors or API errors
      console.error('Error updating currency rate options:', error);
  }
}

// Call the function to update currency rate options when the page loads
updateCurrencyRateOptions()
  .then(() => {
      // Call this when the page is loaded and currency options are updated
      // If needed, you can perform additional actions here
  })
  .catch((error) => {
      console.error('Error updating currency rate options:', error);
  });

// Define the convertCurrency function
// Define the convertCurrency function
async function convertCurrency() {
  const from = currencyFrom.value;
  const to = currencyTo.value;
  const amountValue = parseFloat(amount.value);

  try {
      const data = await fetchCurrencyRates(amountValue, from, to);

      // Handle the conversion result here
      const convertedAmount = data.convertedAmount; // Adjust the property name based on the API response structure
      resultAmount.textContent = convertedAmount;
      resultContainer.style.display = 'block';
  } catch (error) {
      // Handle errors, e.g., network errors or API errors
      console.error('Error converting currency:', error);
  }
}

// Event listener for the Convert button
convertButton.addEventListener('click', convertCurrency);


// Event listener for the Convert button
convertButton.addEventListener('click', convertCurrency);