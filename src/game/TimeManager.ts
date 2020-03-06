import { isMobile } from "../utils/uiUtil"
import { Currency } from "./products/Product"
import { addCurrenciy } from "../utils/mathUtils"

const tickTime = isMobile() ? 1 : 0.5
const modTimeFast = 0.5
let modTime = 1

export interface TimeSubscriber {
    id: string
    onTimePass: (timeMult: number) => Currency
}

export class TimeManager {
    subscribers: Array<TimeSubscriber>
    interval: NodeJS.Timeout

    constructor(){
        this.subscribers = []
        //if deleted throws error
        this.interval = setInterval(
            ()=>{
                this.passTime(tickTime)
            },
            1000 * tickTime * modTime)
        this.setInterval(modTime)
    }
    
    passTime(timeMult: number):Currency{
        let currencyGained: Currency = {currency:0,treats:0}
        this.subscribers.forEach(fun => {
            const cur=fun.onTimePass(timeMult)
            currencyGained = addCurrenciy(currencyGained,cur)
        })
        return currencyGained
    }
    
    susbcribe(sub: TimeSubscriber) {
        this.subscribers.push(sub)
    }
    
    unsubscribe(id: string){
        this.subscribers = this.subscribers.
        filter((sub: TimeSubscriber) => {
            return sub.id!==id
        })
    }
    
    setInterval(modTime: number){
        clearInterval(this.interval)
        this.interval = setInterval(
            ()=>{
                this.passTime(tickTime)
            },
            1000 * tickTime * modTime)
    }

    getTickTime():number{
        return tickTime
    }

}

