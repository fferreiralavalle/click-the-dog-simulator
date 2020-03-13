import { Product, Currency, CurrencySubscriber } from './Product'
import ids from '../VariableId';
import GameManager from '../GameManager'
import { Laboratory } from './Laboratory';
import { addCurrency } from '../../utils/mathUtils';
import Decimal from 'break_infinity.js';
import { Park } from './Park';

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
        baseReward: 4,
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
    
    constructor(variableId: string, isUnlocked: boolean){
        this.variableId = variableId
        this.isUnlocked = isUnlocked
        this.onTimePassed = this.onTimePassed.bind(this)
        this.currencySubscribers = []
        this.subscribers = []
    }
    getCurrencyPerSecond(level?: number): Currency {
        const base:number = 1;
        const currentLevel:number = Number(level ? level : GameManager.getInstance().getVariable(this.variableId).getValue())
        const currencyPerSecond = new Decimal(base).times(currentLevel)
        return {
            currency: currencyPerSecond,
            treats: new Decimal(0)
        }
    }
    getProgressPerSecond(level?: number): number {
        const currentLevel:number = level ? level : GameManager.getInstance().getVariable(this.variableId).getValue()
        const baseProgress = !currentLevel ? 0 : 1
        const progressPerSecond = baseProgress + currentLevel/2
        return progressPerSecond
    }
    onTimePassed(timePassed: number): Currency {
        let add:Currency = this.getCurrencyPerSecond();
        const pps: number = this.getProgressPerSecond()
        add.currency = add.currency.mul(timePassed)
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
    }
    /** Gets the rewards the event gives once completed */    
    getEventReward(eventId:string,level?:number):RewardResult{
        const finalLevel = level ? level : this.getLevel()
        const event = this.getEvent(eventId)
        const park = GameManager.getInstance().productManager.getProduct(ids.product4Level) as Park
        let relicBonus = 1
        switch (event.id){
            case events.donationCampaign.id:
                return {
                    currencyReward: {
                        currency: new Decimal(0),
                        treats: new Decimal(this.getEvent(eventId).baseReward + Math.floor(finalLevel/5-2)),
                    }
                }
            default:
                //Relics
                const relic0BBonus = park.getRelicBonus(ids.relicTier0B)
                relicBonus = (relic0BBonus!==0 ? relic0BBonus : 1)
                return {
                    currencyReward: {
                        currency: new Decimal(this.getEvent(eventId).baseReward * (1 + 0.5 * finalLevel) * relicBonus),
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
        const finalPrice = initialPrice + basePrice * currentLevel + Math.pow(basePrice,currentLevel/4+1)
        return {
            currency: new Decimal(finalPrice),
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
        const petMultiplier = events.pettingTraining.baseReward*(1+0.25*level)
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
        const petMult = trainingDataBase.petMultiplier ** pts.length
        return petMult
    }

    getLevel(): number { return GameManager.getInstance().getVariable(this.variableId).getValue()}
    
}