import ids from '../game/VariableId'
import variables from '../game/VariableId'

export interface Text {
    products: {
        divinePetting: {
            title: string,
            description: string
        },
        farm: {
            title: string,
            description: string
        },
        park: {
            title: string,
            description: string,
            lovePerRelic: string,
            quest: string,
            quests: {
                tier0: {
                    title: string,
                    description: string
                },
                tier1: {
                    title: string,
                    description: string
                },
                tier2: {
                    title: string,
                    description: string
                }
            },
            relicChance: string,
            claim: string,
            notReady: string,
            claimPreview: string
        },
        common: {
            info: string,
            stats: string,
        }
    },
    relics: {
        relic: string,
        tier0: {
            relicTier0A: RelicText,
            relicTier0B: RelicText,
            relicTier0C: RelicText,
        }
    },
    currencies: {
        love: string
        treats: string,
        pattience: string
    }
}

export interface RelicText {
    title: string
    description: string
    image: string
}

export const english:Text = {
    products: {
        divinePetting: {
            title: "Divine Petting",
            description: ""
        },
        farm: {
            title: "The Farm",
            description: "Shelters lost pets in a cozy home, it also prepares EVENTS for them"
        },
        park: {
            title: "Park",
            description: "Gives pets the thrill of adventure for some treats, they may find rare relics!",
            lovePerRelic: "Per Relic",
            quest: "Quests",
            quests: {
                tier0: {
                    title: "Pupsploration",
                    description: "Allow your small pets to explore. They will return with a gift for you."
                },
                tier1: {
                    title: "Dogsploration",
                    description: "Allow your medium pets to explore. They will return with a gift for you."
                },
                tier2: {
                    title: "Bigboysploration",
                    description: "Allow your big boys to explore. What will they find?"
                },
            },
            relicChance: "Relic Chance",
            claim: "CLAIM REWARD!",
            notReady: "Not ready (Zzz)",
            claimPreview: "READY!"
        },
        common: {
            info: "Info",
            stats: "Stats"
        }
    },
    relics: {
        relic: "Relic",
        tier0: {
            relicTier0A: {
                title: "asd",
                description:  "asd",
                image:  "asd"
            },
            relicTier0B: {
                title:  "asd",
                description:  "asd",
                image:  "asd"
            },
            relicTier0C: {
                title:  "asd",
                description:  "asd",
                image:  "asd"
            },
        }
    },
    currencies: {
        love: "Love",
        treats: "Treats",
        pattience: "Patience Points"
    }
}

export const getText = ():Text =>{
    return english
}

export const getRelicText = (relicId: string):RelicText => {
    const relics = getText().relics
    switch (relicId){
        default:
            return relics.tier0.relicTier0A
        case variables.relicTier0B:
            return relics.tier0.relicTier0B
        case variables.relicTier0C:
            return relics.tier0.relicTier0C
    }
}
