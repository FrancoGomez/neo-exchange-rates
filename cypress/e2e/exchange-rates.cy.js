/// <reference types="Cypress" />;

describe("Test exchange rates", () => {
    const props = {
        from: "EUR",
        to: "USD",
        amount: 2500,
    };

    it("Test to see if it shows exchanges rates", () => {
        cy.visit("http://127.0.0.1:5500/index.html");
        cy.get("#amount-currency input").type(`{backspace}${props.amount}`);

        cy.get("#from-currency.dropdown").click();
        cy.get("#fromEUR").click();

        cy.get("#to-currency.dropdown").click();
        cy.get("#toUSD").click();

        cy.get("#convert").click();
    });

    it("Test to see if the showed exchange rates are correct", async () => {
        const { query, result } = await convertCurrencyCypress(props);

        const styledResult = result.toFixed(6);

        cy.get("#from-conversion").contains(
            `$${query.amount.toFixed(2)} ${query.from} =`
        );
        cy.get("#to-conversion").contains(`$${styledResult} ${query.to}`);
        cy.get("#reverse-conversion").contains(
            `$${query.amount.toFixed(2)} ${
                query.to
            } = $${getReciprocalExchangeRateCypress(styledResult)} ${
                query.from
            }`
        );
    });
});

const convertCurrencyCypress = async ({ from, to, amount }) => {
    const conversion = await fetch(
        `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`
    );

    return conversion.json();
};

const getReciprocalExchangeRateCypress = (rate) => {
    if (isNaN(Number(rate))) return;
    
    const reciprocalExchangeRateFormula = rate / 1;
    return reciprocalExchangeRateFormula.toFixed(6);
};
