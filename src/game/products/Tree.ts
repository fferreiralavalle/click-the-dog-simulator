import { Product, Currency, CurrencySubscriber } from "./Product";
import ids from "../VariableId";
import GameManager from "../GameManager";
import Decimal from "break_infinity.js";
import { multiplyCurrencyBy } from "../../utils/mathUtils";
import { getBuildingIcon } from "../../utils/uiUtil";
import { Blessing, BlessingDefault0 } from "../blessings/Blessing";
import permaVariables from "../PermaVariablesId";

export class BlessingTier {
  requiredPoints: Decimal;
  blessings: Blessing[];

  constructor(requiredPoints: Decimal, blessings: Blessing[]) {
    this.requiredPoints = requiredPoints;
    this.blessings = blessings;
  }
}

export class Tree implements Product {
  currencySubscribers: CurrencySubscriber[];
  variableId: string;
  isUnlocked: boolean;
  currencyPerSecond: Currency;
  blessings: BlessingTier[];

  constructor(variableId: string, isUnlocked: boolean) {
    this.variableId = variableId;
    this.isUnlocked = isUnlocked;
    this.currencyPerSecond = {
      currency: new Decimal(0),
      treats: new Decimal(0),
    };
    this.currencySubscribers = [];
    this.onTimePassed = this.onTimePassed.bind(this);
    this.blessings = this.initializeBlessings();
  }

  getCurrencyPerSecond(): Currency {
    return this.currencyPerSecond;
  }

  updateCurrencyPerSecond(
    level?: number,
    dontApply: boolean = false
  ): Currency {
    const newCurrencyPerSecond = {
      currency: new Decimal(0),
      treats: new Decimal(0),
    };
    if (!dontApply) {
      this.currencyPerSecond = newCurrencyPerSecond;
    }
    return newCurrencyPerSecond;
  }

  subscribeToCurrency(cs: CurrencySubscriber): void {
    const alreadySubscribed = !this.currencySubscribers.filter(
      (sub) => sub.id === cs.id
    );
    if (!alreadySubscribed) {
      this.currencySubscribers.push(cs);
      console.log("Subscribed to Tree: ", cs.id);
    }
  }

  onTimePassed(timePassed: number): Currency {
    const cps: Currency = this.getCurrencyPerSecond();
    const add = multiplyCurrencyBy(cps, timePassed);
    GameManager.getInstance().addToVariable(add.currency, ids.currency);
    GameManager.getInstance().addToVariable(add.treats, ids.treats);
    this.currencySubscribers.forEach((sub) => {
      sub.onCurrency(add);
    });

    return add;
  }

  canUnlock(): boolean {
    const myRelic = GameManager.getInstance()
      .getVariable(ids.relicTier2SpecialBuildingA)
      ?.getValue();
    const timesReset = Number(
      GameManager.getInstance()
        .getPermaVariable(permaVariables.timesReset)
        ?.getValue()
    );
    const condition = myRelic > 0 || timesReset > 0;
    return condition;
  }

  getLevelUpPrice(): Currency {
    const basePrice: Decimal = new Decimal(30);
    const initialPrice: Decimal = new Decimal(9970);
    const linearIncrease: Decimal = new Decimal(1000);
    const currentLevel: number = Number(
      GameManager.getInstance().getVariable(this.variableId).getValue()
    );
    const tree = GameManager.getInstance()
      .getProductManager()
      .getProduct(ids.treeOfGoodBoys) as Tree;
    const discount: number = tree.getBlessing(ids.blessing0A).getBonus();
    const finalPrice = initialPrice
      .add(
        basePrice
          .mul(linearIncrease.mul(currentLevel))
          .add(basePrice.pow(currentLevel / 3 + 1))
      )
      .mul(discount);
    return {
      currency: finalPrice.floor(),
      treats: new Decimal(0),
    };
  }
  canLevelUp(): boolean {
    const currency: Decimal = new Decimal(
      GameManager.getInstance().getVariable(ids.currency).getValue()
    );
    const levelUpPrice = this.getLevelUpPrice().currency;
    const condition = levelUpPrice.lte(currency);
    return condition;
  }

  levelUp(): boolean {
    const levelUpPrice = this.getLevelUpPrice().currency.mul(-1);
    if (this.canLevelUp()) {
      GameManager.getInstance().addToVariable(1, this.variableId);
      GameManager.getInstance().addToVariable(levelUpPrice, ids.currency);
      GameManager.getInstance().getProductManager().updateCurrenciesPerSecond();
      if (this.getLevel() === 1) {
        GameManager.getInstance()
          .getNotificationManager()
          .addNotification({
            id: "tree-unlock",
            background: getBuildingIcon(this.variableId).background,
            description:
              "Come forth human, the time has come to make a hard desition...",
            image: getBuildingIcon(this.variableId).icon,
            seen: false,
            title: "The Tree of Good Boys has Appeared",
          });
      }
      return true;
    } else {
      return false;
    }
  }

  getLevel(): number {
    return GameManager.getInstance().getVariable(this.variableId).getValue();
  }

  getGoodBoyPointsThisGame(level?: number): Decimal {
    const lvl = level ? level : this.getLevel();
    const allLevels = new Decimal(this.getAllBuildingLevels());
    const goodBoyPointsPerLevel = this.getPointsPerAllLevel();
    const timePassed = Number(
      GameManager.getInstance().getVariable(ids.timePassed)?.getValue()
    );
    const goodBoyPointsPerSecond = this.getIncreasePerSecondPlayed();
    const mult = this.getGoodBoyPointsMultiplier(lvl);
    const goodBoyPointsThisGame = new Decimal(mult).mul(
      allLevels
        .mul(goodBoyPointsPerLevel)
        .add(goodBoyPointsPerSecond.mul(timePassed))
    );
    return goodBoyPointsThisGame;
  }

  getUsableGoodBoyPointsPoints(): Decimal {
    const points = new Decimal(
      Number(
        GameManager.getInstance()
          .getPermaVariable(permaVariables.goodBoypoints)
          .getValue()
      )
    );
    return points;
  }

  getGoodBoyPointsMultiplier(level?: number) {
    const lvl = level ? level : this.getLevel();
    const increasePerLevel = 0.05;
    const multiplier = 0.95 + increasePerLevel * lvl;
    return multiplier;
  }

  getBlessings(): BlessingTier[] {
    return this.blessings;
  }

  getBlessing(blessingId: string): Blessing {
    const blessings = this.getBlessings();
    let bless;
    blessings.forEach((blessingTier) => {
      const blessings = blessingTier.blessings;
      const blessing = blessings.find((b) => {
        return b.id === blessingId;
      });
      if (!!blessing) {
        bless = blessing;
        return true;
      }
    });
    if (bless) {
      return bless;
    }
    return this.blessings[0].blessings[0];
  }

  getBlessingPrice(blessingId: string): Decimal {
    const blessings = this.getBlessings();
    let price = new Decimal(0);
    blessings.forEach((blessingTier) => {
      const blessings = blessingTier.blessings;
      const blessing = blessings.find((b) => {
        return b.id === blessingId;
      });
      if (!!blessing) {
        price = blessingTier.requiredPoints;
        return true;
      }
    });
    return price;
  }

  getAllBuildingLevels() {
    const petLevel = GameManager.getInstance()
      .getVariable(ids.product0Level)
      ?.getValue();
    const farmLevel = GameManager.getInstance()
      .getVariable(ids.product1Level)
      ?.getValue();
    const labLevel = GameManager.getInstance()
      .getVariable(ids.product2Level)
      ?.getValue();
    const wizpugLevel = GameManager.getInstance()
      .getVariable(ids.product3Level)
      ?.getValue();
    const kingLevel = GameManager.getInstance()
      .getVariable(ids.upgradeShop)
      ?.getValue();
    const parkLevel = GameManager.getInstance()
      .getVariable(ids.product4Level)
      ?.getValue();
    const sum =
      petLevel + farmLevel + labLevel + wizpugLevel + kingLevel + parkLevel;
    return sum;
  }

  getIncreasePerSecondPlayed() {
    return new Decimal(0.001);
  }

  getPointsPerAllLevel() {
    return new Decimal(5);
  }

  canPickBlessings() {
    const timesReset = Number(
      GameManager.getInstance()
        .getPermaVariable(permaVariables.timesReset)
        ?.getValue()
    );
    const hasPickedBlessings = Number(
      GameManager.getInstance().getVariable(ids.hasPickedBlessings)?.getValue()
    );
    return timesReset > 0 && hasPickedBlessings === 0;
  }

  pickBlessings(blessingsIds: string[]): boolean {
    const points = this.getUsableGoodBoyPointsPoints();
    let prices = new Decimal(0);
    const blessings = blessingsIds.map((id) => {
      prices = prices.add(this.getBlessingPrice(id));
      return this.getBlessing(id);
    });
    if (prices.lte(points)) {
      blessings.forEach((e) => {
        GameManager.getInstance().setVariable(1, e.id);
      });
      GameManager.getInstance().setVariable(1, ids.hasPickedBlessings);
      return true;
    }
    return false;
  }

  canLetGo(): boolean {
    const myRelic = GameManager.getInstance()
      .getVariable(ids.relicTier2SpecialBuildingA)
      ?.getValue();
    const condition = myRelic > 0;
    return condition;
  }

  initializeBlessings(): BlessingTier[] {
    return [
      new BlessingTier(new Decimal(1000), [
        new Blessing(ids.blessing0A, 0.9),
        new Blessing(ids.blessing0B, 2),
        new Blessing(ids.blessing0C, 1.05),
      ]),
      new BlessingTier(new Decimal(3000), [
        new Blessing(ids.blessing1A, 1.1),
        new Blessing(ids.blessing1B, 1.25),
        new BlessingDefault0(ids.blessing1C, 20),
      ]),
      new BlessingTier(new Decimal(5000), [
        new Blessing(ids.blessing2A, 0.7),
        new Blessing(ids.blessing2B, 0.8),
        new Blessing(ids.blessing2C, 5),
      ]),
    ];
  }
}
