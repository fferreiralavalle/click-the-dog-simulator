import { Currency } from "../game/products/Product"

export const addCurrenciy = (target:Currency, add:Currency):Currency =>{
    target.currency+=add.currency
    target.treats+=add.treats
    return target
}