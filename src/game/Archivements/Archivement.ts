import GameManager from "../GameManager";
import { getArchivementIcon } from "../../utils/uiUtil";
import { Notification } from '../NotificationManager'
import { getArchivementText, getText } from "../../utils/textUtil";

export interface ArchivementInterface {
    varId: string
    requiredValue: any

    inUnlocked(): boolean
    checkForCompletion(): void
}

export class ArchivementBase implements ArchivementInterface {
    varId: string;
    requiredValue: any;

    constructor(varId: string, requiredValue: any){
        this.varId = varId
        this.requiredValue = requiredValue
    }
    
    inUnlocked(): boolean {
        const archivement = Number(GameManager.getInstance().getVariable(this.varId).getValue())
        return archivement>0
    }
    
    getBaseNotification(): Notification {
        const archivements = getText().archivements
        return ({
            id: 'archivement-'+this.varId,
            title: archivements.archivementBaseTitle+": "+getArchivementText(this.varId).title,
            description: getArchivementText(this.varId).description,
            background: getArchivementIcon(this.varId).background,
            image: getArchivementIcon(this.varId).icon,
            seen: false
        })
    }
    
    checkForCompletion() {
        return false
    }
}