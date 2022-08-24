/// <reference types="Cypress" />;

describe("Test exchange rates", () => {
    const from = "EUR";
    const to = "USD";
    const amount = 2500;

    it("Test to see if it shows exchanges rates", () => {
        cy.visit("http://127.0.0.1:5500/index.html");
        cy.get("#amount-currency input").type(`{backspace}${amount}`);

        cy.get("#from-currency.dropdown").click();
        cy.get("#fromEUR").click();

        cy.get("#to-currency.dropdown").click();
        cy.get("#toUSD").click();

        cy.get("#convert").click();
    });

    it("Test to see if the showed exchange rates are correct", () => {
        convertCurrencyCypress(from, to, amount).then(({ query, result }) => {
            const styledResult = result.toFixed(6);
            cy.get("#from-conversion").contains(
                `$${query.amount.toFixed(2)} ${query.from} =`
            );
            cy.get("#to-conversion").contains(`$${styledResult} ${query.to}`);
            cy.get("#reverse-conversion").contains(
                `$${query.amount.toFixed(2)} ${
                    query.to
                } = $${getReverseExchangeRateCypress(styledResult)} ${
                    query.from
                }`
            );
        });
    });
});

const convertCurrencyCypress = async (from, to, amount) => {
    const conversion = await fetch(
        `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`
    );
    const conversionJSON = conversion.json();

    return conversionJSON;
};

const getReverseExchangeRateCypress = (rate) => {
    return (1 / rate).toFixed(6);
};
