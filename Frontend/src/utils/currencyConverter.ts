import axios from "axios";

export class CurrencyConverter {
    private exchangeRates: Map<string, Map<string, number>> = new Map();

    constructor() {
        this.fetchExchangeRates('EGP');
        this.fetchExchangeRates('USD');
        this.fetchExchangeRates('EUR');
    }

    private async fetchExchangeRates(baseCurrency: string): Promise<void> {
        try {
            const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
            const data = response.data;
            const rates = new Map<string, number>(Object.entries(data.rates));
            this.exchangeRates.set(baseCurrency, rates);
        } catch (error) {
            console.error('Failed to fetch exchange rates:', error);
        }
    }

    convert(amount: number, fromCurrency: string, toCurrency: string): number {
        const fromRates = this.exchangeRates.get(fromCurrency);
        if (!fromRates) {
            this.fetchExchangeRates(fromCurrency);
            if(!fromRates) {
                throw new Error(`Exchange rates for ${fromCurrency} not found.`);
            }
        }

        const toRate = fromRates?.get(toCurrency);
        if (!toRate) {
            throw new Error(`Exchange rate from ${fromCurrency} to ${toCurrency} not found.`);
        }

        const convertedAmount = amount * toRate;
        return convertedAmount;
    }

    updateExchangeRate(baseCurrency: string, targetCurrency: string, rate: number): void {
        let baseRates = this.exchangeRates.get(baseCurrency);
        if (!baseRates) {
            baseRates = new Map<string, number>();
            this.exchangeRates.set(baseCurrency, baseRates);
        }
        baseRates.set(targetCurrency, rate);
    }
}