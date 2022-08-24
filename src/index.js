const $amountCurrency = document.querySelector("#amount-currency input");
const $fromCurrency = document.querySelector("#from-currency");
const $fromConversionButton = document.querySelector("#from-currency button");
const $toCurrency = document.querySelector("#to-currency");
const $toCurrencyButton = document.querySelector("#to-currency button");

const $fromConversion = document.querySelector("#from-conversion");
const $toConversion = document.querySelector("#to-conversion");
const $reverseConversion = document.querySelector("#reverse-conversion");
const $convert = document.querySelector("#convert");

const getExchangeRates = async (base) => {
    const response = await fetch(
        `https://api.exchangerate.host/lastest?base=${base}`
    );

    return response.json();
};

const getReverseExchangeRate = (rate) => {
    return (1 / rate).toFixed(6);
};

const convertCurrency = async (from, to, amount) => {
    const conversion = await fetch(
        `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`
    );
    const conversionJSON = conversion.json();

    return conversionJSON;
};

const createCurrencyDropdown = (currencies, $dropdown) => {
    const $dropdownButton = $dropdown.children[0];

    const $list = document.createElement("ul");
    $list.className = "dropdown-menu";

    $list.onclick = (e) => {
        changeButtonCurrency(e.target.id, $dropdownButton);
    };

    currencies.forEach((currency) => {
        $list.innerHTML += `<li>
        <button class="dropdown-item" type="button" id=${currency}>
            <div class="currency-flag currency-flag-${currency.toLowerCase()}"></div>
            ${currency}
        </button>
        </li>`;
    });

    $dropdown.appendChild($list);
};

getExchangeRates("ARS").then((response) => {
    createCurrencyDropdown(Object.keys(response.rates), $fromCurrency);
    createCurrencyDropdown(Object.keys(response.rates), $toCurrency);
});

const changeButtonCurrency = (currency, $boton) => {
    $boton.innerHTML = `
    <div class="currency-flag currency-flag-${currency.toLowerCase()}"></div>
    ${currency}`;
};

$convert.onclick = async () => {
    const fromCurrency = $fromConversionButton.textContent.replace(/\s/g, "");
    const toCurrency = $toCurrencyButton.textContent.replace(/\s/g, "");
    const amount = Number($amountCurrency.value);

    convertCurrency(fromCurrency, toCurrency, amount).then((response) => {
        showConversionResults(response);
    });
};

const showConversionResults = ({ query, result }) => {
    const styledResult = result.toFixed(6);

    $fromConversion.textContent = `$${query.amount.toFixed(2)} ${query.from} =`;

    $toConversion.innerHTML = `$${styledResult.slice(
        0,
        -4
    )}<span>${styledResult.slice(-4)}</span> ${query.to}`;

    $reverseConversion.textContent = `$${query.amount.toFixed(2)} ${
        query.to
    } = $${getReverseExchangeRate(styledResult)} ${query.from}`;
};
