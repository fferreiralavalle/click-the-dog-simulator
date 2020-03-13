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
import Decimal from 'break_infinity.js';

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
            onTimePass:() => {
                store.dispatch(actions.updateVariables());
                return {currency:new Decimal(0),treats:new Decimal(0)}
            }
        })
        const currencyOffline = this.handleOfflineTimePassed()
        this.addCurrency(currencyOffline)
        if (this.getVariable(variableIds.lastSaveDate).getValue()!=null){
            this.getNotificationManager().addNotification({
                id:'welcomed-back',
                background: 'https://i.imgur.com/3AcgxLn.jpg',
                description:'Your dogs have been waiting for you. They gained '+toFormat(currencyOffline.patiencePoints? currencyOffline.patiencePoints : 0)+' patience points for waiting like good boys. Spend them to speed up the game!',
                image: 'https://i.imgur.com/DIPnpA9.png',
                seen: false,
                title: 'Welcomed Back!1!ONE!'
              })
            const dogWizardLvl = this.getVariable(variableIds.product3Level).getValue()
            if (dogWizardLvl<1){
                this.setVariable(1, variableIds.product3Level)
                this.getNotificationManager().addNotification({
                    id:'time-wizard-unlcok',
                    background: 'https://i.imgur.com/AIK9tpI.jpg',
                    description:'Greetings human, it is I, the Wizpug! With my powers you can use your dogs stored patience to speed time ITSELF.',
                    image: 'https://i.imgur.com/RakeK3M.png',
                    seen: false,
                    title: 'The Wizpug is here!'
                  })
            }
            store.dispatch(mailActions.updateMails())
        }else{
            this.getNotificationManager().addNotification({
                id:'welcomed-to-the-game',
                background: 'https://i.imgur.com/GZl7HTq.jpg',
                description:"I've been waiting a long time for a good hooman to come. I heard they give great pets!",
                image: 'https://i.imgur.com/V70781h.png',
                seen: false,
                title: 'A HUMAN OMG!'
              })
              store.dispatch(mailActions.updateMails())
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
        let myCurrency:Decimal = new Decimal(Number(this.getVariable(variableIds.currency).getValue()))
        let myTreats:Decimal = new Decimal(Number(this.getVariable(variableIds.treats).getValue()))
        let myPatiencePoints:Decimal = new Decimal(Number(this.getVariable(variableIds.patiencePoints).getValue()))
        myCurrency = myCurrency.add(currency)
        myTreats = myTreats.add(treats)

        if (patiencePoints){
            myPatiencePoints = myPatiencePoints.add(patiencePoints? patiencePoints : 0)
            this.setVariable(myPatiencePoints,variableIds.patiencePoints)
        }

        this.setVariable(myCurrency,variableIds.currency)
        this.setVariable(myTreats,variableIds.treats)
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
        const baseClickCurrency = currency.mul(devMegaPetMult)
        const currencyEarned: Currency = {
            currency: baseClickCurrency,
            treats
        }
        this.addCurrency(currencyEarned)
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
        return {currency: new Decimal(0),treats:new Decimal(0)}
    }

    handleOfflineTimePassed(): Currency{
        let lastSaveTime:Date = this.getVariable(variableIds.lastSaveDate).getValue()
        lastSaveTime = lastSaveTime ? new Date(lastSaveTime) : new Date()
        const today = new Date()
        const diffInSeconds = Math.abs(today.getTime() - lastSaveTime.getTime())/1000;
        const patiencePointsGained = this.getTimeManager().getPatiencePoints(diffInSeconds)
        const currencyGained:Currency = {
            currency:new Decimal(0),
            treats:new Decimal(0),
            patiencePoints: patiencePointsGained
        }
        return currencyGained
    }

    buyTurboTime(patienceSpent: Decimal){
        const patiencePoints = new Decimal(Number(this.getVariable(variableIds.patiencePoints).getValue()))
        if (patienceSpent.lte(patiencePoints)){
            const turboSeconds = this.getTimeManager().buyTurboTime(patienceSpent)
            this.addToVariable(patienceSpent.mul(-1), variableIds.patiencePoints)
            this.addToVariable(turboSeconds.toNumber(), variableIds.turboTimeLeft)
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