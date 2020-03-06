export interface Currency {
    currency: number,
    treats: number
}

export interface CurrencySubscriber {
    id: string,
    onCurrency: (currency: Currency) => void
}

export interface Product {
    variableId: string
    isUnlocked: boolean
    currencySubscribers: Array<CurrencySubscriber>

    getCurrencyPerSecond(): Currency
    onTimePassed(timePassed: number): Currency
    subscribeToCurrency(cs: CurrencySubscriber):void
    canUnlock(): boolean
    getLevelUpPrice(): Currency
    getLevel(): number
    levelUp(): boolean
    canLevelUp(): boolean
}