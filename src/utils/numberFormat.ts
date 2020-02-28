import numeral from 'numeral'

export const toFormat = (number: number): string => {
    return numeral(number).format('0.[00]a').toUpperCase()
}