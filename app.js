const currencyFrom = document.querySelector("#from-currency-select");
const currencyTo = document.querySelector("#to-currency-select");
const amount = document.querySelector("#currency-input");
const convertButton = document.querySelector("#convert-button");
const resultContainer = document.querySelector(".converted-result");
const resultAmount = document.querySelector("#converted-result-text");

function removeCurrencyAndNonNumeric(inputString) {
  // Regex pattern to match currency symbols and any character that is not a number (0-9)
  const pattern = /[^0-9.]/g;

  const cleanedString = inputString.replace(pattern, "");

  return cleanedString;
}

const initiate = ""; //  Use your API Key here

// Fetch the currency rates from API
async function fetchCurrencyRates(fromCurrency, toCurrency) {
  // Create a new free account at: https://freecurrencyapi.com/ to get a free apikey, please use your own API key if you're planing on working with this code.
  const apiUrl = `https://api.freecurrencyapi.com/v1/latest?base_currency=${fromCurrency}&currencies=${toCurrency}&apikey=${initiate}`;
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching currency rates:", error);
    throw error;
  }
}

// Currencies
const currencySymbols = {
  AUD: "A$",
  BGN: "BGN",
  BRL: "R$",
  CAD: "C$",
  CHF: "CHF",
  CNY: "¥",
  CZK: "Kč",
  DKK: "kr",
  EUR: "€",
  GBP: "£",
  HKD: "HK$",
  HRK: "kn",
  HUF: "Ft",
  IDR: "Rp",
  ILS: "₪",
  INR: "₹",
  ISK: "kr",
  JPY: "¥",
  KRW: "₩",
  MXN: "Mex$",
  MYR: "RM",
  NOK: "kr",
  NZD: "NZ$",
  PHP: "₱",
  PLN: "zł",
  RON: "lei",
  RUB: "₽",
  SEK: "kr",
  SGD: "S$",
  THB: "฿",
  TRY: "₺",
  USD: "$",
  ZAR: "R",
};

function detectCurrencySymbol(selectedCurrencyCode) {
  const currencySelect = document.getElementById("from-currency-select");
  const selectedOption = currencySelect.querySelector(
    `[value="${selectedCurrencyCode}"]`
  );

  if (selectedOption) {
    // Extract the currency name from the selected option's text content
    const currencyName = selectedOption.textContent.trim().split(" - ")[1];
    return currencyName;
  }

  return "Unknown";
}

async function convertCurrency() {
  const from = currencyFrom.value;
  const to = currencyTo.value;
  const amountValue = parseFloat(removeCurrencyAndNonNumeric(amount.value));

  resultAmount.textContent = "";
  const progress = document.getElementById("progress");
  progress.style.display = "block";
  try {
    const data = await fetchCurrencyRates(from, to);
    const currencies = data.data;
    if (currencies) {
      const fromSymbol = getCurrencySymbol(from);
      const toSymbol = getCurrencySymbol(to);
      const fromName = detectCurrencySymbol(from);
      const toName = detectCurrencySymbol(to);

      const convertedAmount = currencies[to] * amountValue;
      resultAmount.innerHTML = `${fromSymbol}${formatNumber(
        amountValue
      )} ${fromName} = <span class="to-currency">${toSymbol}${formatNumber(
        convertedAmount.toFixed(2)
      )} ${toName}</span>
        <br><br>Rate: ${fromSymbol}1 = ${toSymbol} ${currencies[to]}`;
      resultContainer.style.display = "block";
    } else {
      console.log(
        `An issue occurred while fetching currencies. fetchCurrencyRates returned ${currencies}`
      );
    }
    progress.style.display = "none";
  } catch (error) {
    console.error("Error converting currency:", error);
  }
}

function getCurrencySymbol(currencyCode) {
  // Convert the input currency code to uppercase
  const code = currencyCode.toUpperCase();

  // Check if the currency code exists in the symbols object
  if (currencySymbols[code]) {
    return currencySymbols[code];
  } else {
    return "";
  }
}

// Function to update the input value with currency symbol
function updateInputWithCurrencySymbol(currencyCode) {
  const inputElement = document.getElementById("currency-input");
  const symbol = getCurrencySymbol(currencyCode);
  const inputValue = inputElement.value;

  // Check if the input value contains any currency symbol
  for (const code in currencySymbols) {
    if (inputValue.includes(getCurrencySymbol(code))) {
      // Replace the existing currency symbol with the new symbol
      inputElement.value = inputValue.replace(getCurrencySymbol(code), symbol);
      return;
    }
  }

  // If no currency symbol found in the input value, add the new symbol
  inputElement.value = `${symbol}${inputValue}`;
}

// Event listeners for currency select elements
const fromCurrencySelect = document.querySelector("#from-currency-select");
const toCurrencySelect = document.querySelector("#to-currency-select");

fromCurrencySelect.addEventListener("change", function () {
  // Update the "From" input value with the selected currency symbol
  const selectedCurrency = fromCurrencySelect.value;
  updateInputWithCurrencySymbol(selectedCurrency);
  convertCurrency();
});

toCurrencySelect.addEventListener("change", function () {
  // Update the "To" input value with the selected currency symbol
  convertCurrency();
});

convertButton.addEventListener("click", convertCurrency);
amount.addEventListener("keypress", (e) => {
  if(e.key === "Enter") convertCurrency();
})

// Format numbers to include the appropriate commas
function formatNumber(number) {
  return parseInt(number).toLocaleString();
}
