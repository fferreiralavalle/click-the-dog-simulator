import { Product, Currency, CurrencySubscriber } from './Product'
import ids from '../VariableId';
import GameManager from '../GameManager'
import ProductManager from '../ProductManager';
import { PetAppreciationCenter } from './PetAppreciationCenter';
import { Laboratory } from './Laboratory';
import Decimal from 'break_infinity.js';
import { Park } from './Park';
import { King } from './UpgradeKing';
import { multiplyCurrencyBy } from '../../utils/mathUtils';
import { Tree } from './Tree';
import { getBuildingIcon } from '../../utils/uiUtil';

export class Museum implements Product {
    currencySubscribers: CurrencySubscriber[];
    variableId: string;
    isUnlocked: boolean;
    currencyPerSecond: Currency;

    constructor(variableId: string, isUnlocked: boolean){
        this.variableId = variableId
        this.isUnlocked = isUnlocked
        this.currencySubscribers = []
        this.onTimePassed = this.onTimePassed.bind(this)
        this.currencyPerSecond = {currency:new Decimal(0), treats: new Decimal(0)}
    }
    
    getCurrencyPerSecond(): Currency {
        return this.currencyPerSecond
    }

    updateCurrencyPerSecond(level?: number, dontApply:boolean=false): Currency {
        const lvl = level ? level : this.getLevel()
        const archivements = GameManager.getInstance().getArchivementManager().getUnlockedArchivements().length
        const currencyperArchivement = this.getCurrencyPerArchivement(lvl)
        const timeMult = this.getTimePassedMult()
        const currencyPerSecond = currencyperArchivement.mul(archivements).mul(timeMult)
        const newCurrencyPerSecond = {
            currency: currencyPerSecond,
            treats: new Decimal(0)
        }
        if (!dontApply){
            this.currencyPerSecond = newCurrencyPerSecond
        }
        return newCurrencyPerSecond
    }

    getCurrencyPerArchivement(level?: number): Decimal{
        const lvl = level ? level : this.getLevel()
        const king = GameManager.getInstance().getProductManager().getProduct(ids.upgradeShop) as King
        const kingBonus = king.getUpgradeBonus(ids.upgradeProduct7A)
        const base = 2 * kingBonus
        const final: Decimal = new Decimal(base * lvl)
        return final
    }

    getTimePassedMult(): number {
        const seconds = Number(GameManager.getInstance().getVariable(ids.timePassed).getValue())
        const increasePerSecond = 0.00001
        const finalIncrease = 1 + increasePerSecond * seconds
        return finalIncrease
    }

    subscribeToCurrency(cs: CurrencySubscriber): void {
        const alreadySubscribed = !this.currencySubscribers.filter(sub => sub.id === cs.id)
        if (!alreadySubscribed){
            this.currencySubscribers.push(cs)
            console.log("Subscribed to Petting: ", cs.id)
        }
    }
    onTimePassed(timePassed: number): Currency {
        const cps:Currency = this.getCurrencyPerSecond();
        const add = multiplyCurrencyBy(cps,timePassed)
        GameManager.getInstance().addToVariable(add.currency,ids.currency)
        GameManager.getInstance().addToVariable(add.treats,ids.treats)
        this.currencySubscribers.forEach((sub)=>{
            sub.onCurrency(add)
        })
        return add
    }

    canUnlock(): boolean{
        const museumRelic = Number(GameManager.getInstance().getVariable(ids.relicMuseum).getValue())
        return museumRelic > 0 
    }

    getLevelUpPrice(): Currency {
        const basePrice:Decimal = new Decimal(7);
        const currentLevel:number = Number(GameManager.getInstance().getVariable(this.variableId).getValue())
        const tree = GameManager.getInstance().getProductManager().getProduct(ids.treeOfGoodBoys) as Tree
        const discount:number = tree.getBlessing(ids.blessing0A).getBonus()
        const finalPrice = new Decimal(basePrice).mul(currentLevel).plus(basePrice.pow(currentLevel/4+1)).mul(discount)
        return {
            currency: new Decimal(0),
            treats: finalPrice.floor()
        };
        
    }
    canLevelUp(): boolean {
        const treats:Decimal = GameManager.getInstance().getVariable(ids.treats).getValue()
        const levelUpPrice = this.getLevelUpPrice().treats
        const condition = levelUpPrice.lte(treats) 
        return condition 
    }
    
    levelUp(): boolean {
        const levelUpPrice = multiplyCurrencyBy(this.getLevelUpPrice(),-1)
        if (this.canLevelUp()){
            GameManager.getInstance().addToVariable(1, this.variableId)
            GameManager.getInstance().addCurrency(levelUpPrice)
            GameManager.getInstance().getProductManager().updateCurrenciesPerSecond()
            if (this.getLevel()===1){
                GameManager.getInstance().getNotificationManager().addNotification({
                    id:'pet-museum-unlock',
                    title: 'The Museum has been unlocked!',
                    description:'Hsss! Wait, a human? And it has shiny archivements. Allow me to take care of those...',
                    image: getBuildingIcon(ids.museum).icon,
                    background: getBuildingIcon(ids.museum).background,
                    seen: false,
                  })
                  GameManager.getInstance().getNotificationManager().addNotification({
                    id:'pet-museum-unlock-doubt',
                    title: 'A cat???',
                    description:"Do not worry human, I will take this trespasser down with by DRAGON BREATH! *bark bork*",
                    image: getBuildingIcon(ids.product4Level).icon,
                    background: getBuildingIcon(ids.product4Level).background,
                    seen: false,
                  })
                  GameManager.getInstance().getNotificationManager().addNotification({
                    id:'pet-museum-unlock-continue',
                    title: 'Hsss!',
                    description:"There is enough human for both dogs and cats! Not that I need their affection or anything...",
                    image: getBuildingIcon(ids.museum).icon,
                    background: getBuildingIcon(ids.museum).background,
                    seen: false,
                  })
            }
            if (this.getLevel()===15){
                GameManager.getInstance().getNotificationManager().addNotification({
                    id:'pet-museum-unlock-thanks',
                    title: '...',
                    description:"Thank you...",
                    image: getBuildingIcon(ids.museum).icon,
                    background: getBuildingIcon(ids.museum).background,
                    seen: false,
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