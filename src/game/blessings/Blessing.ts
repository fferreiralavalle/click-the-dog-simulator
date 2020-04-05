import GameManager from "../GameManager"

export class Blessing{
    id: string
    base: number

    constructor(id: string, base: number){
        this.id = id
        this.base = base
    }

    isUnlocked(): boolean {
        const level = Number(GameManager.getInstance().getVariable(this.id).getValue())
        const isUnlocked = level > 0
        return isUnlocked
    }

    getBonus(): number {
        const isUnlocked = this.isUnlocked()
        const value = isUnlocked ? this.base : 1
        return value
    }

}

export class BlessingDefault0 extends Blessing {
    
    getBonus(): number {
        const isUnlocked = this.isUnlocked()
        const value = isUnlocked ? this.base : 0
        return value
    }
}