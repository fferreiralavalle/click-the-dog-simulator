import { Product, Currency, CurrencySubscriber } from './Product'
import ids from '../VariableId';
import GameManager from '../GameManager'
import { Laboratory } from './Laboratory';
import { addCurrency } from '../../utils/mathUtils';
import Decimal from 'break_infinity.js';
import { getRelicText } from '../../utils/textUtil';

export interface EventType{
    id: string,
    secondsNeeded: number,
    unlockLevel: number,
    price: Currency
}

export interface EventTypes {
    pupsloration: EventType
    dogsploration: EventType
    bigBoysploration: EventType
    [key: string]: EventType
}

export const events:EventTypes = {
    pupsloration: {
        id: 'pupsloration',
        secondsNeeded: 300,
        unlockLevel: 0,
        price: {currency: new Decimal(0),treats:new Decimal(10)}
    },
    dogsploration: {
        id: 'dogsploration',
        secondsNeeded: 900,
        unlockLevel: 10,
        price: {currency:new Decimal(0),treats:new Decimal(100)}
    },
    bigBoysploration: {
        id: 'bigbBoysploration',
        secondsNeeded: 3600,
        unlockLevel: 20,
        price: {currency:new Decimal(0),treats:new Decimal(1000)}
    }
}

export interface Relic {
    id: string,
    base: number,
    icon?: string
}

export interface RelicTier {
    unlockLevel: number
    relics: Array<Relic>
}

export interface RelicTiers{
    tier0: RelicTier
    tier1: RelicTier
    tier2: RelicTier
}

export interface RelicTierSlots {
    availableSlots: number
    equippedRelics: Array<string>
}

export interface RelicTiersSlots {
    tier0: RelicTierSlots
    tier1: RelicTierSlots
    tier2: RelicTierSlots
}

export interface AvailableSlots {
    tier0: number
    tier1: number
    tier2: number
}

export interface RewardSubscribers {
    id: string,
    onReward: (result: RewardResult) => void
}

export interface RewardResult {
    currencyReward: Currency,
    relicReward?: Relic
}

export class Park implements Product {
    currencySubscribers: Array<CurrencySubscriber>;
    questSubscribers: Array<RewardSubscribers>
    variableId: string;
    isUnlocked: boolean;
    
    constructor(variableId: string, isUnlocked: boolean){
        this.variableId = variableId
        this.isUnlocked = isUnlocked
        this.onTimePassed = this.onTimePassed.bind(this)
        this.currencySubscribers = []
        this.questSubscribers = []
    }

    getCurrencyPerSecond(level?: number): Currency {
        const currentLevel:number = level ? level : GameManager.getInstance().getVariable(this.variableId).getValue()
        const relics = this.getRelicsUnlockedAmount()
        const currencyPerRelic = this.getCurrencyPerRelic(currentLevel)
        const currencyPerSecond:Currency = {
            currency: currencyPerRelic.currency.mul(relics),
            treats: currencyPerRelic.treats.mul(relics)
        }
        return currencyPerSecond
    }

    getCurrencyPerRelic(level?:number):Currency{
        const currentLevel:number = level ? level : GameManager.getInstance().getVariable(this.variableId).getValue()
        const base = 1
        const total = base * currentLevel
        return {
            currency: new Decimal(total),
            treats: new Decimal(0)
        }
    }

    getProgressPerSecond(level?: number): number {
        const tick = GameManager.getInstance().getTimeManager().getTickTime()
        return tick
    }

    onTimePassed(timePassed: number): Currency {
        let add:Currency = this.getCurrencyPerSecond();
        const pps: number = this.getProgressPerSecond()
        add.currency = add.currency.mul(timePassed)
        if (this.isEventUnlocked(events.pupsloration)){
            GameManager.getInstance().addToVariable(pps, ids.product4Tier0Progress)
        }
        if (this.isEventUnlocked(events.dogsploration)){
            GameManager.getInstance().addToVariable(pps, ids.product4Tier1Progress)
        }
        if (this.isEventUnlocked(events.bigBoysploration)){
            GameManager.getInstance().addToVariable(pps, ids.product4Tier2Progress)
        }
        GameManager.getInstance().addCurrency(add)
        this.onCurrencyTime(add)
        return add
    }
    
    isEventReady(eventId: string): boolean{
        const event = events[eventId]
        if (!event){ 
            return false
        }
        let timePassed = this.getEventTimePassed(eventId)
        let eventGoal = event.secondsNeeded
        return timePassed >= eventGoal
    }

    claimEventReward(eventId:string){
        const event = this.getEvent(eventId)
        if (this.isEventReady(event.id) && this.canPayReward(event.id)){
            const reward = this.getEventReward(event.id)
            GameManager.getInstance().addCurrency(reward.currencyReward)
            if (reward.relicReward){
                GameManager.getInstance().setVariable(1,reward.relicReward.id)
            }
            GameManager.getInstance().addToVariable(-event.price.treats, ids.treats)
            this.resetEventTime(eventId)
            this.onReward(reward)
        }
    }

    canPayReward(eventId: string){
        const event = this.getEvent(eventId)
        const price = event.price
        const treats = GameManager.getInstance().getVariable(ids.treats).getValue()
        return price.treats.lte(treats)
    }

    /** Gets the rewards the event gives once completed */    
    getEventReward(eventId:string,level?:number):RewardResult{
        const lvl = level ? level : this.getLevel()
        const event = this.getEvent(eventId)
        const lockedRelics = this.getAllLockedRelics(lvl)
        const random:number = Math.random()
        const relicChance = this.getRelicChance(lvl)
        let reward:RewardResult = {
            currencyReward: {currency:new Decimal(0),treats:new Decimal(0)}
        }
        let relics = []
        const randomRewardChange = Math.random()
        switch (event.id){
            /* Tier 2 */
            case events.bigBoysploration.id:
                relics = lockedRelics.tier2.relics
                if(relics.length>0 && random<relicChance){
                    const randomIndex:number = Math.floor(Math.random() * relics.length)
                    reward.relicReward = relics[randomIndex]
                    this.sendRelicNotification(relics[randomIndex])
                    return reward
                }
                if (randomRewardChange<0.5){
                    reward.currencyReward.patiencePoints = new Decimal(12)
                    GameManager.getInstance().unlockTimeWizard()
                }else{
                    reward.currencyReward.treats = new Decimal(event.price.treats.mul(2))
                }
                return reward
            /* Tier 1 */
            case events.dogsploration.id:
                relics = lockedRelics.tier1.relics
                if(relics.length>0 && random<relicChance){
                    const randomIndex:number = Math.floor(Math.random() * relics.length)
                    reward.relicReward = relics[randomIndex]
                    this.sendRelicNotification(relics[randomIndex])
                    return reward
                }
                if (randomRewardChange<0.5){
                    reward.currencyReward.patiencePoints = new Decimal(6)
                    GameManager.getInstance().unlockTimeWizard()
                }else{
                    reward.currencyReward.treats = new Decimal(event.price.treats.mul(2))
                }
                return reward
            /* Tier 0 */
            default:
                relics = lockedRelics.tier0.relics
                if(relics.length>0 && random<relicChance){
                    const randomIndex:number = Math.floor(Math.random() * relics.length)
                    reward.relicReward = relics[randomIndex]
                    this.sendRelicNotification(relics[randomIndex])
                    return reward
                }
                if (randomRewardChange<0.5){
                    reward.currencyReward.patiencePoints = new Decimal(3)
                    GameManager.getInstance().unlockTimeWizard()
                }else{
                    reward.currencyReward.treats = new Decimal(event.price.treats.mul(2))
                }
                return reward
        }
    }

    sendRelicNotification(relic: Relic){
        GameManager.getInstance().getNotificationManager().addNotification({
            id:'relic-unlocked-'+relic.id,
            background: "https://i.imgur.com/uenbC1V.jpg",
            description:"Your pets found a new Relic. Hooray! Its effect says: "+getRelicText(relic.id).description,
            image: relic.icon ? relic.icon : "",
            seen: false,
            title: 'New Relic found! - '+getRelicText(relic.id).title
          })
    }

    getRelicChance(level?:number):number{
        const lvl = level ? level : this.getLevel()
        const base = 0.95
        const total = 1.15 - Math.pow(base,lvl/5)
        return total
    }
    
    subscribeToCurrency(cs: CurrencySubscriber): void {
        const alreadySubscribed = !this.currencySubscribers.filter(sub => sub.id === cs.id)
        if (!alreadySubscribed){
            this.currencySubscribers.push(cs)
            console.log("Subscribed to Park: ", cs.id)
        }
    }
    subscribeToReward(rs: RewardSubscribers): void {
        const alreadySubscribed = !this.questSubscribers.filter(sub => sub.id === rs.id)
        if (!alreadySubscribed){
            this.questSubscribers.push(rs)
            console.log("Subscribed to Park: ", rs.id)
        }
    }
    onReward(result:RewardResult){
        this.questSubscribers.forEach(subs => {
            subs.onReward(result)
        });
    }

    onCurrencyTime(currency: Currency){
        this.currencySubscribers.forEach((sub)=>{
            sub.onCurrency(currency)
        })
    }

    canUnlock(): boolean{
        const previousProductLevel:number = GameManager.getInstance().getVariable(ids.product2Level).getValue()
        const needdedLevel:number = 10
        return needdedLevel <= previousProductLevel 
    }

    getLevelUpPrice(): Currency {
        const basePrice:Decimal = new Decimal(25);
        const initialPrice:Decimal = new Decimal(475);
        const currentLevel:Decimal = new Decimal(Number(GameManager.getInstance().getVariable(this.variableId).getValue()))
        const finalPrice:Decimal = initialPrice.add(basePrice.multiply(currentLevel)).add(basePrice.pow(currentLevel.div(4).add(1)))
        return {
            currency: finalPrice,
            treats: new Decimal(0)
        };
    }
    canLevelUp(): boolean {
        const currency = new Decimal(Number(GameManager.getInstance().getVariable(ids.currency).getValue()))
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
                    id:'pet-park-unlock',
                    background: 'https://i.imgur.com/uenbC1V.jpg',
                    description:"Bow before me TINY HUMAN. I, the mightiest of dragons, require your strongest pets for a Mission!",
                    image: 'https://i.imgur.com/QJ3nDVL.png',
                    seen: false,
                    title: 'THE LAND OF HEROES (the park) IS UNLOCKED!'
                  })
            }
            return true
        }
        else {
            return false;
        }
    }

    getEventTimePassed(eventId:string):number{
        if (eventId===events.dogsploration.id){
            return GameManager.getInstance().getVariable(ids.product4Tier1Progress).getValue()
        }
        else if (eventId===events.bigBoysploration.id){
            return GameManager.getInstance().getVariable(ids.product4Tier2Progress).getValue()
        }
        return GameManager.getInstance().getVariable(ids.product4Tier0Progress).getValue()
    }

    resetEventTime(eventId:string){
        if (eventId===events.dogsploration.id){
            GameManager.getInstance().setVariable(0,ids.product4Tier1Progress)
        }
        else if (eventId===events.bigBoysploration.id){
            GameManager.getInstance().setVariable(0,ids.product4Tier2Progress)
        }
        else{
            GameManager.getInstance().setVariable(0,ids.product4Tier0Progress)
        }
    }

    getEvents():EventTypes{
        return events
    }

    getEvent(id?: string):EventType{
        let event = id ? events[id] : undefined
        if (!event){
            return events.pupsloration
        }
        return event
    }

    isEventUnlocked(event:EventType, currentLevel?:number){
        const lvl = currentLevel ? currentLevel : this.getLevel()
        return event.unlockLevel <= lvl
    }

    getAllRelics(currenLevel?:number):RelicTiers {
        let tiers: RelicTiers = {
            tier0: {
                unlockLevel: events.pupsloration.unlockLevel,
                relics: [
                {id: ids.relicTier0A, base: 5, icon: 'https://i.imgur.com/DDm6ODQ.png'},
                {id: ids.relicTier0B, base: 1.5, icon: 'https://i.imgur.com/0ZjGB7A.png'},
                {id: ids.relicTier0C, base: 1.5, icon: 'https://i.imgur.com/qsbjSn1.png'}
            ]},
            tier1: {
                unlockLevel: events.dogsploration.unlockLevel,
                relics: [
                    {id: ids.relicTier1A, base: 1.25, icon: 'https://i.imgur.com/hfmuVYh.png'},
                    {id: ids.relicTier1B, base: 0.9, icon: 'https://i.imgur.com/et49ttP.png'},
                    {id: ids.relicTier1C, base: 2, icon: 'https://i.imgur.com/d3CJRvY.png'}
                ]
            },
            tier2: {
                unlockLevel: events.bigBoysploration.unlockLevel,
                relics: [
                    /*{id: ids.relicTier2A, base: 1},
                    {id: ids.relicTier2B, base: 1},
                    {id: ids.relicTier2C, base: 1}*/
                ]
            }
        }
        return tiers
    }

    getAllUnlockedRelics(currentLevel?:number): RelicTiers {
        const lvl = currentLevel ? currentLevel : this.getLevel()
        const relicAllTiers: RelicTiers = this.getAllRelics()
        const relicTiers:RelicTiers = {
            ...relicAllTiers,
            tier0: {
                ...relicAllTiers.tier0,
                relics: this._getAllUnlockedRelicsFromTier(relicAllTiers.tier0, lvl)
            },
            tier1: {
                ...relicAllTiers.tier1,
                relics: this._getAllUnlockedRelicsFromTier(relicAllTiers.tier1, lvl)
            },
            tier2: {
                ...relicAllTiers.tier2,
                relics: this._getAllUnlockedRelicsFromTier(relicAllTiers.tier2, lvl)
            },

        }
        return relicTiers
    }

    getAllLockedRelics(currentLevel?:number): RelicTiers {
        const lvl = currentLevel ? currentLevel : this.getLevel()
        const relicAllTiers: RelicTiers = this.getAllRelics()
        const relicTiers:RelicTiers = {
            ...relicAllTiers,
            tier0: {
                ...relicAllTiers.tier0,
                relics: this._getAllLockedRelicsFromTier(relicAllTiers.tier0)
            },
            tier1: {
                ...relicAllTiers.tier1,
                relics: this._getAllLockedRelicsFromTier(relicAllTiers.tier1)
            },
            tier2: {
                ...relicAllTiers.tier2,
                relics: this._getAllLockedRelicsFromTier(relicAllTiers.tier2)
            },

        }
        return relicTiers
    }

    getRelicsUnlockedAmount(){
        const relicTiers = this.getAllUnlockedRelics()
        let amount:number = 0
        relicTiers.tier0.relics.forEach(()=>{
            amount += 1
        })
        relicTiers.tier1.relics.forEach(()=>{
            amount += 1
        })
        relicTiers.tier2.relics.forEach(()=>{
            amount += 1
        })
        return amount
    }

    isTierUnlocked (tier: RelicTier, currentLevel?:number):boolean{
        const lvl = currentLevel ? currentLevel : this.getLevel()
        return (lvl >= tier.unlockLevel)
    }

    _getAllUnlockedRelicsFromTier(tier: RelicTier, currentLevel?:number): Array<Relic> {
        const isUnlocked = this.isTierUnlocked(tier,currentLevel)
        if (isUnlocked){
            return tier.relics.filter((relic)=>{
                const relicLvl = GameManager.getInstance().getVariable(relic.id).getValue()
                return relicLvl > 0
            })
        }
        return []
    }

    _getAllLockedRelicsFromTier(tier: RelicTier): Array<Relic> {
        return tier.relics.filter((relic)=>{
            const relicLvl = GameManager.getInstance().getVariable(relic.id).getValue()
            return relicLvl <= 0
        })
    }

    isRelicUnlocked(relicId: string){
        const relicLvl = GameManager.getInstance().getVariable(relicId).getValue()
        return relicLvl > 0
    }

    getRelic(relicId: string): Relic {
        const relicsTiers = this.getAllRelics()
        let rel = relicsTiers.tier0.relics.filter((relic)=>{
            return relic.id===relicId
        })
        if (rel.length>0) return rel[0]
        rel = relicsTiers.tier1.relics.filter((relic)=>{
            return relic.id===relicId
        })
        if (rel.length>0) return rel[0]
        rel = relicsTiers.tier2.relics.filter((relic)=>{
            return relic.id===relicId
        })
        if (rel.length>0) return rel[0]
        return relicsTiers.tier0.relics[0]
    }

    /** If Relic is locked will always return 0 */
    getRelicBonus(relicId: string):number{
        const isUnlocked = this.isRelicUnlocked(relicId)
        const relic = this.getRelic(relicId)
        const bonus = isUnlocked ? relic.base : 0
        return bonus
    }

    /*getEquippedRelics(currentLevel?:number): RelicTiersSlots{
        const lvl = currentLevel ? currentLevel : this.getLevel()
        const availableSlots = this.getAvaiableTierSlots(lvl)
        const equippedSlotsTier0 = GameManager.getInstance().getVariable(ids.relicsEquippedTier0).getValue() as Array<string>
        const equippedSlotsTier1 = GameManager.getInstance().getVariable(ids.relicsEquippedTier1).getValue() as Array<string>
        const equippedSlotsTier2 = GameManager.getInstance().getVariable(ids.relicsEquippedTier2).getValue() as Array<string>
        return {
            tier0: {
                availableSlots: availableSlots.tier0,
                equippedRelics: equippedSlotsTier0
            },
            tier1: {
                availableSlots: availableSlots.tier1,
                equippedRelics: equippedSlotsTier1
            },
            tier2: {
                availableSlots: availableSlots.tier1,
                equippedRelics: equippedSlotsTier2
            },
        }
    }*/

    /*getAvaiableTierSlots(currentLevel?:number): AvailableSlots{
        const lvl = currentLevel ? currentLevel : this.getLevel()
        const tier1UnlockLevel = events.dogsploration.unlockLevel
        const tier2UnlockLevel = events.bigbBoysploration.unlockLevel
        const tier0:number = Math.min(Math.floor(1 + lvl/3), maxSlots)
        const tier1:number = Math.min(Math.floor(1 + (lvl - tier1UnlockLevel)/3), maxSlots)
        const tier2:number = Math.min(Math.floor(1 + (lvl - tier2UnlockLevel)/3), maxSlots)
        return {
            tier0,
            tier1,
            tier2
        }
    }*/

    getLevel(): number { return GameManager.getInstance().getVariable(this.variableId).getValue()}
    

}