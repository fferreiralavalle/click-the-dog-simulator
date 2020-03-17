import numeral from 'numeral'
import { plusCurrency } from '../components/products/ProductPlus'
import Decimal from 'break_infinity.js'
import variables from '../game/VariableId'

export const toFormat = (number: string | number | Decimal): string => {
    if (number instanceof Decimal){
        number = number.toString()
    }
    return numeral(number).format('0.[00]a').toUpperCase()
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

export const getBuildingIcon = (building: string)=>{
    switch(building){
        default:
            return new BuildingIcons('https://i.imgur.com/B00xNnt.png','https://i.imgur.com/6ZO4rY8.jpg')
        case variables.product1Level:
            return new BuildingIcons('https://i.imgur.com/L1eHWfM.png','https://i.imgur.com/G0KXJDf.jpg')
        case variables.product2Level:
            return new BuildingIcons('https://i.imgur.com/mLU1yyE.png','https://i.imgur.com/icoqc1B.jpg')
        case variables.product3Level:
            return new BuildingIcons('https://i.imgur.com/RakeK3M.png','https://i.imgur.com/AIK9tpI.jpg')
        case variables.product4Level:
            return new BuildingIcons('https://i.imgur.com/QJ3nDVL.png','https://i.imgur.com/uenbC1V.jpg')
        case variables.upgradeShop:
            return new BuildingIcons('https://i.imgur.com/4VroGvm.png','https://i.imgur.com/ZskZX6W.jpg')
    }
}