import { Product } from "./products/Product"
import { Product0 } from "./products/Product0"
import VariableIds from './VariableId'
import { TimeManager } from "./TimeManager"
import GameManager from './GameManager'

export default class ProductManager {
    products: Array<Product>
    
    constructor(timeManager: TimeManager){
        this.products = initializeProducts()
        this.onTimePassed = this.onTimePassed.bind(this)

        this.subscribeBuildings(timeManager)
    }

    getAvailableProducts(): Array<Product> {
        return this.products.filter((product)=> {
            return (product.isUnlocked)
        })
    }

    onTimePassed(timeMult: number): void {
        this.products.forEach((prod) => {
            if (prod.canUnlock() && !prod.isUnlocked){
                prod.isUnlocked = true
                console.log("product ",prod.variableId," has been unlocked!")
            }
        })
    }

    subscribeBuildings(timeManager: TimeManager): void {
        timeManager.susbcribe({
            id: 'productManager',
            onTimePass: (timeMult: number)=> this.onTimePassed(timeMult)
        })
        this.products.forEach((prod) => {
            timeManager.susbcribe({
                id: prod.variableId,
                onTimePass: (timeMult: number)=> prod.onTimePassed(timeMult)
            })
        })   
    }
}

function initializeProducts(): Array<Product> {
    return [
        new Product0(VariableIds.product0Level, false)
    ]
}
