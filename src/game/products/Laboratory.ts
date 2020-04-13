import { Product, Currency, CurrencySubscriber } from "./Product";
import ids from "../VariableId";
import GameManager from "../GameManager";
import { addCurrency, multiplyCurrencyBy } from "../../utils/mathUtils";
import Decimal from "break_infinity.js";
import { Park } from "./Park";
import { King } from "./UpgradeKing";
import { Tree } from "./Tree";
import { getBuildingIcon } from "../../utils/uiUtil";

export interface EventType {
  id: string;
  progressNeeded: number;
  baseReward: number;
  unlockLevel: number;
}
export interface Upgrade {
  id: string;
}
export interface UpgradeTier {
  upgrades: Upgrade[];
}
export interface UpgradeBase {
  baseBonus: number;
}
export interface UpgradeTier1A extends UpgradeBase {}
export interface UpgradeTier1B extends UpgradeBase {}
export interface UpgradeTier1C extends UpgradeBase {}

export class Laboratory implements Product {
  currencySubscribers: Array<CurrencySubscriber>;
  variableId: string;
  isUnlocked: boolean;
  currencyPerSecond: Currency;

  constructor(variableId: string, isUnlocked: boolean) {
    this.variableId = variableId;
    this.isUnlocked = isUnlocked;
    this.onTimePassed = this.onTimePassed.bind(this);
    this.currencySubscribers = [];
    this.currencyPerSecond = {
      currency: new Decimal(0),
      treats: new Decimal(0),
    };
  }
  getCurrencyPerSecond(): Currency {
    return this.currencyPerSecond;
  }
  updateCurrencyPerSecond(): Currency {
    const currencyUpgrade = this.getUpgradeBonus(ids.labUpgradeTier2C)
      .baseBonus;

    const currency: Currency = {
      currency: new Decimal(currencyUpgrade),
      treats: new Decimal(0),
    };
    this.currencyPerSecond = currency;
    return currency;
  }
  getProgressPerSecond(level?: number): number {
    const baseProgress = 0;
    const upgradeBonus = this.getUpgradeBonus(ids.labUpgradeTier1C);
    const progressPerSecond = baseProgress + upgradeBonus.baseBonus;
    return progressPerSecond;
  }

  getProgressGoal(): number {
    const base = 100;
    return base;
  }

  onTimePassed(timePassed: number): Currency {
    const pps: number = this.getProgressPerSecond();
    let progress = this.getProgress() + pps * timePassed;
    const goal = this.getProgressGoal();
    let totalCurrency: Currency = {
      currency: new Decimal(0),
      treats: new Decimal(0),
    };
    const cps: Currency = this.getCurrencyPerSecond();
    const currency: Currency = multiplyCurrencyBy(cps, timePassed);
    while (progress >= goal) {
      progress -= goal;
      // Relic Bonus
      const park = GameManager.getInstance().productManager.getProduct(
        ids.product4Level
      ) as Park;
      const relic1CBonus = park.getRelicBonus(ids.relicTier1C);
      const relic2CBonus = park.getRelicBonus(ids.relicTier2C);
      // King Upgrade Bonus
      const king = GameManager.getInstance().productManager.getProduct(
        ids.upgradeShop
      ) as King;
      const kingBonus = king.getUpgradeBonus(ids.upgradeProduct2A);

      const currencyEvent: Currency = {
        currency: new Decimal(0),
        treats: new Decimal(1 * kingBonus).mul(relic1CBonus).mul(relic2CBonus),
      };
      totalCurrency = addCurrency(totalCurrency, currencyEvent);
      GameManager.getInstance().addToVariable(currencyEvent.treats, ids.treats);
      this.onCurrencyTime(currencyEvent);
    }
    GameManager.getInstance().setVariable(progress, ids.product2Progress);
    GameManager.getInstance().addToVariable(currency.currency, ids.currency);
    totalCurrency = addCurrency(totalCurrency, currency);
    this.onCurrencyTime(currency);
    return totalCurrency;
  }

  subscribeToCurrency(cs: CurrencySubscriber): void {
    const alreadySubscribed = !this.currencySubscribers.filter(
      (sub) => sub.id === cs.id
    );
    if (!alreadySubscribed) {
      this.currencySubscribers.push(cs);
      console.log("Subscribed to Lab: ", cs.id);
    }
  }

  onCurrencyTime(currency: Currency) {
    this.currencySubscribers.forEach((sub) => {
      sub.onCurrency(currency);
    });
  }

  canUnlock(): boolean {
    const farmLevel: number = GameManager.getInstance()
      .getVariable(ids.product1Level)
      .getValue();
    const handsLevel: number = GameManager.getInstance()
      .getVariable(ids.product0Level)
      .getValue();
    const farmNeeded: number = 10;
    const handsNeeded: number = 10;
    return farmNeeded <= farmLevel && handsNeeded <= handsLevel;
  }
  getLevelUpPrice(level?: number): Currency {
    const basePrice = new Decimal(2);
    const lvl: number = level ? level : this.getLevel();
    const tree = GameManager.getInstance()
      .getProductManager()
      .getProduct(ids.treeOfGoodBoys) as Tree;
    const discount: number = tree.getBlessing(ids.blessing0A).getBonus();
    const finalPrice = basePrice
      .mul(lvl * 0.75)
      .plus(basePrice.pow(lvl / 3.5))
      .mul(discount)
      .floor();
    return {
      currency: new Decimal(0),
      treats: new Decimal(finalPrice),
    };
  }
  canLevelUp(): boolean {
    const treats = GameManager.getInstance().getVariable(ids.treats).getValue();
    const levelUpPrice = this.getLevelUpPrice().treats;
    return levelUpPrice.lte(treats);
  }
  levelUp(): boolean {
    const levelUpPrice = this.getLevelUpPrice().treats.mul(-1);
    if (this.canLevelUp()) {
      GameManager.getInstance().addToVariable(1, this.variableId);
      GameManager.getInstance().addToVariable(levelUpPrice, ids.treats);
      GameManager.getInstance().getProductManager().updateCurrenciesPerSecond();
      if (this.getLevel() === 1) {
        GameManager.getInstance()
          .getNotificationManager()
          .addNotification({
            id: "lab-unlock",
            background: getBuildingIcon(this.variableId).background,
            description:
              "Thank you for the treats mister! Hover over my lab to pupgrade your buildings.",
            image: getBuildingIcon(this.variableId).icon,
            seen: false,
            title: "Lab Unlocked!",
          });
      }
      return true;
    } else {
      return false;
    }
  }
  getLevel(): number {
    return Number(
      GameManager.getInstance().getVariable(this.variableId).getValue()
    );
  }

  /* UPGRADES */
  getUpgradePrice(upgradeId: string, plusLevels?: number): number {
    let finalPrice = 0;
    const plusLvl = plusLevels ? plusLevels : 1;
    const currentLevel = GameManager.getInstance()
      .getVariable(upgradeId)
      ?.getValue();
    for (let i = 1; i <= plusLvl; i++) {
      const requestedLevel = Math.max(i + (currentLevel ? currentLevel : 0), 0);
      const points = this.getUpgradeSigleLevelCost(upgradeId, requestedLevel);
      finalPrice += points;
    }
    return finalPrice;
  }

  getUpgradeSigleLevelCost(upgradeId: string, requestedLevel: number) {
    const points = 1 + Math.floor(requestedLevel / 10);
    return points;
  }

  getUpgradePointsTaken(upgradeId: string): number {
    const upgradeLevel = this.getUpgradeLevel(upgradeId);
    let totalPointsTaken = 0;
    for (let i = 1; i <= upgradeLevel; i++) {
      totalPointsTaken += this.getUpgradeSigleLevelCost(upgradeId, i);
    }
    return totalPointsTaken;
  }

  canBuyUpgrade(upgradeId: string, plusLevels: number): boolean {
    if (plusLevels < 0) return true;
    const points = this.getAvailablePoints();
    const price = this.getUpgradePrice(upgradeId, plusLevels);
    return points >= price;
  }

  buyUpgrade(upgradeId: string, plusLevels?: number): boolean {
    const finalPlusLevels = plusLevels ? plusLevels : 1;
    if (this.canBuyUpgrade(upgradeId, finalPlusLevels)) {
      const upgradeLevel = this.getUpgradeLevel(upgradeId);
      const result = Math.max(upgradeLevel + plusLevels, 0);
      GameManager.getInstance().setVariable(result, upgradeId);
      GameManager.getInstance().getProductManager().updateCurrenciesPerSecond();
      return true;
    }
    return false;
  }

  getAvailablePoints(level?: number): number {
    let points = this.getPoints(level);

    /* Tier 1 */
    points -= this.getUpgradePointsTaken(ids.labUpgradeTier1A);
    points -= this.getUpgradePointsTaken(ids.labUpgradeTier1B);
    points -= this.getUpgradePointsTaken(ids.labUpgradeTier1C);
    /* Tier 2 */
    points -= this.getUpgradePointsTaken(ids.labUpgradeTier2A);
    points -= this.getUpgradePointsTaken(ids.labUpgradeTier2B);
    points -= this.getUpgradePointsTaken(ids.labUpgradeTier2C);

    return points;
  }

  getPoints(level?: number) {
    let points = level
      ? level
      : GameManager.getInstance().getVariable(ids.product2Level).getValue();
    //Relics
    const park = GameManager.getInstance().productManager.getProduct(
      ids.product4Level
    ) as Park;
    const relic0CBonus = park.getRelicBonus(ids.relicTier0C);
    const relic1FBonus = park.getRelicBonus(ids.relicTier1F);
    const relic2FBonus = park.getRelicBonus(ids.relicTier2F);
    // Tree Blessing
    const tree = GameManager.getInstance()
      .getProductManager()
      .getProduct(ids.treeOfGoodBoys) as Tree;
    const blessing1C: number = tree.getBlessing(ids.blessing1C).getBonus();

    points = Math.floor(
      (points + blessing1C) * relic0CBonus * relic1FBonus * relic2FBonus
    );
    return points;
  }

  getAvaiableUpgrades(level?: number): Array<UpgradeTier> {
    const lvl = level ? level : this.getLevel();
    const upgradeTiers = [this.getTierXUpgrades(0)];
    if (lvl >= 10) {
      upgradeTiers.push(this.getTierXUpgrades(1));
    }
    return upgradeTiers;
  }

  getTierXUpgrades(tier: number): UpgradeTier {
    switch (tier) {
      case 1:
        return {
          upgrades: [
            {
              id: ids.labUpgradeTier2A,
            },
            {
              id: ids.labUpgradeTier2B,
            },
            {
              id: ids.labUpgradeTier2C,
            },
          ],
        };
      default:
        return {
          upgrades: [
            {
              id: ids.labUpgradeTier1A,
            },
            {
              id: ids.labUpgradeTier1B,
            },
            {
              id: ids.labUpgradeTier1C,
            },
          ],
        };
    }
  }

  getUpgradeLevel(upgradeId: string) {
    const level = GameManager.getInstance().getVariable(upgradeId)?.getValue();
    return level ? level : 0;
  }

  getUpgradeBonus(upgradeId: string, level?: number): UpgradeBase {
    let lvl: number = level ? level : this.getUpgradeLevel(upgradeId);
    if (lvl < 0) lvl = 0;
    let base = 0;
    //Relics
    const park = GameManager.getInstance().productManager.getProduct(
      ids.product4Level
    ) as Park;
    //King
    const king = GameManager.getInstance().productManager.getProduct(
      ids.upgradeShop
    ) as King;
    // Tree Blessing
    const tree = GameManager.getInstance()
      .getProductManager()
      .getProduct(ids.treeOfGoodBoys) as Tree;

    switch (upgradeId) {
      /* TIER 2 */
      /* Treat Chance per Pet */
      case ids.labUpgradeTier2A:
        base = 0.975;
        return {
          baseBonus: 1 - Math.pow(base, lvl),
        };
      /* Farm double event bonus chance */
      case ids.labUpgradeTier2B:
        base = 0.975;
        return {
          baseBonus: 1 - Math.pow(base, lvl),
        };
      /* Gain love for each Farm and Pet lvl */
      case ids.labUpgradeTier2C:
        base = 0.5;
        let petLvl = GameManager.getInstance()
          .getVariable(ids.product0Level)
          .getValue();
        let farmLvl = GameManager.getInstance()
          .getVariable(ids.product1Level)
          .getValue();
        const kingLoveBonus = king.getUpgradeBonus(ids.upgradeProduct2B);
        const bonusRelic = park.getRelicBonus(ids.relicTier1G);
        const blessing0C: number = tree.getBlessing(ids.blessing0C).getBonus();
        return {
          baseBonus:
            base *
            lvl *
            (petLvl + farmLvl) *
            kingLoveBonus *
            bonusRelic *
            blessing0C,
        };
      /* Farm % Reduction*/
      case ids.labUpgradeTier1B:
        base = 0.96;
        return {
          baseBonus: Math.pow(base, lvl),
        };
      /* LAB treats */
      case ids.labUpgradeTier1C:
        base = lvl !== 0 ? 0.5 : 0;
        const relic0FBonus = park.getRelicBonus(ids.relicTier0F);
        const relic0FFinal = relic0FBonus !== 0 ? relic0FBonus : 1;
        return {
          baseBonus: base * lvl * relic0FFinal,
        };
      /* Pet Mastery */
      default:
        base = 1;
        return {
          baseBonus: base + 0.1 * lvl,
        };
    }
  }

  getProgress(): number {
    const progress = GameManager.getInstance()
      .getVariable(ids.product2Progress)
      .getValue();
    return progress;
  }
}
