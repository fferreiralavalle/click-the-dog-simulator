import { Product, Currency } from "./products/Product"
import { TimeManager } from "./TimeManager"
import Decimal from "break_infinity.js"
import { ArchivementInterface } from "./Archivements/Archivement"
import variables from "./VariableId"
import Clicks from "./Archivements/Clicks"
import FarmMilestone from "./Archivements/FarmMilestone"
import LabMilestone from "./Archivements/LabMilestone"
import WizPugMilestone from "./Archivements/WizPugMilestone"
import ParkMilestone from "./Archivements/ParkMilestone"
import KingMilestone from "./Archivements/KingMilestone"
import {actions as uiAction} from '../reducers/uiUtils'
import { store } from "../App"
import MuseumMilestone from "./Archivements/MuseumMilestone"

export interface ArchivementList {
    [key: string] : ArchivementInterface
}

const milestones = [15,30]

export default class ArchivementManager {
    archivementList: ArchivementList
    
    constructor(timeManager: TimeManager){
        this.archivementList = initializeArchivements()
        this.onTimePassed = this.onTimePassed.bind(this)
        timeManager.susbcribe({
            id: 'Archivement-time-subscriber',
            onTimePass: () => this.onTimePassed()
        })
    }

    getUnlockedArchivements(): Array<ArchivementInterface> {
        const archivements:ArchivementInterface[] = []
        Object.keys(this.archivementList).forEach(key => {
            if (this.archivementList[key].inUnlocked()){
                archivements.push(this.archivementList[key])
            }
        });
        return archivements
    }

    onTimePassed(): Currency {
        let archivementUnlocked = false
        Object.keys(this.archivementList).forEach((key)=> {
            const result = this.archivementList[key].checkForCompletion()
            if (result){archivementUnlocked=true}
        })
        if (archivementUnlocked){
            store.dispatch(uiAction.updateArchivementsAmount())
        }
        return {currency: new Decimal(0), treats: new Decimal(0)}
    }

    getArchivement(archivementId: string): ArchivementInterface {
        return this.archivementList[archivementId]
    }

    getArchivements(): Array<ArchivementInterface> {
        const archivements:ArchivementInterface[] = Object.keys(this.archivementList).map(key => {
            return this.archivementList[key]
        });
        return archivements
    }
}

function initializeArchivements(): ArchivementList {
    return {
        [variables.archivementClicks]: new Clicks(variables.archivementClicks, 50),
        [variables.archivementClicks2]: new Clicks(variables.archivementClicks2, 500),
        [variables.archivementProduct1LevelMilestone]: new FarmMilestone(variables.archivementProduct1LevelMilestone, milestones[0]),
        [variables.archivementProduct1LevelMilestone2]: new FarmMilestone(variables.archivementProduct1LevelMilestone2, milestones[1]),
        [variables.archivementProduct2LevelMilestone]: new LabMilestone(variables.archivementProduct2LevelMilestone, milestones[0]),
        [variables.archivementProduct2LevelMilestone2]: new LabMilestone(variables.archivementProduct2LevelMilestone2, milestones[1]),
        [variables.archivementProduct3LevelMilestone]: new WizPugMilestone(variables.archivementProduct3LevelMilestone, 1),
        [variables.archivementProduct4LevelMilestone]: new ParkMilestone(variables.archivementProduct4LevelMilestone, milestones[0]),
        [variables.archivementProduct4LevelMilestone2]: new ParkMilestone(variables.archivementProduct4LevelMilestone2, milestones[1]),
        [variables.archivementUpgradeShopLevelMilestone]: new KingMilestone(variables.archivementUpgradeShopLevelMilestone, milestones[0]),
        [variables.archivementUpgradeShopLevelMilestone2]: new KingMilestone(variables.archivementUpgradeShopLevelMilestone2, milestones[1]),
        [variables.archivementMuseumLevelMilestone]: new MuseumMilestone(variables.archivementMuseumLevelMilestone, milestones[0]),
        [variables.archivementMuseumLevelMilestone2]: new MuseumMilestone(variables.archivementMuseumLevelMilestone2, milestones[1]),
    }
}
