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
        king: {
            title: string,
            description: string,
            lovePerBuilding: string,
            buy: string,
            show: string,
            defaultTitle: string,
            defaultDescription: string,
            maxUpgradeLevel: string
        },
        common: {
            info: string,
            stats: string,
            price: string,
            close: string
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
    kingUpgrades: {
        upgrade: string
        upgrades: {
            [key: string]: RelicText
        }
    }
    currencies: {
        love: string
        treats: string,
        pattience: string,
        level: string
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
        king: {
            title: "King Baby",
            description: "Hello human, have a look. Buildings get new upgrades every 10 levels.",
            lovePerBuilding: "Per All Lvls",
            buy: "Buy",
            show: "Show Owned",
            defaultTitle: "Choose an Upgrade",
            defaultDescription: "",
            maxUpgradeLevel: "Upgrade Max"
        },
        common: {
            info: "Info",
            stats: "Stats",
            price: "Price",
            close: "Close"
        }
    },
    relics: {
        relic: "Relic",
        tier0: {
            relicTier0A: {
                title: "Ball of Petting",
                description: "Your own pets (clicks) give 5 times more love!"
            },
            relicTier0B: {
                title:  "Ball of Rubs",
                description: "Increases Belly Rub Day Love gained by 50%"
            },
            relicTier0C: {
                title:  "Ball of Science",
                description:  "Increases your Lab points by 50%"
            },
            relicTier0D: {
                title: "Ball of the Sky",
                description: "Your pets are 25% more powerful."
            },
            relicTier0E: {
                title:  "Ball of Farming",
                description: "Increases The Farms passive love gain by 50%"
            },
            relicTier0F: {
                title:  "Ball of Productivity",
                description:  "Increases your Lab research speed by 50%"
            },
        },
        tier1: {
            relicTier1A: {
                title: "Petting Sun",
                description: "Your petting becomes 50% more powerful."
            },
            relicTier1B: {
                title:  "Bone of Production",
                description: "Reduces event progress neeeded by 10%"
            },
            relicTier1C: {
                title:  "Rope of Cooking",
                description:  "Double the amount of artificial treats the Lab produces."
            },
            relicTier1D: {
                title: "Hand Blessing",
                description: "Increases Divine Petting hands amount by 50%"
            },
            relicTier1E: {
                title:  "Bone of Farming",
                description: "Increases The Farms passive love gain by 100%"
            },
            relicTier1F: {
                title:  "Rope of Science",
                description:  "Increases your Lab points by 50%"
            },
        }
    },
    kingUpgrades: {
        upgrade: "Upgrade",
        upgrades: {
            upgradeProduct0A: {
                title: "Petting Management",
                description: "With my help, your petting power will double. You are welcomed."
            },
            upgradeProduct1A: {
                title: "Farm Management",
                description: "Your farm is looking good, but what if it doubled its passive production..."
            },
            upgradeProduct2A: {
                title: "Lab Management",
                description: "Labs like treats right? I can double its Treat production for you."
            },
            upgradeProduct2B: {
                title: "Lab Activities Management",
                description: "I will double your labs passive love production. Their smarts need it."
            },
            upgradeProduct4A: {
                title: "Park Management",
                description: "My doogness, a dragon! Good thing I know how to double its love production."
            },
            upgradeProduct5A: {
                title: "Kingdom Management",
                description: "Even I need upgrades. With your help I can double my love production."
            },
        }
    },
    currencies: {
        love: "Love",
        treats: "Treats",
        pattience: "Patience Points",
        level: "Level"
    }
}

export const getText = ():Text =>{
    return english
}

export const getRelicText = (relicId: string):RelicText => {
    const relics = getText().relics
    if (relics.tier0[relicId]) return relics.tier0[relicId]
    if (relics.tier1[relicId]) return relics.tier1[relicId]
    return relics.tier0.relicTier0A
}

export const getKingUpgradeText = (upgradeId: string):RelicText => {
    const upgrades = getText().kingUpgrades
    if (upgrades.upgrades[upgradeId]) return upgrades.upgrades[upgradeId]
    return upgrades.upgrades.upgradeProduct0A
}
