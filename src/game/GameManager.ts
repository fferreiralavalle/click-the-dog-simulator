import {store} from '../App'
import {actions} from '../reducers/GameVariables'
import {actions as mailActions} from '../reducers/Mails'
import { TimeManager } from "./TimeManager";
import ProductManager from './ProductManager';
import variableIds from './VariableId'
import {Variable} from './Variables'
import { Currency } from './products/Product';
import { PetPetting } from './products/PetPetting';

import Cookies from 'js-cookie' 
import NotificationManager from './NotificationManager';
import { toFormat } from '../utils/uiUtil';

const devMegaPetMult = 1
const saveEvery = 0.5
const saveVarName = "variables"
//Game Manager
class GameManager  {
    timeManger: TimeManager
    productManager: ProductManager
    notificationManager: NotificationManager
    variables: VariableStructure

    constructor(){
        this.timeManger = new TimeManager()
        this.productManager = new ProductManager(this.timeManger)
        this.notificationManager = new NotificationManager()
        this.variables = initializeVariables()
        this.timeManger.susbcribe({
            id: 'GMTimePassed',
            onTimePass: (timePassed:number)=> this.increaseTimePassed(timePassed)
        })
        setInterval(()=>{
            saveGame(this.variables)
        }, saveEvery * 60 * 1000)
    }

    initializeUI(){
        store.dispatch(actions.updateVariables())
        const updateUiTick = 'updateUITick'
        this.timeManger.susbcribe({
            id: updateUiTick,
            onTimePass:() => {store.dispatch(actions.updateVariables());return {currency:0,treats:0}}
        })
        const {currency,treats} = this.handleOfflineTimePassed()
        if (this.getVariable(variableIds.lastSaveDate).getValue()!=null){
            this.getNotificationManager().addNotification({
                id:'welcomed-back',
                background: '',
                description:'Your dogs were bussy while you were gone. You made '+toFormat(currency)+' LOVE and '+toFormat(treats)+' TREATS.',
                image: 'https://i.imgur.com/NfCybaI.png',
                seen: false,
                title: 'Welcomed Back!1!ONE!'
              })
              store.dispatch(mailActions.updateMails())
        }else{
            this.getNotificationManager().addNotification({
                id:'welcomed-to-the-game',
                background: '',
                description:"I've been waiting a long time for a good hooman to come. I heard they give great pets!",
                image: 'https://i.imgur.com/V70781h.png',
                seen: false,
                title: 'A HUMAN OMG!'
              })
              store.dispatch(mailActions.updateMails())
        }
    }

    addToVariable (add: number, variableId: string): void {
        const newValue = this.variables[variableId].getValue() + add
        const newVariables: VariableStructure = {
            ...this.variables,
            [variableId]:  new Variable({id:variableId, value:newValue})
        }
        this.variables = newVariables
    }

    setVariable (value: any, variableId: string): void {
        const newVariables: VariableStructure = {
            ...this.variables,
            [variableId]:  new Variable({id:variableId, value:value})
        }
        this.variables = newVariables
    }
    
    getVariable(variableId: string): Variable {
        return this.variables[variableId]
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
    
    onClickedDog(): Currency{
        const PetPetting = this.productManager.getProduct(variableIds.product0Level) as PetPetting
        const {currency, treats} = PetPetting.getCurrencyPerPet()
        const baseClickCurrency = currency * devMegaPetMult
        const currencyEarned: Currency = {
            currency: baseClickCurrency,
            treats
        }
        this.addToVariable(baseClickCurrency, variableIds.currency)
        this.addToVariable(treats, variableIds.treats)
        return currencyEarned
    }

    saveGame(){
        saveGame(this.variables)
    }

    resetGame(){
        resetGameSave()
    }

    increaseTimePassed(timePassed: number): Currency{
        let totalTime:number = this.getVariable(variableIds.timePassed).getValue()
        totalTime += timePassed
        this.setVariable(totalTime, variableIds.timePassed)
        return {currency:0,treats:0}
    }

    handleOfflineTimePassed(): Currency{
        let lastSaveTime:Date = this.getVariable(variableIds.lastSaveDate).getValue()
        lastSaveTime = lastSaveTime ? new Date(lastSaveTime) : new Date()
        const today = new Date()
        const diffInSeconds = Math.abs(today.getTime() - lastSaveTime.getTime())/1000;
        const currencyGained = this.getTimeManager().passTime(diffInSeconds)
        return currencyGained
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
    Object.keys(variableIds).map((id:string) => {
        variablesObject[id] = new Variable({id, value:null})
    })
    variablesObject = loadSavedData(variablesObject)
    console.log(variablesObject)
    return variablesObject;
}

const loadSavedData = (variablesObject:VariableStructure):VariableStructure => {
    const savedVariables = Cookies.getJSON(saveVarName) as VariableStructure
    if (savedVariables){
        Object.keys(savedVariables).map((id:string) => {
            variablesObject[id] = new Variable(savedVariables[id].properties)
        })
        console.log("data loaded", variablesObject)
    }
    return variablesObject
}

const saveGame = (variables: VariableStructure)=> {
    variables.lastSaveDate = new Variable({id:variableIds.lastSaveDate, value:new Date()})
    Cookies.set(saveVarName, JSON.stringify(variables))
    console.log('saved gamed', variables)
}

const resetGameSave = () => {
    Cookies.remove(saveVarName)
}