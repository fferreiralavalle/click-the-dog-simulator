import variableIds from '../VariableId'
import { Currency } from '../products/Product'
import { multiplyCurrencyBy } from '../../utils/mathUtils'
import GameManager from '../GameManager'
import { BuildingIcons, getBuildingIcon } from '../../utils/uiUtil'

export interface UpgradeKing {
    id: string
    base: number

    isUnlocked(upgradeLevel: number, kingLevel:number): boolean
    canUpgrade(upgradeLevel: number, kingLevel:number, currency:Currency): boolean
    getCost(upgradeLevel: number): Currency
    getBonus(upgradeLevel: number): number
    getIcon(): BuildingIcons 
}

export class UpgradeKingStandar implements UpgradeKing {
    id: string
    base: number
    relatedId: string
    basePrice: Currency
    minLevel: number

    constructor(id:string, cost: Currency, relatedId:string, base:number=2){
        this.id=id
        this.base=base
        this.relatedId = relatedId
        this.basePrice = cost
        this.minLevel = 0
    }
    
    isUnlocked(upgradeLevel: number, kingLevel: number): boolean {
        const relatedIdLevel = this.minLevel + GameManager.getInstance().getVariable(this.relatedId).getValue()
        const requiredLevel = (upgradeLevel + 1) * 5
        const isKingHighEnough = upgradeLevel * 5 <= kingLevel
        return relatedIdLevel>=requiredLevel && isKingHighEnough
    }

    canUpgrade(upgradeLevel: number, kingLevel: number, currency:Currency): boolean {
        const modPrice = this.getCost(upgradeLevel)
        const codition = modPrice.currency.lte(currency.currency) && modPrice.treats.lte(currency.treats)
        const isUnlocked = this.isUnlocked(upgradeLevel, kingLevel)
        return codition && isUnlocked
    }

    getCost(upgradeLevel: number): Currency {
        const priceMult = Math.pow(50, upgradeLevel)
        const finalPrice = multiplyCurrencyBy(this.basePrice, priceMult)
        return finalPrice
    }

    getBonus(upgradeLevel: number): number {
        return Math.pow(this.base, Number(upgradeLevel))
    }

    getIcon(): BuildingIcons {
        return getBuildingIcon(this.relatedId)
    }
}

export class UpgradeKingMinLevel extends UpgradeKingStandar {

    constructor(id:string, cost: Currency, relatedId:string, base:number=2, minLevl:number=0){
        super(id, cost, relatedId, base)
        this.minLevel = minLevl
    }
}

