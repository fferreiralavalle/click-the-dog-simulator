import { Product, Currency, CurrencySubscriber } from './Product'
import ids from '../VariableId';
import GameManager from '../GameManager'
import { addCurrency, multiplyCurrencyBy } from '../../utils/mathUtils';
import Decimal from 'break_infinity.js';
import { Park } from './Park';
import { UpgradeKing, UpgradeKingStandar } from '../upgrades/Upgrade';
import { getBuildingIcon } from '../../utils/uiUtil';

const baseUpgradeCostLove:Currency = {currency: new Decimal(1000), treats: new Decimal(0)}

export class King implements Product {
    currencySubscribers: Array<CurrencySubscriber>;
    variableId: string;
    isUnlocked: boolean;
    currencyPerSecond: Currency;
    
    constructor(variableId: string, isUnlocked: boolean){
        this.variableId = variableId
        this.isUnlocked = isUnlocked
        this.onTimePassed = this.onTimePassed.bind(this)
        this.currencySubscribers = []
        this.currencyPerSecond = {currency:new Decimal(0), treats: new Decimal(0)}
    }
    
    getCurrencyPerSecond(): Currency {
        return this.currencyPerSecond
    }

    updateCurrencyPerSecond(level?: number, dontApply:boolean=false): Currency {
        const currentLevel:number = Number(level ? level : this.getLevel())
        const farmLvl = Number(GameManager.getInstance().getVariable(ids.product1Level).getValue())
        const LabLvl = Number(GameManager.getInstance().getVariable(ids.product2Level).getValue())
        const wizLvl = Number(GameManager.getInstance().getVariable(ids.product3Level).getValue())
        const parkLvl = Number(GameManager.getInstance().getVariable(ids.product4Level).getValue())
        const allLevels = currentLevel + farmLvl + LabLvl + wizLvl + parkLvl;
        const multiplier = this.getCurrencyMultiplier(currentLevel)
        const lovePerSecond = allLevels * multiplier
        const newCurrencyPerSecond:Currency = {
            currency: new Decimal(lovePerSecond),
            treats: new Decimal(0)
        }
        if (!dontApply){
            this.currencyPerSecond = newCurrencyPerSecond
        }
        return newCurrencyPerSecond
    }

    getCurrencyMultiplier(level?:number){
        const currentLevel:number = Number(level ? level : this.getLevel())
        const base = 0.1
        const increasePerLevel = 0.05
        return base + increasePerLevel * currentLevel
    }

    onTimePassed(timePassed: number): Currency {
        const cps:Currency = this.getCurrencyPerSecond();
        const currency:Currency = multiplyCurrencyBy(cps,timePassed)
        GameManager.getInstance().addCurrency(currency)
        this.onCurrencyTime(currency)
        return currency
    }
    
    subscribeToCurrency(cs: CurrencySubscriber): void {
        const alreadySubscribed = !this.currencySubscribers.filter(sub => sub.id === cs.id)
        if (!alreadySubscribed){
            this.currencySubscribers.push(cs)
            console.log("Subscribed to Lab: ", cs.id)
        }
    }

    onCurrencyTime(currency: Currency){
        this.currencySubscribers.forEach((sub)=>{
            sub.onCurrency(currency)
        })
    }

    canUnlock(): boolean{
        const handsLevel:number = GameManager.getInstance().getVariable(ids.product0Level).getValue()
        const farmLevel:number = GameManager.getInstance().getVariable(ids.product1Level).getValue()
        const labLevel:number = GameManager.getInstance().getVariable(ids.product2Level).getValue()
        const handsNeeded:number = 10
        const farmNeeded:number = 10
        const labLevelNeeded:number = 5
        return farmNeeded <= farmLevel && handsNeeded <= handsLevel && labLevelNeeded <= labLevel
    }
    getLevelUpPrice(level?:number): Currency {
        const basePrice:number = 15;
        const initialPrice:number = 285;
        const lvl:number = level ? level : GameManager.getInstance().getVariable(this.variableId).getValue()
        const finalPrice = initialPrice + basePrice*lvl*10 + Math.pow(basePrice,1+lvl/3)
        return {
            currency: new Decimal(finalPrice),
            treats: new Decimal(0)
        };
    }
    canLevelUp(): boolean {
        const currency = GameManager.getInstance().getVariable(ids.currency).getValue()
        const levelUpPrice = this.getLevelUpPrice().currency
        return levelUpPrice.lte(currency)
    }
    levelUp(): boolean {
        const levelUpPrice = this.getLevelUpPrice().currency.mul(-1)
        if (this.canLevelUp()) {
            GameManager.getInstance().addToVariable(1, this.variableId)
            GameManager.getInstance().addToVariable(levelUpPrice, ids.currency)
            GameManager.getInstance().getProductManager().updateCurrenciesPerSecond()
            if (this.getLevel()===1){
                GameManager.getInstance().getNotificationManager().addNotification({
                    id:'king-unlcoked',
                    title: 'King Baby has returned?!',
                    description:'Good evening dear subjects, I, the Baby King have finally returned from my morning stroll and my doogness, am I ready to rule again.',
                    image: getBuildingIcon(ids.upgradeShop).icon,
                    background: getBuildingIcon(ids.upgradeShop).background,
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
    
    /* UPGRADES */
    getUpgradePrice(upgradeId: string): Currency{
        const upgrade = this.getUpgrade(upgradeId)
        const lvl = Number(GameManager.getInstance().getVariable(upgradeId).getValue())
        const cost = upgrade.getCost(lvl)
        return cost
    }

    canBuyUpgrade(upgradeId: string, level?:number): boolean {
        const upgrade = this.getUpgrade(upgradeId)
        const lvl = GameManager.getInstance().getVariable(upgradeId).getValue()
        const kingLvl = level ? level : this.getLevel()
        const currency: Currency = GameManager.getInstance().getCurrency()
        const result = upgrade.canUpgrade(lvl, kingLvl, currency)
        return result
    }

    buyUpgrade(upgradeId: string):boolean{
        if (this.canBuyUpgrade(upgradeId)){
            const price = this.getUpgradePrice(upgradeId)
            const cost = multiplyCurrencyBy(price,-1)
            GameManager.getInstance().addCurrency(cost)
            GameManager.getInstance().addToVariable(1, upgradeId)
            GameManager.getInstance().getProductManager().updateCurrenciesPerSecond()
            return true
        }
        return false
    }

    getAvailableUpgrades(level?:number): Array<UpgradeKing> {
        const lvl = level ? level : this.getLevel()
        const upgrades = this.getUpgrades()
        const availableUpgrades = upgrades.filter((upgrade)=> {
            const upgradeLvl = GameManager.getInstance().getVariable(upgrade.id).getValue()
            const isUnlocked = upgrade.isUnlocked(upgradeLvl, lvl)
            return isUnlocked
        })
        return availableUpgrades
    }

    getUpgrade(upgradeId: string): UpgradeKing {
        const searchedUpgrade = this.getUpgrades().filter((upgrade)=>{
            return upgrade.id===upgradeId
        })
        return searchedUpgrade[0]
    }

    getUpgrades():Array<UpgradeKing>{
        return [
            new UpgradeKingStandar(ids.upgradeProduct0A, baseUpgradeCostLove, ids.product0Level),
            new UpgradeKingStandar(ids.upgradeProduct1A, baseUpgradeCostLove, ids.product1Level),
            new UpgradeKingStandar(ids.upgradeProduct2A, baseUpgradeCostLove, ids.product2Level),
            new UpgradeKingStandar(ids.upgradeProduct4A, multiplyCurrencyBy(baseUpgradeCostLove,5), ids.product4Level)]
    }

    getUpgradeLevel(upgradeId: string) {
        const level = GameManager.getInstance().getVariable(upgradeId)?.getValue()
        return level ? level : 0
    }

    getUpgradeBonus(upgradeId: string, level?: number): number {
        const lvl:number = level ? level : this.getUpgradeLevel(upgradeId)
        const bonus = Number(this.getUpgrade(upgradeId).getBonus(lvl))
        return bonus
    }

    getProgress(): number{
        const progress = GameManager.getInstance().getVariable(ids.product2Progress).getValue()
        return progress
    }

    
}