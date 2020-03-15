import { Product, Currency, CurrencySubscriber } from './Product'
import ids from '../VariableId';
import GameManager from '../GameManager'
import ProductManager from '../ProductManager';
import { PetAppreciationCenter } from './PetAppreciationCenter';
import { Laboratory } from './Laboratory';
import Decimal from 'break_infinity.js';
import { Park } from './Park';

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
        const lvl = level ? level : GameManager.getInstance().getVariable(this.variableId).getValue()
        const base:number = 0.1;
        const hands = this.getHandsAmount(lvl)
        const allCurrencPerSecond = this.getCurrencyPerPet(lvl)
        const currencyWithPow = new Decimal(base).mul(allCurrencPerSecond.currency)
        const currencyPerSecond = currencyWithPow.mul(hands)
        const treats = new Decimal(base).mul(allCurrencPerSecond.treats).mul(hands)
        return {
            currency: currencyPerSecond,
            treats
        }
    }

    getCurrencyPerPet(level?: number): Currency {
        const lvl = level ? level : GameManager.getInstance().getVariable(this.variableId).getValue()
        const base:number = 1
        //Pet Training Bonus
        const pac = GameManager.getInstance().getProductManager().getProduct(ids.product1Level) as PetAppreciationCenter
        const petTrainingMult = pac.getPettingTrainingCurrentBonus()
        //Pet Lab Bonus
        const lab = GameManager.getInstance().getProductManager().getProduct(ids.product2Level) as Laboratory
        const labMult = lab.getUpgradeBonus(ids.labUpgradeTier1A).baseBonus
        //Pet Lab Chance Bonus
        const criticalChance = lab.getUpgradeBonus(ids.labUpgradeTier2A).baseBonus
        const isCritical = Math.random() < criticalChance
        const criticalBonus = isCritical ? 1 : 0
        //Relic Bonus
        const park = GameManager.getInstance().productManager.getProduct(ids.product4Level) as Park
        const relic0DBonus = park.getRelicBonus(ids.relicTier0D)
        const relic0DFinal = (relic0DBonus!==0 ? relic0DBonus : 1)
        const relic1ABonus = park.getRelicBonus(ids.relicTier1A)
        const relic1Final = (relic1ABonus!==0 ? relic1ABonus : 1)
        //Final Gain
        const final = new Decimal(base).add(Math.floor(lvl/3)).mul(petTrainingMult).mul(labMult).mul(relic1Final).mul(relic0DFinal)
        return {
            currency: final,
            treats: new Decimal(criticalBonus)
        }
    }


    getHandsAmount(level?:number){
        const lvl = level ? level : GameManager.getInstance().getVariable(this.variableId).getValue()
        //Relic
        const park = GameManager.getInstance().productManager.getProduct(ids.product4Level) as Park
        const relic1DBonus = park.getRelicBonus(ids.relicTier1D)
        const relic1DFinal = (relic1DBonus!==0 ? relic1DBonus : 1)

        const hands = lvl * relic1DFinal
        return hands
    }
    subscribeToCurrency(cs: CurrencySubscriber): void {
        const alreadySubscribed = !this.currencySubscribers.filter(sub => sub.id === cs.id)
        if (!alreadySubscribed){
            this.currencySubscribers.push(cs)
            console.log("Subscribed to Petting: ", cs.id)
        }
    }
    onTimePassed(timePassed: number): Currency {
        const add:Currency = this.getCurrencyPerSecond();
        add.currency = add.currency.mul(timePassed)
        add.treats.mul(timePassed)
        GameManager.getInstance().addToVariable(add.currency,ids.currency)
        GameManager.getInstance().addToVariable(add.treats,ids.treats)
        this.currencySubscribers.forEach((sub)=>{
            sub.onCurrency(add)
        })
        return add
    }

    canUnlock(): boolean{
        return true 
    }
    getLevelUpPrice(): Currency {
        const basePrice:Decimal = new Decimal(5);
        const currentLevel:number = Number(GameManager.getInstance().getVariable(this.variableId).getValue())
        const finalPrice = new Decimal(basePrice).mul(currentLevel).plus(basePrice.pow(currentLevel/4+1))
        return {
            currency: finalPrice.floor(),
            treats: new Decimal(0)
        };
        
    }
    canLevelUp(): boolean {
        const currency:Decimal = GameManager.getInstance().getVariable(ids.currency).getValue()
        const levelUpPrice = this.getLevelUpPrice().currency
        const condition = levelUpPrice.lte(currency) 
        return condition 
    }
    
    levelUp(): boolean {
        const levelUpPrice = this.getLevelUpPrice().currency.mul(-1)
        if (this.canLevelUp()){
            GameManager.getInstance().addToVariable(1, this.variableId)
            GameManager.getInstance().addToVariable(levelUpPrice, ids.currency)
            if (this.getLevel()===1){
                GameManager.getInstance().getNotificationManager().addNotification({
                    id:'pet-petting-unlock',
                    background: 'https://i.imgur.com/6ZO4rY8.jpg',
                    description:'Wow! Your dog is being automaticly pet! Hover over a building to see more details.',
                    image: 'https://i.imgur.com/B00xNnt.png',
                    seen: false,
                    title: 'Divine Petting Unlocked!'
                  })
            }
            return true
        }
        else {
            return false;
        }
    }

    getLevel(): number { return GameManager.getInstance().getVariable(this.variableId).getValue()}
    
}