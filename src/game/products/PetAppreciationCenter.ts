import { Product, Currency, CurrencySubscriber } from './Product'
import variables from '../VariableId';
import GameManager from '../GameManager'

export interface EventType{
    id: string,
    progressNeeded: number,
    baseReward: number
}

export interface EventTypes {
    [key: string]: EventType
}

export const events:EventTypes = {
    bellyRub: {
        id: 'bellyRub',
        progressNeeded: 60,
        baseReward: 100,
    }
}

export interface RewardSubscribers {
    id: string,
    onReward: (result: RewardResult) => void
}

export interface RewardResult {
    currencyReward: Currency
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
    getCurrencyPerSecond(): Currency {
        const base:number = 1;
        const currentLevel:number = GameManager.getInstance().getVariable(this.variableId).getValue()
        const currencyPerSecond = base * currentLevel
        return {
            currency: currencyPerSecond,
            treats: 0
        }
    }
    getProgressPerSecond(): number {
        const baseProgress = 1
        const currentLevel:number = GameManager.getInstance().getVariable(this.variableId).getValue()
        const progressPerSecond = baseProgress * ((1+currentLevel)/2)
        return progressPerSecond
    }
    onTimePassed(timePassed: number): void {
        let add:Currency = this.getCurrencyPerSecond();
        const pps: number = this.getProgressPerSecond()
        add.currency *=  timePassed
        GameManager.getInstance().addToVariable(add.currency,variables.currency)
        GameManager.getInstance().addToVariable(pps * timePassed,variables.product1Progress)
        this.checkForProgressCompletion()
        this.onCurrencyTime(add)
    }
    
    checkForProgressCompletion(){
        const goal = this.getProgressGoal();
        const progress = GameManager.getInstance().getVariable(variables.product1Progress).getValue()
        if (progress >= goal){
            const event = this.getEvent()
            let reward:RewardResult = {
                currencyReward: {currency:0, treats: 0}
            }
            switch(event.id){
                default:
                    reward.currencyReward = this.getEventReward(event.id).currencyReward
                }
            GameManager.getInstance().addToVariable(reward.currencyReward.currency, variables.currency)
            GameManager.getInstance().addToVariable(-goal, variables.product1Progress)
            this.onReward(reward)
            }
        }
        
        getEventReward(eventId:string,level?:number):RewardResult{
            const finalLevel = level ? level : this.getLevel()
            const event = this.getEvent(eventId)
            switch (event.id){
                default:
                    return {
                        currencyReward: {
                            currency: this.getEvent(eventId).baseReward * (1 + 0.5 * finalLevel),
                            treats: 0
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
        const previousProductLevel:number = GameManager.getInstance().getVariable(variables.product0Level).getValue()
        const needdedLevel:number = 3
        return needdedLevel <= previousProductLevel 
    }
    getLevelUpPrice(): Currency {
        const basePrice:number = 15;
        const currentLevel:number = GameManager.getInstance().getVariable(this.variableId).getValue()
        const finalPrice = Math.pow(basePrice,currentLevel/2+1)
        return {
            currency: finalPrice,
            treats: 0
        };
        
    }
    canLevelUp(): boolean {
        const currency = GameManager.getInstance().getVariable(variables.currency).getValue()
        const levelUpPrice = this.getLevelUpPrice().currency
        return levelUpPrice < currency
    }
    levelUp(): boolean {
        const levelUpPrice = this.getLevelUpPrice().currency
        if (this.canLevelUp()) {
            GameManager.getInstance().addToVariable(1, this.variableId)
            GameManager.getInstance().addToVariable(-levelUpPrice, variables.currency)
            return true
        }
        else {
            return false;
        }
    }

    getProgress(): number{
        const progress = GameManager.getInstance().getVariable(variables.product1Progress).getValue()
        return progress
    }

    getProgressGoal(): number {
        const event = GameManager.getInstance().getVariable(variables.product1Event).getValue()
        const goal = events[event].progressNeeded
        return goal
    }

    getEvent(eventId?: string):EventType{
        let finalEventId = eventId ? eventId : GameManager.getInstance().getVariable(variables.product1Event).getValue()
        let event = events[finalEventId]
        if (!event){
            GameManager.getInstance().setVariable(events.bellyRub.id, variables.product1Event)
            event = GameManager.getInstance().getVariable(variables.product1Event).getValue()
        }
        return event
    }

    getLevel(): number { return GameManager.getInstance().getVariable(this.variableId).getValue()}
    
}