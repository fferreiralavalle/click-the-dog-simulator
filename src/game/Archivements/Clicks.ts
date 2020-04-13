import { ArchivementBase } from "./Archivement";
import GameManager from "../GameManager";
import variables from "../VariableId";

class Clicks extends ArchivementBase {
  checkForCompletion() {
    const clicks = GameManager.getInstance()
      .getVariable(variables.clicks)
      ?.getValue();
    const condition = this.requiredValue <= clicks && !this.inUnlocked();
    if (condition) {
      GameManager.getInstance().setVariable(1, this.varId);
      const not = this.getBaseNotification();
      GameManager.getInstance().getNotificationManager().addNotification(not);
    }
    return condition;
  }
}

export default Clicks;
