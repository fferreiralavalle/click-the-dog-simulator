import { Product, Currency, CurrencySubscriber } from './Product'
import ids from '../VariableId';
import GameManager from '../GameManager'
import { addCurrency } from '../../utils/mathUtils';
import Decimal from 'break_infinity.js';
import { Park } from './Park';

export interface EventType{
    id: string,
    progressNeeded: number,
    baseReward: number,
    unlockLevel: number
}
export interface Upgrade {
    id: string
}
export interface UpgradeTier {
    upgrades: Upgrade[]
}
export interface UpgradeBase {
    baseBonus: number
}
export interface UpgradeTier1A extends UpgradeBase{}
export interface UpgradeTier1B extends UpgradeBase{}
export interface UpgradeTier1C extends UpgradeBase{}

export class Laboratory implements Product {
    currencySubscribers: Array<CurrencySubscriber>;
    variableId: string;
    isUnlocked: boolean;
    
    constructor(variableId: string, isUnlocked: boolean){
        this.variableId = variableId
        this.isUnlocked = isUnlocked
        this.onTimePassed = this.onTimePassed.bind(this)
        this.currencySubscribers = []
    }
    getCurrencyPerSecond(level?: number): Currency {
        const currencyUpgrade = this.getUpgradeBonus(ids.labUpgradeTier2C).baseBonus
        const currency:Currency = {
            currency: new Decimal(currencyUpgrade),
            treats: new Decimal(0)
        }
        return currency
    }
    getProgressPerSecond(level?: number): number {
        const baseProgress = 0
        const upgradeBonus = this.getUpgradeBonus(ids.labUpgradeTier1C)
        const progressPerSecond = baseProgress + upgradeBonus.baseBonus
        return progressPerSecond
    }

    getProgressGoal():number{
        const base = 100
        return base
    }

    onTimePassed(timePassed: number): Currency {
        const pps: number = this.getProgressPerSecond()
        let progress = this.getProgress();
        const goal = this.getProgressGoal()
        let totalCurrency:Currency = {currency:new Decimal(0),treats:new Decimal(0)}
        let currency:Currency = this.getCurrencyPerSecond()
        currency.currency.times(timePassed)
        while (progress >= goal){
            progress -= goal
            //Relic Bonus
            const park = GameManager.getInstance().productManager.getProduct(ids.product4Level) as Park
            const relic1CBonus = park.getRelicBonus(ids.relicTier1C)
            const relicBonus = (relic1CBonus!==0 ? relic1CBonus : 1)
            
            const currencyEvent:Currency = {
                currency: new Decimal(0),
                treats: new Decimal(1 * relicBonus)
            }
            totalCurrency = addCurrency(totalCurrency,currencyEvent)
            GameManager.getInstance().addToVariable(currencyEvent.treats,ids.treats)
            this.onCurrencyTime(currencyEvent)
        }
        GameManager.getInstance().setVariable(progress,ids.product2Progress)
        GameManager.getInstance().addToVariable(pps * timePassed,ids.product2Progress)
        GameManager.getInstance().addToVariable(currency.currency,ids.currency)
        totalCurrency = addCurrency(totalCurrency,currency)
        this.onCurrencyTime(currency)
        return totalCurrency
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
        const farmLevel:number = GameManager.getInstance().getVariable(ids.product1Level).getValue()
        const handsLevel:number = GameManager.getInstance().getVariable(ids.product0Level).getValue()
        const farmNeeded:number = 10
        const handsNeeded:number = 10
        return farmNeeded <= farmLevel && handsNeeded <= handsLevel
    }
    getLevelUpPrice(level?:number): Currency {
        const basePrice:number = 2;
        const initialPrice:number = 0;
        const lvl:number = level ? level : GameManager.getInstance().getVariable(this.variableId).getValue()
        const finalPrice = initialPrice + Math.pow(basePrice,1+Math.floor(lvl/3))
        return {
            currency: new Decimal(0),
            treats: new Decimal(finalPrice)
        };
    }
    canLevelUp(): boolean {
        const treats = GameManager.getInstance().getVariable(ids.treats).getValue()
        const levelUpPrice = this.getLevelUpPrice().treats
        return levelUpPrice.lte(treats)
    }
    levelUp(): boolean {
        const levelUpPrice = this.getLevelUpPrice().treats.mul(-1)
        if (this.canLevelUp()) {
            GameManager.getInstance().addToVariable(1, this.variableId)
            GameManager.getInstance().addToVariable(levelUpPrice, ids.treats)
            if (this.getLevel()===1){
                GameManager.getInstance().getNotificationManager().addNotification({
                    id:'lab-unlock',
                    background: 'https://i.imgur.com/icoqc1B.jpg',
                    description:'Thank you for the treats mister! Hover over my lab to pupgrade your buildings.',
                    image: 'https://i.imgur.com/mLU1yyE.png',
                    seen: false,
                    title: 'Lab Unlocked!'
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
    getUpgradePrice(upgradeId: string, plusLevels?:number): number{
        let finalPrice = 0
        const plusLvl = plusLevels ? plusLevels : 1
        const currentLevel = GameManager.getInstance().getVariable(upgradeId)?.getValue()
        for (let i=1;i<=plusLvl;i++){
            const requestedLevel = Math.max(i + (currentLevel ? currentLevel : 0),0)
            const points = this.getUpgradeSigleLevelCost(upgradeId, requestedLevel)
            finalPrice += points
        }
        return finalPrice
    }

    getUpgradeSigleLevelCost(upgradeId: string, requestedLevel: number){
        const points = 1 + Math.floor(requestedLevel/10)
        return points
    }

    getUpgradePointsTaken(upgradeId: string): number {
        const upgradeLevel = this.getUpgradeLevel(upgradeId)
        let totalPointsTaken = 0
        for (let i=1;i<=upgradeLevel;i++){
            totalPointsTaken += this.getUpgradeSigleLevelCost(upgradeId,i)
        }
        return totalPointsTaken
    }

    canBuyUpgrade(upgradeId: string, plusLevels:number): boolean {
        if (plusLevels<0) return true
        const points = this.getAvailablePoints()
        const price = this.getUpgradePrice(upgradeId,plusLevels)
        return points >= price
    }

    buyUpgrade(upgradeId: string, plusLevels?:number):boolean{
        const finalPlusLevels = plusLevels ? plusLevels : 1
        if (this.canBuyUpgrade(upgradeId,finalPlusLevels)){
            const upgradeLevel = this.getUpgradeLevel(upgradeId)
            const result = Math.max(upgradeLevel+plusLevels,0)
            GameManager.getInstance().setVariable(result, upgradeId)
            return true
        }
        return false
    }

    getAvailablePoints(level?:number):number {
        let points = this.getPoints(level)
        
        /* Tier 1 */
        points -= this.getUpgradePointsTaken(ids.labUpgradeTier1A)
        points -= this.getUpgradePointsTaken(ids.labUpgradeTier1B)
        points -= this.getUpgradePointsTaken(ids.labUpgradeTier1C)
        /* Tier 2 */
        points -= this.getUpgradePointsTaken(ids.labUpgradeTier2A)
        points -= this.getUpgradePointsTaken(ids.labUpgradeTier2B)
        points -= this.getUpgradePointsTaken(ids.labUpgradeTier2C)


        return points
    }

    getPoints(level?:number){
        let points = level ? level : GameManager.getInstance().getVariable(ids.product2Level).getValue()
        //Relics
        const park = GameManager.getInstance().productManager.getProduct(ids.product4Level) as Park
        const relic0ABonus = park.getRelicBonus(ids.relicTier0C)
        points = Math.floor(points * (relic0ABonus!==0 ? relic0ABonus : 1))
        return points
    }

    getAvaiableUpgrades(level?:number): Array<UpgradeTier> {
        const lvl = level ? level : this.getLevel()
        const upgradeTiers = [this.getTierXUpgrades(0)]
        if (lvl>=10){
            upgradeTiers.push(this.getTierXUpgrades(1))
        }
        return upgradeTiers;
    }

    getTierXUpgrades(tier:number):UpgradeTier{
        switch(tier){
            case 1:
                return {
                    upgrades: [{
                        id: ids.labUpgradeTier2A
                    },{
                        id: ids.labUpgradeTier2B
                    },{
                        id: ids.labUpgradeTier2C
                    }]
                }
            default:
                return {
                    upgrades: [{
                        id: ids.labUpgradeTier1A
                    },{
                        id: ids.labUpgradeTier1B
                    },{
                        id: ids.labUpgradeTier1C
                    }]
                }
        }
    }

    getUpgradeLevel(upgradeId: string) {
        const level = GameManager.getInstance().getVariable(upgradeId)?.getValue()
        return level ? level : 0
    }

    getUpgradeBonus(upgradeId: string, level?: number): UpgradeBase {
        let lvl:number = level ? level : this.getUpgradeLevel(upgradeId)
        if (lvl<0) lvl = 0
        let base = 0
        switch(upgradeId){
            /* TIER 2 */
            /* Treat Chance per Pet */
            case ids.labUpgradeTier2A:
                base = 0.975
                return {
                    baseBonus: 1 - Math.pow(base,lvl)
                }
            /* Farm double event bonus chance */
            case ids.labUpgradeTier2B:
                base = 0.975
                return {
                    baseBonus: 1 - Math.pow(base,lvl)
                }
            /* Gain love for each Farm and Pet lvl */
            case ids.labUpgradeTier2C:
                base = 0.25
                let petLvl = GameManager.getInstance().getVariable(ids.product0Level).getValue()
                let farmLvl = GameManager.getInstance().getVariable(ids.product1Level).getValue()
                return {
                    baseBonus: base * lvl * (petLvl + farmLvl)
                }
            /* Farm % Reduction*/
            case ids.labUpgradeTier1B:
                base = 0.96
                return {
                    baseBonus: Math.pow(base,lvl)
                }
            /* LAB treats */
            case ids.labUpgradeTier1C:
                base =  lvl!=0 ? 0.5 : 0
                return {
                    baseBonus: base * lvl
                }
            /* Pet Mastery */
            default:
                base = 1
                return {
                    baseBonus: base + 0.1 * lvl
                }

        }
    }

    getProgress(): number{
        const progress = GameManager.getInstance().getVariable(ids.product2Progress).getValue()
        return progress
    }

    
}