import GameManager from '../game/GameManager'
import { Notifications } from '../game/NotificationManager'

const types = {
    SHOW_ARCHIVEMENTS: 'SHOW_ARCHIVEMENTS',
    SHOW_DOGSKINS: 'SHOW_DOGSKINS',
}

const INITIAL_STATE = {
    showArchivements: false,
    showDogSkins: false
}

const uiUtils = (state=INITIAL_STATE, action:any)=>{
    switch(action.type){
        case types.SHOW_ARCHIVEMENTS:
            return {
                ...state,
                showArchivements: action.showArchivements
            }
        case types.SHOW_DOGSKINS:
            return {
                ...state,
                showDogSkins: action.showDogSkins
            }
        default:
            return state          
    }
}

export const actions = {
    showArchivements: (show: boolean) => ({type: types.SHOW_ARCHIVEMENTS, showArchivements: show}),
    showDogSkins: (show: boolean) => ({type: types.SHOW_DOGSKINS, showDogSkins: show})
}

export const selecters = {
    showArchivements: (state:any):boolean => (state.uiUtils.showArchivements),
    showDogSkins: (state:any):boolean => (state.uiUtils.showDogSkins),
}

export default uiUtils;