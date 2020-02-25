
export class Variable {
    variableId: string = ""
    value: any

    constructor(variableId: string, value: number) {
        this.variableId = variableId;
        this.value = value;
    }

    getValue(){
        return this.value
    }
    setValue(newValue: number){
        this.value = newValue
    }
    addValue(add: number):number {
        this.value += add
        return this.value
    }
}