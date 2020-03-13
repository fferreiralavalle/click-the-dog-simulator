import {actions as mailActions} from '../reducers/Mails'
import { store } from "../App"

export default class NotificationManager {
    notifications: Notifications
    
    constructor(){
        this.notifications = {}
    }

    addNotification(notification: Notification){
        this.removeNotification(notification.id)
        this.notifications[notification.id]= notification
        store.dispatch(mailActions.updateMails())
    }

    removeNotification(id: string){
        delete this.notifications[id];
    }

    getAllNotifications(): Array<Notification>{
        const notifications = new Array<Notification>()
        Object.keys(this.notifications).map((id:string) => {
            notifications.push(this.notifications[id])
        })
        //so it gets newer first
        return notifications.reverse()
    }

    markNotificationAsSeen(id: string){
        const exists = this.containsNotification(id) 
        if (exists){
            this.notifications[id].seen = true
        }
    }

    markAllNotificationsAsSeen(){
        Object.keys(this.notifications).map((id:string) => {
            this.notifications[id].seen=true
        })
    }

    containsNotification(id: string): boolean{
        const not:Notification = this.notifications[id] 
        return !!not
    }

    getUnseenNotificationsAmount(){
        let amount = 0
        Object.keys(this.notifications).map((id:string) => {
            if(!this.notifications[id].seen){
                amount++
            }
        })
        return amount
    }
    
}

export interface Notification {
    id: string
    title: string,
    image: string,
    background: string,
    description: string,
    seen: boolean
}

export interface Notifications {
    [key: string]: Notification
}