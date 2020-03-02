import { Product, Currency, CurrencySubscriber } from './Product'
import variables from '../VariableId';
import GameManager from '../GameManager'

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
        progressNeeded: 200,
        baseReward: 2,
        unlockLevel: 5
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
        const currentLevel:number = GameManager.getInstance().getVariable(this.variableId).getValue()
        const baseProgress = currentLevel > 0 ? 1 : 0
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
        this.checkForEventDurations(timePassed)
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
                case events.pettingTraining.id:
                    reward.pettingTrainingReward = this.getPettingTrainingData()
                    let pts = GameManager.getInstance().getVariable(variables.product1EventPettingTrainingDurations).getValue() as Array<PetTrainingVariable>
                    pts = pts ? pts : []
                    pts.push({
                        duration: reward.pettingTrainingReward.duration
                    })
                    GameManager.getInstance().setVariable(pts, variables.product1EventPettingTrainingDurations)
                    console.log("Party Bonus added",pts, reward)
                    break
                default:
                    reward.currencyReward = this.getEventReward(event.id).currencyReward
                    break
                }
            GameManager.getInstance().addToVariable(reward.currencyReward.currency, variables.currency)
            GameManager.getInstance().addToVariable(-goal, variables.product1Progress)
            this.onReward(reward)
        }
    }

    /** Handles the duration of event that generate lasting effect when completed */
    checkForEventDurations(timePassed: number){
        //Training
        let ptDurations = GameManager.getInstance().getVariable(variables.product1EventPettingTrainingDurations)?.getValue() as Array<PetTrainingVariable>
        ptDurations = ptDurations ? ptDurations : []
        const newPtDurations = ptDurations?.filter((pt)=>{
            pt.duration = pt.duration - timePassed
            return pt.duration > 0
        })
        GameManager.getInstance().setVariable(newPtDurations, variables.product1EventPettingTrainingDurations)
    }
    /** Gets the rewards the event gives once completed */    
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
        const goal = this.getEvent().progressNeeded
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

    getAvailableEvents(currentLevel?: number){
        const level = currentLevel ? currentLevel : this.getLevel()
        const availableEvents:EventType[] = []
        if (events.bellyRub.unlockLevel <= level){
            availableEvents.push(events.bellyRub)
        }
        if (events.pettingTraining.unlockLevel <= level){
            availableEvents.push(events.pettingTraining)
        }
        return availableEvents
    }

    getPettingTrainingData(currentLevel?: number): PettingTrainingData{
        const level = currentLevel ? currentLevel : this.getLevel()
        const petMultiplier = events.pettingTraining.baseReward*(1+0.25*level)
        const duration = 8
        return {
            petMultiplier,
            duration
        }
    }

    getPettingTrainingCurrentBonus(): number {
        let pts = GameManager.getInstance().getVariable(variables.product1EventPettingTrainingDurations)?.getValue() as Array<PetTrainingVariable>
        pts = pts ? pts : []
        const trainingDataBase:PettingTrainingData = this.getPettingTrainingData()
        const petMult = trainingDataBase.petMultiplier ** pts.length
        return petMult
    }

    getLevel(): number { return GameManager.getInstance().getVariable(this.variableId).getValue()}
    
}