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
            claimPreview: string,
            notEnough: string,
            viewRelics: string
        },
        common: {
            info: string,
            stats: string,
            price: string,
        }
    },
    relics: {
        relic: string,
        tier0: {
            relicTier0A: RelicText,
            relicTier0B: RelicText,
            relicTier0C: RelicText,
            [key: string]: RelicText
        },
        tier1: {
            relicTier1A: RelicText,
            relicTier1B: RelicText,
            relicTier1C: RelicText,
            [key: string]: RelicText
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
                    description: "Let your puppers explore and find gifts for you."
                },
                tier1: {
                    title: "Dogsploration",
                    description: "Let your good boys explore and find gifts for you."
                },
                tier2: {
                    title: "Bigboysploration",
                    description: "Allow your big boys to explore. What will they find?"
                },
            },
            relicChance: "Relic Chance",
            claim: "CLAIM REWARD!",
            notReady: "Not ready (Zzz)",
            claimPreview: "READY!",
            notEnough: "Low Treats :c",
            viewRelics: "View Relics"
        },
        common: {
            info: "Info",
            stats: "Stats",
            price: "Price"
        }
    },
    relics: {
        relic: "Relic",
        tier0: {
            relicTier0A: {
                title: "Ball of Petting",
                description: "Your own pets are 5 times more powerful."
            },
            relicTier0B: {
                title:  "Bone of Production",
                description: "Reduces event progress neeeded by 10%"
            },
            relicTier0C: {
                title:  "Ball of Science",
                description:  "Increases your Lab points by 50%"
            },
        },
        tier1: {
            relicTier1A: {
                title: "Petting Sun",
                description: "Your petting becomes 25% more powerful."
            },
            relicTier1B: {
                title:  "Bone of Production",
                description: "Reduces event progress neeeded by 10%"
            },
            relicTier1C: {
                title:  "Rope of Cooking",
                description:  "Double the amount of artificial treats the Lab produces."
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
        // TIER 0
        default:
            return relics.tier0.relicTier0A
        case variables.relicTier0B:
            return relics.tier0.relicTier0B
        case variables.relicTier0C:
            return relics.tier0.relicTier0C
        // TIER 1
        case variables.relicTier1A:
            return relics.tier1.relicTier1A
        case variables.relicTier1B:
            return relics.tier1.relicTier1B
        case variables.relicTier1C:
            return relics.tier1.relicTier1C
    }
}
