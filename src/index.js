const amountCurrency = document.querySelector("#amount-currency");
const $fromCurrency = document.querySelector("#from-currency");
const $toCurrency = document.querySelector("#to-currency");

const getExchangeRates = async (base) => {
    const exchangeRates = await fetch(
        `https://api.exchangerate.host/lastest?base=${base}`
    );
    const exchangeRatesJSON = exchangeRates.json();

    return exchangeRatesJSON;
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
