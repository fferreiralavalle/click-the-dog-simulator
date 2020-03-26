import GameManager from '../game/GameManager'
import { Notifications } from '../game/NotificationManager'

const types = {
    SHOW_ARCHIVEMENTS: 'SHOW_ARCHIVEMENTS',
    SHOW_DOGSKINS: 'SHOW_DOGSKINS',
    UPDATE_BREEDS_AMOUNT: 'UPDATE_BREEDS_AMOUNT',
    UPDATE_ARCHIVEMENTS_AMOUNT: 'UPDATE_ARCHIVEMENTS_AMOUNT'
}

const INITIAL_STATE = {
    showArchivements: false,
    showDogSkins: false,
    archivementsAmount: 0,
    dogSkinsAmount: 0
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
        case types.UPDATE_BREEDS_AMOUNT:
            return {
                ...state,
                dogSkinsAmount: GameManager.getInstance().getDogSkinManager().getUnlockedSkins().length
            }
        case types.UPDATE_ARCHIVEMENTS_AMOUNT:
            return {
                ...state,
                archivementsAmount: GameManager.getInstance().getArchivementManager().getUnlockedArchivements().length,
            }
        default:
            return state          
    }
}

export const actions = {
    showArchivements: (show: boolean) => ({type: types.SHOW_ARCHIVEMENTS, showArchivements: show}),
    showDogSkins: (show: boolean) => ({type: types.SHOW_DOGSKINS, showDogSkins: show}),
    updateBreedsAmount: () => ({type: types.UPDATE_BREEDS_AMOUNT}),
    updateArchivementsAmount: () => ({type: types.UPDATE_ARCHIVEMENTS_AMOUNT}),
}

export const selecters = {
    showArchivements: (state:any):boolean => (state.uiUtils.showArchivements),
    showDogSkins: (state:any):boolean => (state.uiUtils.showDogSkins),
    getDogBreedsAmount: (state:any):number => (state.uiUtils.dogSkinsAmount),
    getArchivementsAmount: (state:any):number => (state.uiUtils.archivementsAmount)
}

export default uiUtils;