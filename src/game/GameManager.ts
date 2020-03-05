import {store} from '../App'
import {actions} from '../reducers/GameVariables'
import { TimeManager } from "./TimeManager";
import ProductManager from './ProductManager';
import variableIds from './VariableId'
import {Variable} from './Variables'
import { Currency } from './products/Product';
import { PetPetting } from './products/PetPetting';

import Cookies from 'js-cookie' 

const devMegaPetMult = 1
const saveEvery = 0.5
const saveVarName = "variables"
//Game Manager
class GameManager  {
    timeManger: TimeManager
    productManager: ProductManager
    variables: VariableStructure

    constructor(){
        this.timeManger = new TimeManager()
        this.productManager = new ProductManager(this.timeManger)
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
            onTimePass:() => store.dispatch(actions.updateVariables())
        })
        this.handleOfflineTimePassed()
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

    increaseTimePassed(timePassed: number){
        let totalTime:number = this.getVariable(variableIds.timePassed).getValue()
        totalTime += timePassed
        this.setVariable(totalTime, variableIds.timePassed)
    }

    handleOfflineTimePassed(){
        let lastSaveTime:Date = this.getVariable(variableIds.lastSaveDate).getValue()
        lastSaveTime = lastSaveTime ? new Date(lastSaveTime) : new Date()
        const today = new Date()
        const diffInSeconds = Math.abs(today.getTime() - lastSaveTime.getTime())/1000;
        this.getTimeManager().passTime(diffInSeconds)
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