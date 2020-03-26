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

export interface ArchivementList {
    [key: string] : ArchivementInterface
}

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
        Object.keys(this.archivementList).forEach((key)=> {
            this.archivementList[key].checkForCompletion()
        })
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
        [variables.archivementProduct1LevelMilestone]: new FarmMilestone(variables.archivementProduct1LevelMilestone, 15),
        [variables.archivementProduct2LevelMilestone]: new LabMilestone(variables.archivementProduct2LevelMilestone, 15),
        [variables.archivementProduct3LevelMilestone]: new WizPugMilestone(variables.archivementProduct3LevelMilestone, 1),
        [variables.archivementProduct4LevelMilestone]: new ParkMilestone(variables.archivementProduct4LevelMilestone, 15),
        [variables.archivementUpgradeShopLevelMilestone]: new KingMilestone(variables.archivementUpgradeShopLevelMilestone, 15),
    }
}
