import Decimal from 'break_infinity.js'

export interface Currency {
    currency: Decimal,
    treats: Decimal,
    patiencePoints?: Decimal
}

export interface CurrencySubscriber {
    id: string,
    onCurrency: (currency: Currency) => void
}

export interface Product {
    variableId: string
    isUnlocked: boolean
    currencySubscribers: Array<CurrencySubscriber>
    currencyPerSecond: Currency

    getCurrencyPerSecond(): Currency
    updateCurrencyPerSecond(): Currency
    onTimePassed(timePassed: number): Currency
    subscribeToCurrency(cs: CurrencySubscriber):void
    canUnlock(): boolean
    getLevelUpPrice(): Currency
    getLevel(): number
    levelUp(): boolean
    canLevelUp(): boolean
}