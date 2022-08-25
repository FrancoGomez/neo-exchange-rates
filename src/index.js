const $amountCurrency = document.querySelector("#amount-currency input");
const $fromCurrency = document.querySelector("#from-currency");
const $fromConversionButton = document.querySelector("#from-currency button");
const $toCurrency = document.querySelector("#to-currency");
const $toCurrencyButton = document.querySelector("#to-currency button");

const $fromConversion = document.querySelector("#from-conversion");
const $toConversion = document.querySelector("#to-conversion");
const $reverseConversion = document.querySelector("#reverse-conversion");
const $convert = document.querySelector("#convert");

const init = async () => {
    const { rates } = await getExchangeRates();

    createCurrencyDropdown(Object.keys(rates), $fromCurrency, "from");
    createCurrencyDropdown(Object.keys(rates), $toCurrency, "to");
};

const getExchangeRates = async (base = "USD") => {
    const response = await fetch(
        `https://api.exchangerate.host/lastest?base=${base}`
    );

    return response.json();
};

const getReciprocalExchangeRate = (rate, amount) => {
    if (isNaN(Number(rate)) || isNaN(Number(amount))) return;

    const reciprocalExchangeRateFormula = (amount / rate) * amount;
    return reciprocalExchangeRateFormula.toFixed(6);
};

const convertCurrency = async (from, to, amount) => {
    const conversion = await fetch(
        `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`
    );

    return conversion.json();
};

const createCurrencyDropdown = (currencies, $dropdown, type) => {
    const $dropdownButton = $dropdown.children[0];

    const $list = document.createElement("ul");
    $list.className = "dropdown-menu";

    $list.onclick = (e) => {
        const currency = e.target.id.replace(type, "");
        changeButtonCurrency(currency, $dropdownButton);
    };

    currencies.forEach((currency) => {
        $list.innerHTML += `<li>
        <button class="dropdown-item" type="button" id=${type + currency}>
            <div class="currency-flag currency-flag-${currency.toLowerCase()}"></div>
            ${currency}
        </button>
        </li>`;
    });

    $dropdown.appendChild($list);
};

const changeButtonCurrency = (currency, $boton) => {
    $boton.innerHTML = `
    <div class="currency-flag currency-flag-${currency.toLowerCase()}"></div>
    ${currency}`;
};

$convert.onclick = async () => {
    const amount = Number($amountCurrency.value);
    if (isNaN(amount)) return;

    const fromCurrency = $fromConversionButton.innerText.replace(/\s/g, "");
    const toCurrency = $toCurrencyButton.innerText.replace(/\s/g, "");

    const response = await convertCurrency(fromCurrency, toCurrency, amount);
    showConversionResults(response);
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
    } = $${getReciprocalExchangeRate(styledResult, query.amount)} ${
        query.from
    }`;
};

init();
