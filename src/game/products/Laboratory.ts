import { Product, Currency, CurrencySubscriber } from './Product'
import ids from '../VariableId';
import GameManager from '../GameManager'

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
        const base:number = 0;
        const currentLevel:number = level ? level : GameManager.getInstance().getVariable(this.variableId).getValue()
        const currencyPerSecond = base * currentLevel
        return {
            currency: currencyPerSecond,
            treats: 0
        }
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

    onTimePassed(timePassed: number): void {
        const pps: number = this.getProgressPerSecond()
        let progress = this.getProgress();
        const goal = this.getProgressGoal()
        while (progress >= goal){
            progress -= goal
            const currency:Currency = {
                currency: 0,
                treats: 1
            }
            GameManager.getInstance().addToVariable(currency.treats,ids.treats)
            this.onCurrencyTime(currency)
        }
        GameManager.getInstance().setVariable(progress,ids.product2Progress)
        GameManager.getInstance().addToVariable(pps * timePassed,ids.product2Progress)
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
        const farmNeeded:number = 5
        const handsNeeded:number = 10
        return farmNeeded <= farmLevel && handsNeeded <= handsLevel
    }
    getLevelUpPrice(level?:number): Currency {
        const basePrice:number = 2;
        const initialPrice:number = 0;
        const lvl:number = level ? level : GameManager.getInstance().getVariable(this.variableId).getValue()
        const finalPrice = initialPrice + Math.pow(basePrice,1+Math.floor(lvl/3))
        return {
            currency: 0,
            treats: finalPrice
        };
    }
    canLevelUp(): boolean {
        const treats = GameManager.getInstance().getVariable(ids.treats).getValue()
        const levelUpPrice = this.getLevelUpPrice().treats
        return levelUpPrice <= treats
    }
    levelUp(): boolean {
        const levelUpPrice = this.getLevelUpPrice().treats
        if (this.canLevelUp()) {
            GameManager.getInstance().addToVariable(1, this.variableId)
            GameManager.getInstance().addToVariable(-levelUpPrice, ids.treats)
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
        let points = level ? level : GameManager.getInstance().getVariable(this.variableId).getValue()
        /* Tier 1 */
        points -= this.getUpgradePointsTaken(ids.labUpgradeTier1A)
        points -= this.getUpgradePointsTaken(ids.labUpgradeTier1B)
        points -= this.getUpgradePointsTaken(ids.labUpgradeTier1C)
        return points
    }

    getPoints(level?:number){
        const lvl = level ? level : GameManager.getInstance().getVariable(ids.product2Level).getValue()
        return lvl
    }

    getAvaiableUpgrades(level?:number): Array<UpgradeTier> {
        const lvl = level ? level : this.getLevel()
        const upgradeTiers = [this.getTierXUpgrades(0)]
        return upgradeTiers;
    }

    getTierXUpgrades(tier:number):UpgradeTier{
        switch(tier){
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
            case ids.labUpgradeTier1B:
                base = lvl!=0 ? 0.7 : 0
                lvl = Math.pow(lvl,0.2)
                if (lvl<=0) lvl = 1
                return {
                    baseBonus: 1 - Math.pow(base,10/lvl)
                }
            /* LAB treats */
            case ids.labUpgradeTier1C:
                base =  lvl!=0 ? 0.25 : 0
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