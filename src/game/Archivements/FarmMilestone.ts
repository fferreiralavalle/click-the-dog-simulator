import { ArchivementBase } from "./Archivement";
import GameManager from "../GameManager";
import variables from "../VariableId";

class FarmMilestone extends ArchivementBase {
  checkForCompletion() {
    const level = GameManager.getInstance()
      .getVariable(variables.product1Level)
      ?.getValue();
    const condition = this.requiredValue <= level && !this.inUnlocked();
    if (condition) {
      GameManager.getInstance().setVariable(1, this.varId);
      const not = this.getBaseNotification();
      GameManager.getInstance().getNotificationManager().addNotification(not);
    }
    return condition;
  }
}

export default FarmMilestone;
