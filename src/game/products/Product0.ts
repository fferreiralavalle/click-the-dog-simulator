import { Product, Currency } from './Product'
import variables from '../VariableId';
import GameManager from '../GameManager'

export class Product0 implements Product {
    variableId: string;
    isUnlocked: boolean;

    constructor(variableId: string, isUnlocked: boolean){
        this.variableId = variableId
        this.isUnlocked = isUnlocked
        this.onTimePassed = this.onTimePassed.bind(this)
    }
    getCurrencyPerSecond(): Currency {
        const base:number = 0.1;
        const currentLevel:number = GameManager.getInstance().getVariable(this.variableId).getValue()
        const currencyPerSecond = base * currentLevel
        return {
            currency: currencyPerSecond,
            treats: 0
        }
    }
    onTimePassed(timePassed: number): void {
        const add:Currency = this.getCurrencyPerSecond();
        GameManager.getInstance().
            addToVariable(add.currency * timePassed,variables.currency)
    }
    canUnlock(): boolean{
        return true
    }
    getLevelUpPrice(): Currency {
        const basePrice:number = 15;
        const currentLevel:number = GameManager.getInstance().getVariable(this.variableId).getValue()
        const finalPrice = (currentLevel + 1) * Math.pow(basePrice,currentLevel/2)
        return {
            currency: finalPrice,
            treats: 0
        };
        
    }

    getLevel(): number { return GameManager.getInstance().getVariable(this.variableId).getValue()}
    
}