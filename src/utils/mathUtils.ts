import { Currency } from "../game/products/Product"

export const addCurrency = (target:Currency, add:Currency):Currency =>{
    const newCurrency: Currency = {
        currency: target.currency.add(add.currency),
        treats: target.treats.add(add.treats),
        patiencePoints: target.patiencePoints?.add(add.patiencePoints ? add.patiencePoints : 0)
    }
    return newCurrency
}

export const multiplyCurrencyBy = (target:Currency, number: number): Currency => {
    const newCurrency: Currency = {
        currency: target.currency.mul(number),
        treats: target.treats.mul(number),
        patiencePoints: target.patiencePoints?.mul(number)
    }
    return newCurrency
}

