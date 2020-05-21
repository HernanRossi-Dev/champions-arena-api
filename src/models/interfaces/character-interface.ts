import { Types } from 'mongoose'

export default interface ICharacter {
  created?: Date
  user: string
  _id: Types.ObjectId | string
  basics: {
    name: string,
    player: string,
    LVL: string | number,
    XP: string,
    homeland: string,
    type: string,
    alignment: string,
    deity: string,
    abilityBoost: string
  }
  appearance: {
    age: string,
    eyes: string,
    hair: string,
    weight: string,
    height: string,
    gender: string,
  }
  mainStats: {
    STR: string,
    DEX: string,
    CON: string,
    INT: string,
    WIS: string,
    CHA: string,
    AC: string,
    TOUCHAC: string,
    HP: string,
  }
  modifiers: {
    CHA: string,
    CON: string,
    DEX: string,
    INT: string,
    WIS: string,
    STR: string,
    FORT: string,
    WILL: string
    REFLEX: string,
    TOUCHAC: string,
    AC: string,
    PER: string,
  }
  items: {
    worn: string,
    ready: string,
    stowed: string,
    coins: {
      platinum: number,
      gold: number,
      silver: number,
      copper: number,
    },
    bulk: string,
  }
  ancestryProps: {
    ancestry: string,
    size: string,
    speed: number | string,
    languages: string[],
    ancestryTraits: string[],
    attributes: object
  }
  backgroundProps: {
    background: string,
    selectBoost?: string[],
    freeAbilityBoost?: number,
    skillFeat: string,
    loreSkill: string,
  }
  classProps: {
    class: string,
    keyAbility: string[],
    baseHP?: number | string,
    proficiencies: object,
    savingThrows: object,
    skills: object,
    weapons: object,
    armor: object,
    signatureSkills: string[],
    classFeatures: string[],
    items?: string[],
    spells?: object
  }
  characterTraits: object
  characterNotes: string
  skillsModifiers: object
  skillFeats: string
  spells: object
  actions: {
    stride: string,
    melee: string[],
    ranged: string[],
  }
  feats: object
}