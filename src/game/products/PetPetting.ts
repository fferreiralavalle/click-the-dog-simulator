import { Product, Currency, CurrencySubscriber } from './Product'
import variables from '../VariableId';
import GameManager from '../GameManager'
import ProductManager from '../ProductManager';
import { PetAppreciationCenter } from './PetAppreciationCenter';
import { Laboratory } from './Laboratory';

export class PetPetting implements Product {
    currencySubscribers: CurrencySubscriber[];
    variableId: string;
    isUnlocked: boolean;
    
    constructor(variableId: string, isUnlocked: boolean){
        this.variableId = variableId
        this.isUnlocked = isUnlocked
        this.currencySubscribers = []
        this.onTimePassed = this.onTimePassed.bind(this)
    }
    getCurrencyPerSecond(level?: number): Currency {
        const base:number = 0.1;
        const currentLevel:number = level ? level : GameManager.getInstance().getVariable(this.variableId).getValue()
        const currencyWithPow = base * this.getCurrencyPerPet(currentLevel).currency
        const currencyPerSecond = currencyWithPow * currentLevel
        return {
            currency: currencyPerSecond,
            treats: 0
        }
    }

    getCurrencyPerPet(level?: number): Currency {
        const lvl = level ? level : GameManager.getInstance().getVariable(this.variableId).getValue()
        const base:number = 1
        //Pet Training Bonus
        const pac = GameManager.getInstance().getProductManager().getProduct(variables.product1Level) as PetAppreciationCenter
        const petTrainingMult = pac.getPettingTrainingCurrentBonus()
        //Pet Lab Bonus
        const lab = GameManager.getInstance().getProductManager().getProduct(variables.product2Level) as Laboratory
        const labMult = lab.getUpgradeBonus(variables.labUpgradeTier1A).baseBonus
        //Final Gain
        const final = (base + Math.floor(lvl/5)) * petTrainingMult * labMult
        return {
            currency: final,
            treats: 0
        }
    }
    subscribeToCurrency(cs: CurrencySubscriber): void {
        const alreadySubscribed = !this.currencySubscribers.filter(sub => sub.id === cs.id)
        if (!alreadySubscribed){
            this.currencySubscribers.push(cs)
            console.log("Subscribed to Petting: ", cs.id)
        }
    }
    onTimePassed(timePassed: number): void {
        const add:Currency = this.getCurrencyPerSecond();
        add.currency *= timePassed
        GameManager.getInstance().addToVariable(add.currency,variables.currency)
        this.currencySubscribers.forEach((sub)=>{
            sub.onCurrency(add)
        })
    }

    canUnlock(): boolean{
        return true 
    }
    getLevelUpPrice(): Currency {
        const basePrice:number = 5;
        const currentLevel:number = GameManager.getInstance().getVariable(this.variableId).getValue()
        const finalPrice = Math.pow(basePrice,(currentLevel/3+1))
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