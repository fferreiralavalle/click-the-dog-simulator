import { Currency } from "./products/Product";
import { TimeManager } from "./TimeManager";
import Decimal from "break_infinity.js";
import ids from "./VariableId";
import permaIds from "./PermaVariablesId";
import { DogSkinInterface, DogSkinMinLevel } from "./dogSkins/dogSkin";
import { store } from "../App";
import { actions as uiAction } from "../reducers/uiUtils";

export interface DogSkinsList {
  [key: string]: DogSkinInterface;
}

export default class DogSkinsManager {
  skinList: DogSkinsList;

  constructor(timeManager: TimeManager) {
    this.skinList = initializeSkins();
    this.onTimePassed = this.onTimePassed.bind(this);
    timeManager.susbcribe({
      id: "DogSkin-time-subscriber",
      onTimePass: () => this.onTimePassed(),
    });
  }

  getUnlockedSkins(): Array<DogSkinInterface> {
    const skins: DogSkinInterface[] = [];
    Object.keys(this.skinList).forEach((key) => {
      if (this.skinList[key].inUnlocked()) {
        skins.push(this.skinList[key]);
      }
    });
    return skins;
  }

  onTimePassed(): Currency {
    let skinUnlocked = false;
    Object.keys(this.skinList).forEach((key) => {
      const result = this.skinList[key].checkForCompletion();
      if (result) {
        skinUnlocked = true;
      }
    });
    if (skinUnlocked) {
      store.dispatch(uiAction.updateBreedsAmount());
    }
    return { currency: new Decimal(0), treats: new Decimal(0) };
  }

  getDogSkin(skinId: string): DogSkinInterface {
    return this.skinList[skinId];
  }

  getDogSkins(): Array<DogSkinInterface> {
    const skins: DogSkinInterface[] = Object.keys(this.skinList).map((key) => {
      return this.skinList[key];
    });
    return skins;
  }
}

function initializeSkins(): DogSkinsList {
  return {
    //Building
    [permaIds.dogSkinShibaFarm]: new DogSkinMinLevel(
      permaIds.dogSkinShibaFarm,
      ids.archivementProduct1LevelMilestone
    ),
    [permaIds.dogSkinWizPug]: new DogSkinMinLevel(
      permaIds.dogSkinWizPug,
      ids.archivementProduct3LevelMilestone
    ),
    [permaIds.dogSkinLabLab]: new DogSkinMinLevel(
      permaIds.dogSkinLabLab,
      ids.archivementProduct2LevelMilestone
    ),
    [permaIds.dogSkinKing]: new DogSkinMinLevel(
      permaIds.dogSkinKing,
      ids.archivementUpgradeShopLevelMilestone
    ),
    [permaIds.dogSkinDragon]: new DogSkinMinLevel(
      permaIds.dogSkinDragon,
      ids.archivementProduct4LevelMilestone
    ),
    //Other
    [permaIds.dogSkinBoxer]: new DogSkinMinLevel(
      permaIds.dogSkinBoxer,
      ids.archivementClicks
    ),
    [permaIds.dogSkinShiba]: new DogSkinMinLevel(
      permaIds.dogSkinShiba,
      ids.product1Level,
      5
    ),
    [permaIds.dogSkinPug]: new DogSkinMinLevel(
      permaIds.dogSkinPug,
      ids.archivementProduct3LevelMilestone
    ),
    [permaIds.dogSkinYorkshireTerrier]: new DogSkinMinLevel(
      permaIds.dogSkinYorkshireTerrier,
      ids.upgradeShop,
      5
    ),
    [permaIds.dogSkinPomerian]: new DogSkinMinLevel(
      permaIds.dogSkinPomerian,
      ids.product4Level,
      5
    ),
  };
}
