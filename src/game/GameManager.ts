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
        const baseClickCurrency = PetPetting.getCurrencyPerPet().currency * devMegaPetMult
        const currencyEarned: Currency = {
            currency: baseClickCurrency,
            treats: 0
        }
        this.addToVariable(baseClickCurrency, variableIds.currency)
        return currencyEarned
    }

    saveGame(){
        saveGame(this.variables)
    }

    resetGame(){
        resetGameSave()
    }
}

//Get Instance
export default (()=> {
    var instance: GameManager

    return {
        getInstance: function () {
            if (!instance) {
                instance = new GameManager()
                console.log(instance)
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
    Cookies.set(saveVarName, JSON.stringify(variables))
    console.log('saved gamed', variables)
}

const resetGameSave = () => {
    Cookies.remove(saveVarName)
}