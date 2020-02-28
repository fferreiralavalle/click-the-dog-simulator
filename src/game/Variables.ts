export interface VariableProperties {
    id: string
    value: any
}
export class Variable {
    properties: VariableProperties

    constructor(property: VariableProperties) {
        this.properties = property
    }

    getValue(){
        return this.properties.value
    }
    setValue(newValue: number){
        this.properties.value = newValue
    }
    addValue(add: number):number {
        this.properties.value += add
        return this.properties.value
    }
}