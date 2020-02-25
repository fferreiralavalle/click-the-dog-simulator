export interface Currency {
    currency: number,
    treats: number
}

export interface Product {
    variableId: string
    isUnlocked: boolean

    getCurrencyPerSecond(): Currency
    onTimePassed(timePassed: number): void
    canUnlock(): boolean
    getLevelUpPrice(): Currency
    getLevel(): number
}