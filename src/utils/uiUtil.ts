import numeral from 'numeral'
import { plusCurrency } from '../components/products/ProductPlus'

export const toFormat = (number: number): string => {
    return numeral(number).format('0.[00]a').toUpperCase()
}

export const clearPluses = (pluses: Array<plusCurrency>):Array<plusCurrency> =>{
    const max = 30
    const newPluses = [...pluses]
    if (pluses.length>30){
        newPluses.splice(0,pluses.length-max)
    }
    return newPluses
}