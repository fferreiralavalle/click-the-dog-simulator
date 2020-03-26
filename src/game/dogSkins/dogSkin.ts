import GameManager from "../GameManager";
import { getArchivementIcon } from "../../utils/uiUtil";
import { Notification } from '../NotificationManager'
import { getArchivementText, getText } from "../../utils/textUtil";

export interface DogSkinInterface {
    varId: string
    requiredValue: any

    inUnlocked(): boolean
    checkForCompletion(): boolean
}

export class DogSkinBase implements DogSkinInterface {
    varId: string;
    requiredValue: any;

    constructor(varId: string, requiredValue: any){
        this.varId = varId
        this.requiredValue = requiredValue
    }
    
    inUnlocked(): boolean {
        const skinLevel = Number(GameManager.getInstance().getPermaVariable(this.varId)?.getValue())
        return skinLevel>0
    }
    
    getBaseNotification(): Notification {
        const archivements = getText().archivements
        return ({
            id: 'dogSkin-'+this.varId,
            title: archivements.archivementBaseTitle+": "+getArchivementText(this.varId).title,
            description: getArchivementText(this.varId).description,
            background: getArchivementIcon(this.varId).icon,
            image: getArchivementIcon(this.varId).icon,
            seen: false
        })
    }
    
    checkForCompletion() {return false}
}

export class DogSkinMinLevel extends DogSkinBase {
    archivementId: string
    constructor(varId: string, archivementId: string, minValue:number=1){
        super(varId, minValue)
        this.archivementId = archivementId
    }

    checkForCompletion() {
        const relatedLevel:number = Number(GameManager.getInstance().getVariable(this.archivementId)?.getValue())
        const condition = relatedLevel>=this.requiredValue
        if (condition){
            GameManager.getInstance().setPermaVariable(1,this.varId)
        }
        return condition
    }
}