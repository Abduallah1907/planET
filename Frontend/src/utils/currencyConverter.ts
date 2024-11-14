import axios from "axios";

export class CurrencyConverter {
    private exchangeRates: Map<string, Map<string, number>> = new Map();
    private currencies: Map<string, string> = new Map();


    constructor() {
        this.fetchCurrencies();
        this.fetchExchangeRates('EGP');
        this.fetchExchangeRates('USD');
        this.fetchExchangeRates('EUR');
    }

    private async fetchCurrencies(): Promise<void> {
        try {
            const response = await axios.get('https://openexchangerates.org/api/currencies.json');
            const data = response.data;
            const filteredData = Object.entries(data).filter(([key, value]) =>
                !((value as string).toLowerCase().includes('ounce')) &&
                !((key as string).includes('STD')) &&
                !((key as string).includes('VEF')) &&
                !((key as string).includes('XDR')) &&
                !((key as string).includes('BTC')) &&
                !((key as string).includes('CNH'))
            );
            this.currencies = new Map<string, string>(filteredData as [string, string][]);
        } catch (error) {
            console.error('Failed to fetch currencies', error);
        }
    }

    public getCurrencies(): Map<string, string> {
        return this.currencies;
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