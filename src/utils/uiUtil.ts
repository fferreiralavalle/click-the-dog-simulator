import numeral from 'numeral'
import { plusCurrency } from '../components/products/ProductPlus'
import Decimal from 'break_infinity.js'
import ids from '../game/VariableId'
import permaVariables from '../game/PermaVariablesId'
import { Blessing } from '../game/blessings/Blessing'

export const toFormat = (number: string | number | Decimal): string => {
    if (number instanceof Decimal){
        number = number.toString()
    }
    return numeral(number).format('0.[00]a').toUpperCase()
}

export const toFormatPure = (number: string | number | Decimal): string => {
    if (number instanceof Decimal){
        number = number.toString()
    }
    return numeral(number).format('0,0').toUpperCase()
}

export const clearPluses = (pluses: Array<plusCurrency>):Array<plusCurrency> =>{
    const max = isMobile() ? 5 : 10
    const newPluses = [...pluses]
    if (pluses.length>max){
        newPluses.splice(0,pluses.length-max)
    }
    return newPluses
}

export const isMobile = ():boolean => {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor);
    return check;
}

export const toFormatTime = (seconds:number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const sec = Math.floor(seconds % 60);
    const formatMinutes = (minutes < 10 ? "0": "") + minutes
    const formatsec = (sec < 10 ? "0": "") + sec
    return `${hours}:${formatMinutes}:${formatsec}`
}

export class BuildingIcons {
    icon: string
    background: string

    constructor(icon: string, background: string){
        this.icon = icon
        this.background = background
    }
}

export class ArchivementIcons {
    icon: string
    background: string

    constructor(icon: string, background: string){
        this.icon = icon
        this.background = background
    }
}

export class DogSkinIcon{
    icon: string

    constructor(icon: string){
        this.icon = icon
    }
}

export class BlessingIcon {
    icon: string

    constructor (icon: string){
        this.icon = icon
    }
}

export const getBuildingIcon = (building: string): BuildingIcons=>{
    switch(building){
        default:
            return new BuildingIcons('https://i.imgur.com/B00xNnt.png','https://i.imgur.com/6ZO4rY8.jpg')
        case ids.product1Level:
            return new BuildingIcons('https://i.imgur.com/L1eHWfM.png','https://i.imgur.com/G0KXJDf.jpg')
        case ids.product2Level:
            return new BuildingIcons('https://i.imgur.com/ajP1c6E.png','https://i.imgur.com/icoqc1B.jpg')
        case ids.product3Level:
            return new BuildingIcons('https://i.imgur.com/RakeK3M.png','https://i.imgur.com/AIK9tpI.jpg')
        case ids.product4Level:
            return new BuildingIcons('https://i.imgur.com/QJ3nDVL.png','https://i.imgur.com/uenbC1V.jpg')
        case ids.upgradeShop:
            return new BuildingIcons('https://i.imgur.com/4VroGvm.png','https://i.imgur.com/ZskZX6W.jpg')
        case ids.treeOfGoodBoys:
            return new BuildingIcons('https://i.imgur.com/iP4T4aC.png','https://i.imgur.com/zYb3z9n.jpg')
    }
}

export const getBlessingIcon = (blessingId: string): BlessingIcon => {
    switch(blessingId){
        default:
            return new BlessingIcon('https://i.imgur.com/iP4T4aC.png')
        case ids.blessing0B:
            return new BlessingIcon('https://i.imgur.com/DIPnpA9.png')
        case ids.blessing0C:
            return new BlessingIcon('https://i.imgur.com/NfCybaI.png')
        case ids.blessing1A:
            return new BlessingIcon(getBuildingIcon(ids.product0Level).icon)
        case ids.blessing1B:
            return new BlessingIcon(getBuildingIcon(ids.product1Level).icon)
        case ids.blessing1C:
            return new BlessingIcon(getBuildingIcon(ids.product3Level).icon)
        case ids.blessing2A:
            return new BlessingIcon(getBuildingIcon(ids.upgradeShop).icon)
        case ids.blessing2B:
            return new BlessingIcon(getBuildingIcon(ids.product4Level).icon)
    }
}

export const getArchivementIcon = (archivement: string): ArchivementIcons=>{
    let buildingIcon;
    let archivementDefaultBackground = 'https://i.imgur.com/GZl7HTq.jpg'
    switch(archivement){
        default:
            buildingIcon = getBuildingIcon(ids.product0Level)
            return new ArchivementIcons(buildingIcon.icon,archivementDefaultBackground)
        case ids.archivementProduct1LevelMilestone:
            buildingIcon = getBuildingIcon(ids.product1Level)
            return new ArchivementIcons(buildingIcon.icon, archivementDefaultBackground)
        case ids.archivementProduct2LevelMilestone:
            buildingIcon = getBuildingIcon(ids.product2Level)
            return new ArchivementIcons(buildingIcon.icon, archivementDefaultBackground)
        case ids.archivementProduct3LevelMilestone:
            buildingIcon = getBuildingIcon(ids.product3Level)
            return new ArchivementIcons(buildingIcon.icon, archivementDefaultBackground)
        case ids.archivementProduct4LevelMilestone:
            buildingIcon = getBuildingIcon(ids.product4Level)
            return new ArchivementIcons(buildingIcon.icon, archivementDefaultBackground)
        case ids.archivementUpgradeShopLevelMilestone:
            buildingIcon = getBuildingIcon(ids.upgradeShop)
            return new ArchivementIcons(buildingIcon.icon, archivementDefaultBackground)
    }
}

export const getDogSkinIcon = (skinId: string):DogSkinIcon => {
    switch(skinId){
        default:
            return new DogSkinIcon('https://i.imgur.com/V70781h.png')
        // Box Skins
        case permaVariables.dogSkinShibaFarm:
            return new DogSkinIcon(getBuildingIcon(ids.product1Level).icon)
        case permaVariables.dogSkinLabLab:
            return new DogSkinIcon(getBuildingIcon(ids.product2Level).icon)
        case permaVariables.dogSkinWizPug:
            return new DogSkinIcon(getBuildingIcon(ids.product3Level).icon)
        case permaVariables.dogSkinKing:
            return new DogSkinIcon(getBuildingIcon(ids.upgradeShop).icon)
        case permaVariables.dogSkinDragon:
            return new DogSkinIcon(getBuildingIcon(ids.product4Level).icon)
        // Archivements Skins
        case permaVariables.dogSkinBoxer:
            return new DogSkinIcon('https://i.imgur.com/cEKJzRo.png')
        case permaVariables.dogSkinShiba:
            return new DogSkinIcon('https://i.imgur.com/JyOe1wK.png')
        case permaVariables.dogSkinPug:
            return new DogSkinIcon('https://i.imgur.com/18fj9KF.png?1')  
        case permaVariables.dogSkinYorkshireTerrier:
            return new DogSkinIcon('https://i.imgur.com/Imuzu4p.png')
        case permaVariables.dogSkinPomerian:
            return new DogSkinIcon('https://i.imgur.com/pAx8fi5.png')    
    }
}
