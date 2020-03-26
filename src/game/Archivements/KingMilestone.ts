import { ArchivementBase } from "./Archivement";
import GameManager from "../GameManager";
import variables from "../VariableId";
import { getBuildingIcon } from "../../utils/uiUtil";

class KingMilestone extends ArchivementBase{

    constructor(varId: string, requiredValue: number){
        super(varId, requiredValue)
    }

    checkForCompletion() {
        const level = GameManager.getInstance().getVariable(variables.upgradeShop)?.getValue()
        const condition = this.requiredValue <= level && !this.inUnlocked()
        if (condition){
            GameManager.getInstance().setVariable(1, this.varId)
            const not = this.getBaseNotification()
            GameManager.getInstance().getNotificationManager().addNotification(not)
        }
        return condition
    }
}

export default KingMilestone