import { Currency } from "../game/products/Product"

export const addCurrency = (target:Currency, add:Currency):Currency =>{
    target.currency.add(add.currency)
    target.treats.add(add.treats)
    target.patiencePoints?.add(add.patiencePoints ? add.patiencePoints : 0)
    return target
}

