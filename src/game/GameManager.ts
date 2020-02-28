import {store} from '../App'
import {actions} from '../reducers/GameVariables'
import { TimeManager } from "./TimeManager";
import ProductManager from './ProductManager';
import variableIds from './VariableId'
import {Variable} from './Variables'
import { Currency } from './products/Product';

//Game Manager
class GameManager  {
    timeManger: TimeManager
    productManager: ProductManager
    variables: VariableStructure

    constructor(){
        this.timeManger = new TimeManager()
        this.productManager = new ProductManager(this.timeManger)
        this.variables = initializeVariables()
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
        const newValue = this.variables[variableId].value + add
        const newVariables: VariableStructure = {
            ...this.variables,
            [variableId]:  new Variable(variableId, newValue)
        }
        this.variables = newVariables
    }

    setVariable (value: any, variableId: string): void {
        const newVariables: VariableStructure = {
            ...this.variables,
            [variableId]:  new Variable(variableId, value)
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
        const baseClickCurrency = 1;
        const currencyEarned: Currency = {
            currency: baseClickCurrency,
            treats: 0
        }
        this.addToVariable(baseClickCurrency, variableIds.currency)
        return currencyEarned
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
        variablesObject[id] = new Variable(id, null)
    })
     console.log(variablesObject)
     return variablesObject;
}