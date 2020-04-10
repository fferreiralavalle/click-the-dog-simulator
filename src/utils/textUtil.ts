import ids from '../game/VariableId'
import permaIds from '../game/PermaVariablesId'

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
        museum: {
            title: string,
            description: string,
            perArchivement: string,
            timeMult: string
        }
        tree: {
            title: string,
            description: string,
            letGoInfo: string,
            blessingsRules: string,
            multiplier: string,
            goodBoyPoints: string,
            totalLevels: string,
            options: string,
            seeBlessings: string,
            blessings: string,
            previous: string,
            letGo: string,
            notReady: string
            tier: string,
            perSecond: string,
            theDesition: string,
            areYouSure:string,
            letGoScreenText: string,
            letGoScreenClarification: string,
            imReady: string,
            notYet: string,
            pick: string,
            remove: string
            finish: string,
            notEnough: string
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
        },
        tier2: {
            [key: string]: RelicText
        }
    },
    kingUpgrades: {
        upgrade: string
        upgrades: {
            [key: string]: RelicText
        }
    },
    treeUpgrades: {
        blessings: {[key: string]: RelicText}
    },
    archivements: {
        archivementBaseTitle: string,
        archivemntTitle: string,
        archivements: {
            [key: string]: RelicText
        }
    },
    dogSkins: {
        breeds: string,
        origin: string,
        dogSkins: string,
        choose: string,
        skins: {
            [key: string]: DogSkinsTexts
        },
    },
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

export interface DogSkinsTexts {
    breed: string,
    description: string,
    temperament: string,
    maxSizeMts: number,
    origin: string
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
            description: "Hello human, have a look. Buildings get new upgrades every 5 levels.",
            lovePerBuilding: "Per All Levels",
            buy: "Buy",
            show: "Show Owned",
            defaultTitle: "Choose an Upgrade",
            defaultDescription: "",
            maxUpgradeLevel: "Upgrade Max"
        },
        museum: {
            title: "Museum",
            description: "Welcome Human, your archivements will grow with time. But don't expect any cat puns from me.",
            perArchivement: "Per Archivement",
            timeMult: "Time Increase"
        },
        tree: {
            title: "Tree of Good Boys",
            description: "Come closer human, I've been watching your work for a while now. You've made these Good Boys very happy, but I need to ask you something.",
            letGoInfo: "Your Good Boys are all grown up, they can take care of each other now. When you are ready, you can let them go and help me raise more dogs.",
            blessingsRules: "You can only buy blessings after you Let Go.",
            multiplier: "Multiplier",
            goodBoyPoints: "Good Boy Points",
            previous: "Usable",
            totalLevels: "Per All levels",
            options: "Desitions",
            theDesition: "The Desition",
            blessings: "Blessings",
            seeBlessings: "See Blessings",
            tier: "Bleesings Level",
            perSecond: "Per Second",
            letGo: "Let Go",
            notReady: "Can't let go yet",
            imReady: "I'm ready to let go",
            notYet: "Not yet",
            areYouSure: "Are you sure?",
            letGoScreenText: "You will meet your new Dogs with the following:",
            letGoScreenClarification: "You will also keep the Breeds you unlocked.",
            pick: "Pick",
            remove: "Remove",
            finish: "Finish Picking Blessings",
            notEnough: "Not Enough Points :c"
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
                description: "Adds the Farm's passive love production to Belly Rub Day's base Love gained."
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
                description: "Increases Divine Petting hands amount by 25%"
            },
            relicTier1E: {
                title:  "Bone of Farming",
                description: "Increases The Farms passive love gain by 100%"
            },
            relicTier1F: {
                title:  "Rope of Science",
                description:  "Increases your Lab points by 50%"
            },
            [ids.relicTier1G]: {
                title:  "Rope of Puptivities",
                description:  "Doubles the Labs love production"
            },
            [ids.relicMuseum]: {
                title:  "Scratched Map",
                description:  "A map that leads to an old building, it has scratch marks all over it."
            },
        },
        tier2: {
            [ids.relicTier2SpecialBuildingA]: {
                title:  "Mysterious Tree",
                description:  "This tree has a weird aura around it... Interesting."
            },
            [ids.relicTier2A]: {
                title:  "Ducky of Petting",
                description:  "Increases Pet Power by 75%"
            },
            [ids.relicTier2B]: {
                title:  "Moo Cow of Donations",
                description:  "Increases Treat Donations treats by 100%"
            },
            [ids.relicTier2C]: {
                title:  "Steak of Cooking",
                description:  "Double the amount of artificial treats the Lab produces"
            },
            [ids.relicTier2D]: {
                title:  "Ducky Negotiator",
                description:  "Decreases King Baby prices by 20%"
            },
            [ids.relicTier2E]: {
                title:  "Moo Cow of Farming",
                description:  "Increases The Farms passive love gain by 300%"
            },
            [ids.relicTier2F]: {
                title:  "Ducky the Scientist",
                description:  "Increases lab points by 100%. He's so smort."
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
            [ids.upgradeProduct5A]: {
                title: "Kingdom Management",
                description: "Even I need upgrades. With your help I can double my love production."
            },
            [ids.upgradeProduct7A]: {
                title: "Feline management",
                description: "Getting to a cat can seem hard, but with my help we will double its love production."
            },
        }
    },
    treeUpgrades: {
        blessings: {
            [ids.blessing0A]: {title: "Fond of You", description: "Leveling up your Boxes is 10% cheaper."},
            [ids.blessing0B]: {title: "Welcome Back Party", description: "You gain 100% more Patience Points while the game is closed."},
            [ids.blessing0C]: {title: "Know them Well", description: "Gained 5% more love."},
            [ids.blessing1A]: {title: "The Right Spot", description: "Increases Petting Power by 10%."},
            [ids.blessing1B]: {title: "Farm Expert", description: "The Farm prepares events 25% faster."},
            [ids.blessing1C]: {title: "Lab Teacher", description: "The Lab start with 20 extra points."},
            [ids.blessing2A]: {title: "Royal Understanding", description: "King Baby's upgrades are 30% cheaper."},
            [ids.blessing2B]: {title: "Dragon Motivator", description: "Reduces the parks timers 20%"},
            [ids.blessing2C]: {title: "Feline Rights", description: "The Museum produces five times more love."},
        }
    },
    archivements: {
        archivementBaseTitle: "Archivement Unlocked",
        archivemntTitle: "Archivements",
        archivements: {
            [ids.archivementClicks]: {
                title: "Hand of Love",
                description: "Pet your good boy 50 times."
            },
            [ids.archivementClicks2]: {
                title: "Hand of Affection",
                description: "Pet your good boy 500 times."
            },
            [ids.archivementProduct1LevelMilestone]: {
                title: "Farm of Love",
                description: "Reach level 15 in the Farm."
            },
            [ids.archivementProduct1LevelMilestone2]: {
                title: "Farm of Affection",
                description: "Reach level 30 in the Farm."
            },
            [ids.archivementProduct2LevelMilestone]: {
                title: "Lab of Love",
                description: "Reach level 15 in the Lab."
            },
            [ids.archivementProduct2LevelMilestone2]: {
                title: "Lab of Affection & Sciency Science",
                description: "Reach level 30 in the Lab."
            },
            [ids.archivementProduct3LevelMilestone]: {
                title: "Wizard of Love & Time",
                description: "Unlock the powerful Wizpug."
            },
            [ids.archivementProduct4LevelMilestone]: {
                title: "Park of Love (& Dragons)",
                description: "Reach level 15 in the Park."
            },
            [ids.archivementProduct4LevelMilestone2]: {
                title: "Park of Affection (& cutesy Dragons)",
                description: "Reach level 30 in the Park."
            },
            [ids.archivementUpgradeShopLevelMilestone]: {
                title: "Kingdom of Love",
                description: "Reach level 15 with King Baby."
            },
            [ids.archivementUpgradeShopLevelMilestone2]: {
                title: "Kingdom of Affection",
                description: "Reach level 30 with King Baby."
            },
            [ids.archivementMuseumLevelMilestone]: {
                title: "Strange Friendship",
                description: "Reach level 15 in the Museum."
            },
            [ids.archivementMuseumLevelMilestone2]: {
                title: "Not so Strange Friendship",
                description: 'Thank you for sharing your treats and Archivements with this lonely cat human... I will forever be greatful.'
            },
        }
    },
    dogSkins: {
        breeds: 'Breeds',
        origin: 'Origin',
        dogSkins: "Doggie Skins",
        choose: "Choose",
        skins: {
            initial: {
                breed: 'Golden Retriever (Puppy)',
                description: 'The eyes are round and dark, which is in contrast to the triangular or slanted composition of their American counterparts. British Golden Retrievers can have a coat colour of any shade of gold or cream.',
                temperament: 'They are described as "kindly, friendly and confident". Golden Retrievers make good family pets, particularly as they are patient with children. They are not "one-man dogs" and are generally equally amiable with both strangers and those familiar to them.',
                maxSizeMts: 0.61,
                origin: 'United Kingdom (Scotland)'
            },
            [permaIds.dogSkinBoxer]: {
                breed: 'Boxer',
                description: 'The Boxer is a short-haired breed, with a smooth coat that lies tight to the body. The recognized colors are fawn and brindle, frequently with a white underbelly and white on the feet.',
                temperament: 'Boxers are a bright, energetic and playful breed and tend to be very good with children. They are patient and spirited with children but also protective, making them a popular choice for families.',
                maxSizeMts: 0.64,
                origin: 'Germany'
            },
            [permaIds.dogSkinShiba]: {
                breed: 'Shiba Inu',
                description: 'The Shiba is double coated, with the outer coat being stiff and straight and the undercoat soft and thick. Fur is short and even on the fox-like face, ears, and legs. The purpose of the guard hairs is to protect their underlying skin and to repel rain or snow.',
                temperament: 'A relatively fastidious breed and feels the need to maintain itself in a clean state. Because of their fastidious and proud nature, Shiba puppies are easy to housebreak and in many cases will housebreak themselves.',
                maxSizeMts: 0.43,
                origin: 'Japan'
            },
            [permaIds.dogSkinPug]: {
                breed: 'Pug',
                description: 'Pugs have two distinct shapes for their ears, "rose" and "button". "Rose" ears are smaller than the standard style of "button" ears, and are folded with the front edge against the side of the head. Pugs legs are strong, straight, of moderate length.',
                temperament: 'Pugs are strong willed but rarely aggressive, and are suitable for families with children. The majority of the breed is very fond of children and sturdy enough to properly play with them. Depending on their owners mood, they can be quiet and docile but also vivacious and teasing.',
                maxSizeMts: 0.30,
                origin: 'China'
            },
            [permaIds.dogSkinYorkshireTerrier]: {
                breed: 'Yorkshire Terrier',
                description: 'The Yorkshire Terrier is the smallest dog breed of terrier type, and of any dog breed. The typical fine, straight, and silky Yorkshire Terrier coat has also been listed by many popular dog information websites as being hypoallergenic. In comparison with many other breeds',
                temperament: 'Yorkshire Terriers are very playful and energetic dogs. Many people who have a Yorkie as a pet have two, because they often have separation anxiety when left alone and "they don’t enjoy being alone."',
                maxSizeMts: 0.30,
                origin: 'United Kingdom (England)'
            },
            [permaIds.dogSkinPomerian]: {
                breed: 'Pomerian',
                description: 'Classed as a toy dog breed because of its small size, the Pomeranian is descended from larger Spitz-type dogs, specifically the German Spitz.',
                temperament: 'Pomeranians are typically friendly, lively and playful. They can be aggressive with other dogs and humans to try to prove themselves.',
                maxSizeMts: 0.30,
                origin: 'Germany, Poland'
            },
            //Buildings
            [permaIds.dogSkinShibaFarm]: {
                breed: 'Shiba Inu (Farmer)',
                description: 'Back in its days, this shiba was in charge of taking care of a japanese farm.',
                temperament: 'It used its temperament to guard its farm. Its favorite part of the day was eating with his master near the fireplace.',
                maxSizeMts: 0.43,
                origin: 'Japan'
            },
            [permaIds.dogSkinLabLab]: {
                breed: 'Labrador (Scientist)',
                description: 'Believe or not, this pupper is the head of its own scientific lab. In it, the pupper and its team make very sciency stuff.',
                temperament: 'Due to its hyper active nature, this pupper always motivates everyone to make their best sciency science work, making lots of science (and treats).',
                maxSizeMts: 0.31,
                origin: 'Science Factory (of Science) (Scotland)'
            },
            [permaIds.dogSkinWizPug]: {
                breed: 'Pug (Wizard)',
                description: 'Its breathing problems led him to strength its mind instead of its muscles. Because of that it is able to control time .',
                temperament: 'Its patience is only rivaled by its power, if its master shows patience to him, amaizing powers await them.',
                maxSizeMts: 0.30,
                origin: 'China'
            },
            [permaIds.dogSkinKing]: {
                breed: 'Yorkshire Terrier (King)',
                description: 'For what seems like centuries, this dogs family has rule its kingdom, their servants always provide them with food and drink, and also tuck them into bed.',
                temperament: 'The king favorite activies range between fetching forbidden artifacs and adventuring through its kingdom streets.',
                maxSizeMts: 0.31,
                origin: 'United Kingdom (England)'
            },
            [permaIds.dogSkinDragon]: {
                breed: 'Pomerian (Dragon)',
                description: 'This powerful dragon has rule the park all on its own, nothing can rival its all powerful roar.',
                temperament: 'Although it doesnt really show it, this dragon really likes going on adventures with its owner and other pets.',
                maxSizeMts: 0.30,
                origin: 'Germany, Poland'
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
    if (relics.tier2[relicId]) return relics.tier2[relicId]
    return relics.tier0.relicTier0A
}

export const getKingUpgradeText = (upgradeId: string):RelicText => {
    const upgrades = getText().kingUpgrades
    if (upgrades.upgrades[upgradeId]) return upgrades.upgrades[upgradeId]
    return upgrades.upgrades.upgradeProduct0A
}

export const getBlessingText = (blessingId: string): RelicText => {
    const {blessings} = getText().treeUpgrades
    const blessing = blessings[blessingId]
    if (blessing) return blessing
    return blessings[ids.blessing0A]
}

export const getArchivementText = (archivement: string):RelicText => {
    const {archivements} =  getText()
    let archivementText = archivements.archivements[archivement]
    if (archivementText){
        return archivementText
    }
    return archivements.archivements[ids.archivementClicks]
}

export const getDogSkinText = (dogSkinId: string):DogSkinsTexts => {
    const {dogSkins} =  getText()
    let skinText = dogSkins.skins[dogSkinId]
    if (skinText){
        return skinText
    }
    return dogSkins.skins.initial
}
