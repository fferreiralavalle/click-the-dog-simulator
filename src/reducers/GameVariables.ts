import GameManager from '../game/GameManager'

const types = {
    UPDATE_VARIABLES: 'UPDATE_VARIABLES'
}

const INITIAL_STATE = {
    variables: {},
}

const variables = (state=INITIAL_STATE, action:any)=>{
    switch(action.type){
        case types.UPDATE_VARIABLES:
            return {
                ...state,
                variables: GameManager.getInstance().variables
            }
        default:
            return state          
    }
}

export const actions = {
    updateVariables: () => ({type: types.UPDATE_VARIABLES})
}

export const selecters = {
    getVariables: (state:any) => (state.variables.variables),
    getVariable: (state:any, id:string) => (state.variables.variables[id])
}

export default variables;