import faker from 'faker';
import getCharacterProperties from './character-properties';

const CreateCharacterMock = () => {
  const newCharacter = {
    created: new Date(),
    userName: faker.name.firstName(),
    basics: {
      name: faker.name.firstName(),
      player: faker.name.firstName(),
      LVL: Math.random() * 10,
      XP: Math.random() * 100,
      homeland: 'Unknown',
      type: getCharacterProperties.getType(),
      alignment: getCharacterProperties.getAlignment(),
      deity: 'None',
      abilityBoost: '+3'
    },
    appearance: {
      age: undefined,
      eyes: undefined,
      hair: 'Brown',
      weight: 'Unknown',
      height: 'Unknown',
      gender: getCharacterProperties.getGender(),
    },
    mainStats: {
      STR: '+15',
      DEX: '+15',
      CON: '+15',
      INT: '+15',
      WIS: '+15',
      CHA: '+15',
      AC: '+15',
      TOUCHAC: '+15',
      HP: '120',
    },
    modifiers: {
      CHA: '+10',
      CON: '+10',
      DEX: '+10',
      INT: '+10',
      WIS: '+10',
      STR: '+10',
      FORT: '+10',
      WILL: '+10',
      REFLEX: '+10',
      TOUCHAC: '+10',
      AC: '+10',
      PER: '+10',
    },
    items: {
      worn: 'backpack studded leather armor',
      ready: 'rapier, daggers (6), thieves tools',
      stowed: 'hooded lantern, oil (5), rations (3), silk rope (50ft)',
      coins: {
        gold: 4,
        silver: 3,
        copper: 0,
        platinum: 0,

      },
      bulk: '3 Bulk, 2 light (encumbered beyond 5 Bulk, max 10 Bulk)',
    },
    actions: {
      stride: '30 feet',
      melee: ['rapier +5 (deadly 1d8, disarm, finesse), Damage 1d6+4 piercing'],
      ranged: ['dagger +5 (agile, finesse, thrown 10, versatile slashing) Damage 1d4 piercing']
    },
    ancestryProps: {
      ancestry: getCharacterProperties.getAncestry(),
      size: 'Medium',
      speed: 120,
      languages: ['Common'],
      ancestryTraits: ['Unknown'],
      attributes: {}
    },
    backgroundProps: {
      background: getCharacterProperties.getBackground(),
      selectBoost: ['DEX'],
      freeAbilityBoost: 1,
      skillFeat: 'None',
      loreSkill: 'None',
    },
    classProps: {
      class: getCharacterProperties.getClass(),
      keyAbility: ['DEX'],
      baseHP: 8,
      proficiencies: { sword: '+2' },
      savingThrows: { ranged: '+2' },
      skills: { sneak: 'master' },
      weapons: { bow: 'trained' },
      armor: { heavy: 'trained' },
      signatureSkills: ['Elbow drop'],
      classFeatures: ['Unknown'],
      items: ['Magic bag'],
      spells: { 'magic missile': 'Big damage' }
    },
    characterTraits: {},
    characterNotes: {
      backstory: 'From the mean streets.'
    },
    skillsModifiers: {
      Acrobatics: 4,
      Athletics: 1,
      Crafting: 2,
      Deception: 2,
      Diplomacy: 2,
      Intimidation: 2,
      Lore: 2,
      Performance: 2,
      Religion: 2,
      Society: 2,
      Stealth: 4,
      Thievery: 4,
    },
    skillFeats:[ 'Cat Fall', 'Experienced Smuggler'],
    spells: {
      roll: '+5',
      DC: '15',
      cantrips: ['detect magic', 'forbidding ward', 'light', 'stabilize'],
      One: ['bless', 'sanctuary'],
      DomainPower: 'fire ray (fire domain)',
      SpellPoints: '4',
    },
    feats: {
      ancestry: 'Natural Ambition',
      class: 'Reactive Shield, Sudden Charge',
    },
    deleted: 0
  }
  return newCharacter
}

export default CreateCharacterMock