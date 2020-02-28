import { Product, Currency } from './Product'
import variables from '../VariableId';
import GameManager from '../GameManager'

export class PetPetting implements Product {
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
        const basePrice:number = 5;
        const currentLevel:number = GameManager.getInstance().getVariable(this.variableId).getValue()
        const finalPrice = (currentLevel + 1) * Math.pow(basePrice,(currentLevel/2+1))
        return {
            currency: Math.floor(finalPrice),
            treats: 0
        };
        
    }
    canLevelUp(): boolean {
        const currency = GameManager.getInstance().getVariable(variables.currency).getValue()
        const levelUpPrice = this.getLevelUpPrice().currency
        return levelUpPrice <= currency 
    }
    
    levelUp(): boolean {
        const levelUpPrice = this.getLevelUpPrice().currency
        if (this.canLevelUp()){
            GameManager.getInstance().addToVariable(1, this.variableId)
            GameManager.getInstance().addToVariable(-levelUpPrice, variables.currency)
            return true
        }
        else {
            return false;
        }
    }

    getLevel(): number { return GameManager.getInstance().getVariable(this.variableId).getValue()}
    
}