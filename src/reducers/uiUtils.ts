import GameManager from '../game/GameManager'

const types = {
    SHOW_ARCHIVEMENTS: 'SHOW_ARCHIVEMENTS',
    SHOW_DOGSKINS: 'SHOW_DOGSKINS',
    SHOW_FADE_GAME: 'SHOW_FADE_GAME',
    UPDATE_BREEDS_AMOUNT: 'UPDATE_BREEDS_AMOUNT',
    UPDATE_ARCHIVEMENTS_AMOUNT: 'UPDATE_ARCHIVEMENTS_AMOUNT',
    SET_LET_GO_SCREEN_LEVEL: 'SET_LET_GO_SCREEN_LEVEL'
}

const INITIAL_STATE = {
    showArchivements: false,
    showDogSkins: false,
    showFade: false,
    archivementsAmount: 0,
    dogSkinsAmount: 0,
    letGoScreenLevel: 0,
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
        case types.SHOW_FADE_GAME:
            
            return {
                ...state,
                showFade: action.showFade
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
        case types.SET_LET_GO_SCREEN_LEVEL:
            return {
                ...state,
                letGoScreenLevel: action.level,
            }
        default:
            return state          
    }
}

export const actions = {
    showArchivements: (show: boolean) => ({type: types.SHOW_ARCHIVEMENTS, showArchivements: show}),
    showDogSkins: (show: boolean) => ({type: types.SHOW_DOGSKINS, showDogSkins: show}),
    showFadeGame: (show: boolean) => ({type: types.SHOW_FADE_GAME, showFade: show}),
    updateBreedsAmount: () => ({type: types.UPDATE_BREEDS_AMOUNT}),
    updateArchivementsAmount: () => ({type: types.UPDATE_ARCHIVEMENTS_AMOUNT}),
    setLetGoScreenLevel: (level: number) => ({type: types.SET_LET_GO_SCREEN_LEVEL, level}),
}

export const selecters = {
    showArchivements: (state:any):boolean => (state.uiUtils.showArchivements),
    showDogSkins: (state:any):boolean => (state.uiUtils.showDogSkins),
    showFadeGame: (state:any):boolean => (state.uiUtils.showFade),
    getDogBreedsAmount: (state:any):number => (state.uiUtils.dogSkinsAmount),
    getArchivementsAmount: (state:any):number => (state.uiUtils.archivementsAmount),
    getLetGoScreenlevel: (state:any):number => (state.uiUtils.letGoScreenLevel),
}

export default uiUtils;