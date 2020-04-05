import { Product, Currency, CurrencySubscriber } from './Product'
import ids from '../VariableId';
import GameManager from '../GameManager'
import { Laboratory } from './Laboratory';
import { addCurrency, multiplyCurrencyBy } from '../../utils/mathUtils';
import Decimal from 'break_infinity.js';
import { Park } from './Park';
import { King } from './UpgradeKing';
import { Tree } from './Tree';

export interface EventType{
    id: string,
    progressNeeded: number,
    baseReward: number,
    unlockLevel: number
}

export interface EventTypes {
    [key: string]: EventType
}

export const events:EventTypes = {
    bellyRub: {
        id: 'bellyRub',
        progressNeeded: 60,
        baseReward: 100,
        unlockLevel: 0,
    },
    pettingTraining: {
        id: 'pettingTraining',
        progressNeeded: 480,
        baseReward: 5,
        unlockLevel: 20
    },
    donationCampaign: {
        id: 'donationCampaign',
        progressNeeded: 120,
        baseReward: 1,
        unlockLevel: 10
    }

}

export interface RewardSubscribers {
    id: string,
    onReward: (result: RewardResult) => void
}

export interface RewardResult {
    currencyReward: Currency,
    pettingTrainingReward?: PettingTrainingData
}

export interface PettingTrainingData {
    petMultiplier: number,
    duration: number
}

export interface PetTrainingVariable {
    duration: number
}

export class PetAppreciationCenter implements Product {
    currencySubscribers: Array<CurrencySubscriber>;
    variableId: string;
    isUnlocked: boolean;
    subscribers: Array<RewardSubscribers>
    currencyPerSecond: Currency;
    
    constructor(variableId: string, isUnlocked: boolean){
        this.variableId = variableId
        this.isUnlocked = isUnlocked
        this.onTimePassed = this.onTimePassed.bind(this)
        this.currencySubscribers = []
        this.subscribers = []
        this.currencyPerSecond = {currency:new Decimal(0), treats: new Decimal(0)}
    }
    getCurrencyPerSecond(): Currency {
        return this.currencyPerSecond
    }

    updateCurrencyPerSecond(level?: number, dontApply:boolean=false): Currency {
        const base:number = 1;
        const currentLevel:number = Number(level ? level : GameManager.getInstance().getVariable(this.variableId).getValue())
        // Relics
        const park = GameManager.getInstance().productManager.getProduct(ids.product4Level) as Park
        const relic0EBonus = park.getRelicBonus(ids.relicTier0E)
        const relic1EBonus = park.getRelicBonus(ids.relicTier1E)
        const relic2EBonus = park.getRelicBonus(ids.relicTier2E)
        // King Upgrade Bonus
        const king = GameManager.getInstance().productManager.getProduct(ids.upgradeShop) as King
        const kingBonus = king.getUpgradeBonus(ids.upgradeProduct1A)
        // Tree Blessing
        const tree = GameManager.getInstance().getProductManager().getProduct(ids.treeOfGoodBoys) as Tree
        const blessing0C:number = tree.getBlessing(ids.blessing0C).getBonus()
        //Final
        const currencyPerSecond = new Decimal(base).mul(currentLevel).mul(relic0EBonus).mul(relic1EBonus).mul(relic2EBonus).mul(kingBonus).mul(blessing0C)
        const newCurrencyPerSecond = {
            currency: currencyPerSecond,
            treats: new Decimal(0)
        }
        if (!dontApply){
            this.currencyPerSecond = newCurrencyPerSecond
        }
        return newCurrencyPerSecond
    }
    getProgressPerSecond(level?: number): number {
        const currentLevel:number = level ? level : GameManager.getInstance().getVariable(this.variableId).getValue()
        const baseProgress = !currentLevel ? 0 : 1
        // Tree Blessing
        const tree = GameManager.getInstance().getProductManager().getProduct(ids.treeOfGoodBoys) as Tree
        const blessing1B:number = tree.getBlessing(ids.blessing1B).getBonus()
        const progressPerSecond = (baseProgress + currentLevel/2) * blessing1B
        return progressPerSecond
    }
    onTimePassed(timePassed: number): Currency {
        const cps:Currency = this.getCurrencyPerSecond();
        const add:Currency = multiplyCurrencyBy(cps,timePassed)
        const pps: number = this.getProgressPerSecond()
        GameManager.getInstance().addToVariable(add.currency,ids.currency)
        GameManager.getInstance().addToVariable(pps * timePassed,ids.product1Progress)
        this.checkForEventDurations(timePassed)
        const eventCurrency = this.checkForProgressCompletion()
        this.onCurrencyTime(add)
        return addCurrency(add,eventCurrency)
    }
    
    checkForProgressCompletion(): Currency{
        let totalCurrency:Currency = {currency:new Decimal(0),treats:new Decimal(0)}
        const goal = this.getProgressGoal();
        let progress = GameManager.getInstance().getVariable(ids.product1Progress).getValue()
        while (progress >= goal){
            const event = this.getEvent()
            const lab = GameManager.getInstance().getProductManager().getProduct(ids.product2Level) as Laboratory
            const criticalChange = lab.getUpgradeBonus(ids.labUpgradeTier2B).baseBonus
            const isCritical = Math.random() < criticalChange
            let reward:RewardResult = {
                currencyReward: this.getEventReward(event.id).currencyReward
            }
            switch(event.id){
                case events.pettingTraining.id:
                    reward.pettingTrainingReward = this.getPettingTrainingData()
                    let pts = GameManager.getInstance().getVariable(ids.product1EventPettingTrainingDurations).getValue() as Array<PetTrainingVariable>
                    pts = pts ? pts : []
                    const petReward = {
                        duration: reward.pettingTrainingReward.duration
                    }
                    pts.push(petReward)
                    if (isCritical){
                        pts.push(petReward)
                    }
                    GameManager.getInstance().setVariable(pts, ids.product1EventPettingTrainingDurations)
                    GameManager.getInstance().getProductManager().updateCurrenciesPerSecond()
                    setTimeout(()=>{
                        GameManager.getInstance().getProductManager().updateCurrenciesPerSecond()
                    }, reward.pettingTrainingReward.duration+100)
                    break
                default:
                    break
                }
            progress -= goal
            GameManager.getInstance().addToVariable(reward.currencyReward.currency, ids.currency)
            GameManager.getInstance().addToVariable(reward.currencyReward.treats, ids.treats)
            GameManager.getInstance().setVariable(progress, ids.product1Progress)
            this.onReward(reward)
            totalCurrency = addCurrency(reward.currencyReward,totalCurrency)
            if (isCritical){
                GameManager.getInstance().addToVariable(reward.currencyReward.currency, ids.currency)
                GameManager.getInstance().addToVariable(reward.currencyReward.treats, ids.treats)
                this.onReward(reward)
                totalCurrency = addCurrency(reward.currencyReward,totalCurrency)
            }
        }
        return totalCurrency
    }

    /** Handles the duration of event that generate lasting effect when completed */
    checkForEventDurations(timePassed: number){
        //Training
        let ptDurations = GameManager.getInstance().getVariable(ids.product1EventPettingTrainingDurations)?.getValue() as Array<PetTrainingVariable>
        ptDurations = ptDurations ? ptDurations : []
        const newPtDurations = ptDurations?.filter((pt)=>{
            pt.duration = pt.duration - timePassed
            return pt.duration > 0
        })
        GameManager.getInstance().setVariable(newPtDurations, ids.product1EventPettingTrainingDurations)
        if (newPtDurations.length != ptDurations.length){
            GameManager.getInstance().getProductManager().updateCurrenciesPerSecond()
        }
    }
    /** Gets the rewards the event gives once completed */    
    getEventReward(eventId:string,level?:number):RewardResult{
        const finalLevel = level ? level : this.getLevel()
        const event = this.getEvent(eventId)
        const park = GameManager.getInstance().productManager.getProduct(ids.product4Level) as Park
        let relicBonus = 1
        switch (event.id){
            case events.donationCampaign.id:
                const relicTier2B = park.getRelicBonus(ids.relicTier2B)
                return {
                    currencyReward: {
                        currency: new Decimal(0),
                        treats: new Decimal(this.getEvent(eventId).baseReward + Math.floor(finalLevel/5-2)).mul(relicTier2B),
                    }
                }
            default:
                //Relics
                const relic0BBonus = park.getRelicBonus(ids.relicTier0B)
                const relicBonusCurrency = this.getCurrencyPerSecond().currency.mul(relic0BBonus)
                return {
                    currencyReward: {
                        currency: new Decimal(this.getEvent(eventId).baseReward).add(relicBonusCurrency).mul(1 + 0.5 * finalLevel),
                        treats: new Decimal(0)
                    }
            }
        }
    }
        
    subscribeToReward(subscriber:RewardSubscribers){
        const alreadySubscribed = !this.subscribers.filter(sub => sub.id === subscriber.id)
        if (!alreadySubscribed){
            this.subscribers.push(subscriber)
            console.log("Subscribed to Farm: ", subscriber.id)
        }
    }
    
    subscribeToCurrency(cs: CurrencySubscriber): void {
        const alreadySubscribed = !this.currencySubscribers.filter(sub => sub.id === cs.id)
        if (!alreadySubscribed){
            this.currencySubscribers.push(cs)
            console.log("Subscribed to Farm: ", cs.id)
        }
    }
    onReward(result:RewardResult){
        this.subscribers.forEach((sub)=>{
            sub.onReward(result)
        })
    }

    onCurrencyTime(currency: Currency){
        this.currencySubscribers.forEach((sub)=>{
            sub.onCurrency(currency)
        })
    }

    canUnlock(): boolean{
        const previousProductLevel:number = GameManager.getInstance().getVariable(ids.product0Level).getValue()
        const needdedLevel:number = 5
        return needdedLevel <= previousProductLevel 
    }
    getLevelUpPrice(): Currency {
        const basePrice:number = 13;
        const initialPrice:number = 17;
        const currentLevel:number = GameManager.getInstance().getVariable(this.variableId).getValue()
        const tree = GameManager.getInstance().getProductManager().getProduct(ids.treeOfGoodBoys) as Tree
        const discount:number = tree.getBlessing(ids.blessing0A).getBonus()
        const finalPrice = new Decimal(initialPrice).add(basePrice * currentLevel).add(Math.pow(basePrice,currentLevel/4+1))
        return {
            currency: new Decimal(finalPrice).mul(discount),
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
        if (this.canLevelUp()) {
            GameManager.getInstance().addToVariable(1, this.variableId)
            GameManager.getInstance().addToVariable(levelUpPrice, ids.currency)
            GameManager.getInstance().getProductManager().updateCurrenciesPerSecond()
            if (this.getLevel()===1){
                GameManager.getInstance().getNotificationManager().addNotification({
                    id:'pet-farm-unlock',
                    background: 'https://i.imgur.com/G0KXJDf.jpg',
                    description:'Hello good sir, my farm can prepare events that give BIG bonuses. You can choose a new event at level 10.',
                    image: 'https://i.imgur.com/L1eHWfM.png',
                    seen: false,
                    title: 'Farm Unlocked!'
                  })
            }
            return true
        }
        else {
            return false;
        }
    }

    getProgress(): number{
        const progress = GameManager.getInstance().getVariable(ids.product1Progress).getValue()
        return progress
    }

    getProgressGoal(): number {
        //Lab Bonus
        const lab = GameManager.getInstance().getProductManager().getProduct(ids.product2Level) as Laboratory
        const labMult = lab.getUpgradeBonus(ids.labUpgradeTier1B).baseBonus
        //Relic Bonus
        const park = GameManager.getInstance().productManager.getProduct(ids.product4Level) as Park
        const relic1BBonus = park.getRelicBonus(ids.relicTier1B)
        const relicBonus = (relic1BBonus!==0 ? relic1BBonus : 1)
        //Final Goal
        const goal = this.getEvent().progressNeeded * labMult * relicBonus
        return goal
    }

    getEvent(eventId?: string):EventType{
        let finalEventId = eventId ? eventId : GameManager.getInstance().getVariable(ids.product1Event).getValue()
        let event = events[finalEventId]
        if (!event){
            GameManager.getInstance().setVariable(events.bellyRub.id, ids.product1Event)
            event = GameManager.getInstance().getVariable(ids.product1Event).getValue()
        }
        return event
    }

    getAvailableEvents(currentLevel?: number){
        const level = currentLevel ? currentLevel : this.getLevel()
        const availableEvents:EventType[] = []
        if (events.bellyRub.unlockLevel <= level){
            availableEvents.push(events.bellyRub)
        }
        if (events.donationCampaign.unlockLevel <= level){
            availableEvents.push(events.donationCampaign)
        }
        if (events.pettingTraining.unlockLevel <= level){
            availableEvents.push(events.pettingTraining)
        }
        return availableEvents
    }

    getPettingTrainingData(currentLevel?: number): PettingTrainingData{
        const level = currentLevel ? currentLevel : this.getLevel()
        const petMultiplier = events.pettingTraining.baseReward*(1+0.1*level)
        const duration = 4
        return {
            petMultiplier,
            duration
        }
    }

    getPettingTrainingCurrentBonus(): number {
        let pts = GameManager.getInstance().getVariable(ids.product1EventPettingTrainingDurations)?.getValue() as Array<PetTrainingVariable>
        pts = pts ? pts : []
        const trainingDataBase:PettingTrainingData = this.getPettingTrainingData()
        const petMult = 1 + trainingDataBase.petMultiplier * pts.length
        return petMult
    }

    getLevel(): number { return GameManager.getInstance().getVariable(this.variableId).getValue()}
    
}