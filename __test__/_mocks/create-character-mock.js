const faker = require('faker');
const sample = require('lodash').sample;
const {charProps} = require('../_mocks/character-properties');

exports.createCharacterMock = () => {
    const newCharacter = {
        player: sample(charProps.types),
    
        name: faker.name.firstName(),
        class: sample(charProps.classes),
        ancestry: sample(charProps.ancestries),
        type: "Iconic",
        gender: sample(charProps.genders),
        alignment: sample(charProps.alignments),
        age: 'unknown',
        hair: 'Brown',
        eyes: 'Brown',
        height: 'Unknown',
        weight: 'Unknown',
        level: faker.random.number(20),
        XP: faker.random.number(20000),
        attributes: { Init: 2, Senses: { Perception: 16 } },
        STR: faker.random.number(30),
        DEX: faker.random.number(30),
        CON: faker.random.number(30),
        INT: faker.random.number(30),
        WIS: faker.random.number(30),
        CHA: faker.random.number(30),
        baseAttack: 12,
        CMB: { base: 22, additional: { "bull rush": 24 } },
        CMD: { base: 35, vs: { "bull rush": 37 } },
        feats: [
        "Cleave",
        "Exotic Weapons Proficiency (bastard sword)",
        "Power Attack",
        "Great Cleave",
        "Improved Bull Rush",
        "Toughness",
        "Weapon Proficiency (bastard sword)"
        ],
        skills: {
        Climb: 23,
        HandleAnimal: 9,
        Intimidate: 15,
        Perception: 16,
        Survival: 13,
        Swim: 20
        },
    
        size: "Medium",
        defense: {
        AC: faker.random.number(30),
        touch: faker.random.number(30),
        "flat-footed": {
            base: 22,
            armor: 9,
            deflection: 3,
            Dex: 2,
            natural: 2,
            rage: -2
        }
        },
        hp: { base: faker.random.number(300), aug: "12d12+108" },
        Fort: faker.random.number(30),
        Ref: faker.random.number(30),
        Will: faker.random.number(30),
        offense: {
        Speed: 40,
        Melee: { modifiers: { baseAttack: 3, }, name: "Large bastard sword" },
        Ranged: { modifiers: { baseAttack: 1, }, name: "Longbow" },
        SpecialAttacks: {
            "Greater rage": "30 rounds/day",
            "Rage powers": "guarded stance [+3 dodge vs melee",
            "Increased damage reduction": "+1",
            "Powerful Blow": "+4",
            "Renewed vigor": "3d8+7 hp",
            "Strength surge": "+12",
            "Surprise accuracy": "+4"
        }
        },
    
        languages: ["Common"],
        gear: {
        weapons: {
            "Javelin of Lightning": { amount: 1, modifiers: {} },
            "Large Bastard Sword": { amount: 1, modifiers: { attackBonus: 3 } },
            LongBow: { amount: 1, modifiers: { arrows: 20 } }
        },
        potions: {
            "Potions of Cure Serious Wounds": { amount: 5 },
            "Potion of Delay Poison": { amount: 1 },
            "Potion of Fly": { amount: 1 },
            "Potion of Hase": { amount: 1 },
            "Potion of Lesser Restoration": { amount: 1 }
        },
        armor: {
            "Hide Armor": { amount: 1, modifiers: { AC: 5 } },
            "Belt of Physical Might": { amount: 1, modifiers: { STR: 4, DEX: 4 } },
            "Cloak of Resistence": { amount: 1, modifiers: { AC: 4 } }
        },
        other: {
            backpack: { amount: 1 },
            bedroll: { amount: 1 },
            caltrops: { amount: 1 },
            shovel: { amount: 1 },
            torches: { amount: 5 },
            waterskin: { amount: 1 },
            gp: faker.random.number(3000),
            'trail rations': { amount: 4 },
            'flint and steel': { amount: 1 },
            'hemp rope (50 ft)': { amount: 1 },
        }
        },
        homeland: 'Realm of the Mammoth Lords',
        deity: 'Gorum',
        bio: faker.lorem.paragraph(),
        ancestryProps: {},
        backgroundProps: {},
        classProps: {},
    };
    
    return newCharacter;
}