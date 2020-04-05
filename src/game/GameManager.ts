import {store} from '../App'
import {actions} from '../reducers/GameVariables'
import {actions as uiActions} from '../reducers/uiUtils'
import { TimeManager } from "./TimeManager";
import ProductManager from './ProductManager';
import ids from './VariableId'
import permaIds from './PermaVariablesId'
import {Variable} from './Variables'
import { Currency } from './products/Product';
import { PetPetting } from './products/PetPetting';

import Cookies from 'js-cookie' 
import NotificationManager from './NotificationManager';
import { toFormat, getBuildingIcon } from '../utils/uiUtil';
import Decimal from 'break_infinity.js';
import { Park } from './products/Park';
import ArchivementManager from './ArchivementManager';
import DogSkinsManager from './DogSkinsManager';
import { Tree } from './products/Tree';

const devMegaPetMult = 1
const saveEvery = 0.5
const saveVarName = "variables"
const saveVarPermaName = "variablesPerma"
//Game Manager
class GameManager  {
    timeManger: TimeManager
    productManager: ProductManager
    notificationManager: NotificationManager
    archivementManager: ArchivementManager
    dogSkinManager: DogSkinsManager
    variables: VariableStructure
    permaVariables: VariableStructure

    constructor(){
        this.timeManger = new TimeManager()
        this.productManager = new ProductManager(this.timeManger)
        this.notificationManager = new NotificationManager()
        this.archivementManager = new ArchivementManager(this.timeManger)
        this.dogSkinManager = new DogSkinsManager(this.timeManger)
        this.variables = initializeVariables()
        this.permaVariables = initializePermaVariables()
        this.timeManger.susbcribe({
            id: 'GMTimePassed',
            onTimePass: (timePassed:number)=> this.increaseTimePassed(timePassed)
        })
        setInterval(()=>{
            saveGame(this.variables, this.permaVariables)
        }, saveEvery * 60 * 1000)
    }

    initializeUI(){
        store.dispatch(actions.updateVariables())
        store.dispatch(uiActions.updateArchivementsAmount())
        store.dispatch(uiActions.updateBreedsAmount())
        const updateUiTick = 'updateUITick'
        this.timeManger.susbcribe({
            id: updateUiTick,
            onTimePass:() => {
                store.dispatch(actions.updateVariables());
                return {currency:new Decimal(0),treats:new Decimal(0)}
            }
        })
        this.getProductManager().updateCurrenciesPerSecond()
        let currencyOffline = this.handleOfflineTimePassed()
        const tree = this.getProductManager().getProduct(ids.treeOfGoodBoys) as Tree
        const bonus:number = tree.getBlessing(ids.blessing0B).getBonus()
        currencyOffline.patiencePoints = currencyOffline.patiencePoints?.min(72).mul(bonus)
        this.addCurrency(currencyOffline)
        if (this.getVariable(ids.lastSaveDate).getValue()!=null){
            this.getNotificationManager().addNotification({
                id:'welcomed-back',
                background: getBuildingIcon(ids.product3Level).background,
                description:'Your dogs have been waiting for you. They gained '+toFormat(currencyOffline.patiencePoints? currencyOffline.patiencePoints : 0)+' patience points for waiting like good boys. Spend them to speed up the game!',
                image: 'https://i.imgur.com/DIPnpA9.png',
                seen: false,
                title: 'Welcomed Back!1!ONE!'
              })
            this.unlockTimeWizard()
        }else{
            this.getNotificationManager().addNotification({
                id:'welcomed-to-the-game',
                background: 'https://i.imgur.com/GZl7HTq.jpg',
                description:"I've been waiting a long time for a good hooman to come. I heard they give great pets!",
                image: 'https://i.imgur.com/V70781h.png',
                seen: false,
                title: 'A HUMAN OMG!'
              })
        }
    }

    addToVariable (add: number | Decimal, variableId: string): void {
        let preValue = this.variables[variableId].getValue()
        let newValue
        if (add instanceof Decimal){
            preValue = preValue ? new Decimal(preValue) : new Decimal(0)
            newValue = preValue.add(add)
        }else {
            newValue = preValue + add
        }
        const newVariables: VariableStructure = {
            ...this.variables,
            [variableId]:  new Variable({id:variableId, value:newValue})
        }
        this.variables = newVariables
    }

    addCurrency (add: Currency): void {
        const {currency,treats, patiencePoints} = add
        let myCurrency:Decimal = new Decimal(Number(this.getVariable(ids.currency).getValue()))
        let myTreats:Decimal = new Decimal(Number(this.getVariable(ids.treats).getValue()))
        let myPatiencePoints:Decimal = new Decimal(Number(this.getVariable(ids.patiencePoints).getValue()))
        myCurrency = myCurrency.add(currency)
        myTreats = myTreats.add(treats)

        if (patiencePoints){
            myPatiencePoints = myPatiencePoints.add(patiencePoints? patiencePoints : 0)
            this.setVariable(myPatiencePoints,ids.patiencePoints)
        }

        this.setVariable(myCurrency,ids.currency)
        this.setVariable(myTreats,ids.treats)
    }

    getCurrency(): Currency {
        let currency:Decimal = new Decimal(Number(this.getVariable(ids.currency).getValue()))
        let treats:Decimal = new Decimal(Number(this.getVariable(ids.treats).getValue()))
        let patiencePoints:Decimal = new Decimal(Number(this.getVariable(ids.patiencePoints).getValue()))
        return {
            currency,
            treats,
            patiencePoints
        }
    }

    setVariable (value: any, variableId: string): void {
        const newVariables: VariableStructure = {
            ...this.variables,
            [variableId]:  new Variable({id:variableId, value:value})
        }
        this.variables = newVariables
    }

    setPermaVariable (value: any, variableId: string): void {
        const newVariables: VariableStructure = {
            ...this.permaVariables,
            [variableId]:  new Variable({id:variableId, value:value})
        }
        this.permaVariables = newVariables
    }
    
    getVariable(variableId: string): Variable {
        return this.variables[variableId]
    }

    getPermaVariable(variableId: string): Variable {
        return this.permaVariables[variableId]
    }

    getTimeManager(): TimeManager {
        return this.timeManger
    }

    getProductManager(): ProductManager {
        return this.productManager
    }

    getNotificationManager(): NotificationManager {
        return this.notificationManager;
    }

    getArchivementManager(): ArchivementManager {
        return this.archivementManager;
    }

    getDogSkinManager(): DogSkinsManager {
        return this.dogSkinManager;
    }
    
    onClickedDog(): Currency{
        const PetPetting = this.productManager.getProduct(ids.product0Level) as PetPetting
        const {currency, treats} = PetPetting.getCurrencyPerPet()
        //Relics
        const park = this.productManager.getProduct(ids.product4Level) as Park
        const relic0ABonus = park.getRelicBonus(ids.relicTier0A)
        const baseClickCurrency = currency.mul(devMegaPetMult).mul(relic0ABonus!==0 ? relic0ABonus : 1)
        
        const currencyEarned: Currency = {
            currency: baseClickCurrency,
            treats
        }
        this.addCurrency(currencyEarned)
        this.addToVariable(1, ids.clicks)
        return currencyEarned
    }

    saveGame(){
        saveGame(this.variables, this.permaVariables)
    }

    resetGame(){
        resetGameSave()
    }

    increaseTimePassed(timePassed: number): Currency{
        let totalTime:number = this.getVariable(ids.timePassed).getValue()
        totalTime += timePassed
        this.setVariable(totalTime, ids.timePassed)
        return {currency: new Decimal(0),treats:new Decimal(0)}
    }

    handleOfflineTimePassed(): Currency{
        let lastSaveTime:Date = this.getVariable(ids.lastSaveDate).getValue()
        lastSaveTime = lastSaveTime ? new Date(lastSaveTime) : new Date()
        const today = new Date()
        const diffInSeconds = Math.abs(today.getTime() - lastSaveTime.getTime())/1000;
        const patiencePointsGained = this.getTimeManager().getPatiencePoints(diffInSeconds)
        
        const currencyGained:Currency = {
            currency:new Decimal(0),
            treats:new Decimal(0),
            patiencePoints: patiencePointsGained
        }
        //park timers while AFK
        const park = this.getProductManager().getProduct(ids.product4Level) as Park
        park.passAfkTimeAdventure(diffInSeconds)
        return currencyGained
    }

    buyTurboTime(patienceSpent: Decimal){
        const patiencePoints = new Decimal(Number(this.getVariable(ids.patiencePoints).getValue()))
        if (patienceSpent.lte(patiencePoints)){
            const turboSeconds = this.getTimeManager().buyTurboTime(patienceSpent)
            this.addToVariable(patienceSpent.mul(-1), ids.patiencePoints)
            this.addToVariable(turboSeconds.toNumber(), ids.turboTimeLeft)
        }
    }

    unlockTimeWizard(){
        const dogWizardLvl = this.getVariable(ids.product3Level).getValue()
        if (dogWizardLvl<1){
            this.setVariable(1, ids.product3Level)
            this.getNotificationManager().addNotification({
                id:'time-wizard-unlcok',
                background: getBuildingIcon(ids.product3Level).background,
                description:'Greetings human, it is I, the Wizpug! With my powers you can use your dogs stored patience to speed time ITSELF.',
                image: getBuildingIcon(ids.product3Level).icon,
                seen: false,
                title: 'The Wizpug is here!'
                })
        }
    }
}

//Get Instance
export default (()=> {
    var instance: GameManager

    return {
        getInstance: function () {
            if (!instance) {
                instance = new GameManager()
            }
            return instance
        }
    };
})()

export interface VariableStructure {
    [key: string]: Variable;
}
const initializeVariables = () => {
    let variablesObject:VariableStructure = {}
    Object.keys(ids).map((id:string) => {
        variablesObject[id] = new Variable({id, value:null})
    })
    variablesObject = loadSavedData(variablesObject)
    console.log(variablesObject)
    return variablesObject;
}

const initializePermaVariables = () => {
    let variablesObject:VariableStructure = {}
    Object.keys(permaIds).map((id:string) => {
        variablesObject[id] = new Variable({id, value:null})
    })
    variablesObject = loadPermaSaveData(variablesObject)
    console.log(variablesObject)
    return variablesObject;
}

const loadSavedData = (variablesObject:VariableStructure):VariableStructure => {
    const localSave = localStorage.getItem(saveVarName)
    let save:VariableStructure;
    if (!localSave){
        save = Cookies.getJSON(saveVarName) as VariableStructure
    }else {
        save = JSON.parse(localSave) as VariableStructure
    }
    if (save){
        Object.keys(save).map((id:string) => {
            variablesObject[id] = new Variable(save[id].properties)
        })
        console.log("data loaded", variablesObject)
    }
    return variablesObject
}

const loadPermaSaveData = (permaVariablesObject: VariableStructure): VariableStructure => {
    const localPermaSave = localStorage.getItem(saveVarPermaName)
    let save:VariableStructure = {};
    if (localPermaSave){
        save = JSON.parse(localPermaSave) as VariableStructure
    }
    if (save){
        Object.keys(save).map((id:string) => {
            permaVariablesObject[id] = new Variable(save[id].properties)
        })
        console.log("perma data loaded", permaVariablesObject)
    }
    return permaVariablesObject
}

const saveGame = (variables: VariableStructure, permaVariables: VariableStructure)=> {
    variables.lastSaveDate = new Variable({id:ids.lastSaveDate, value:new Date()})
    const cook = Cookies.set(saveVarName, JSON.stringify(variables), { expires: (10 * 365) })
    localStorage.setItem(saveVarName, JSON.stringify(variables))
    localStorage.setItem(saveVarPermaName, JSON.stringify(permaVariables))
    console.log('saved gamed', variables, permaVariables)
    console.log('Cookie length', cook?.length)
}

const resetGameSave = () => {
    Cookies.remove(saveVarName)
    localStorage.removeItem(saveVarName)
}