import { Product } from "./products/Product"
import { PetAppreciationCenter } from "./products/PetAppreciationCenter"
import { PetPetting } from "./products/PetPetting"
import VariableIds from './VariableId'
import { TimeManager } from "./TimeManager"
import GameManager from './GameManager'
import { Laboratory } from "./products/Laboratory"

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

    getProduct(productId: string): Product {
        const prod = this.products.filter((p) =>{
            return p.variableId === productId
        })
        return prod[0]
    }

    levelUpProduct(productId: string): boolean{
        const p:Product = this.getProduct(productId)
        const result = p.levelUp()
        console.log({
            result
        })
        return result
    }
}

function initializeProducts(): Array<Product> {
    return [
        new PetPetting(VariableIds.product0Level, false),
        new PetAppreciationCenter(VariableIds.product1Level, false),
        new Laboratory(VariableIds.product2Level, false)
    ]
}
