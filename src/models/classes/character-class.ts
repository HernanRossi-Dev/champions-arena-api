import { ObjectID } from "mongodb";
import { ICharacter } from "../interfaces";
import { ProcessError } from "../../errors";

export class Character implements ICharacter {
  userName: string
  _id: ObjectID
  created: Date
  updated?: Date
  basics: {
    name: string,
    player: string,
    LVL: string | number,
    XP: string | number,
    homeland?: string,
    type: string,
    alignment: string,
    deity?: string,
    abilityBoost: string
  }
  appearance: {
    age?: string,
    eyes?: string,
    hair?: string,
    weight?: string,
    height?: string,
    gender?: string,

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
    worn?: string,
    ready?: string,
    stowed?: string,
    coins?: {
      platinum: number,
      gold: number,
      silver: number,
      copper: number,
    },
    bulk?: string,
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
  characterTraits?: object
  characterNotes?: object
  skillsModifiers?: object
  skillFeats?: string[]
  spells?: object
  actions: {
    stride: string,
    melee: string[],
    ranged: string[],
  }
  feats?: object
  deleted: number

  constructor(character: ICharacter) {
    if (!character) throw new ProcessError('Character data must be provided.')
    if (!character.userName) throw new ProcessError('Character must have a userName.')
    this.userName = character.userName
    this._id = character._id || new ObjectID()
    this.created = character.created || new Date()
    this.updated = character.updated
    this.basics = character.basics
    this.appearance = character.appearance
    this.mainStats = character.mainStats
    this.modifiers = character.modifiers
    this.items = character.items
    this.ancestryProps = character.ancestryProps
    this.backgroundProps = character.backgroundProps
    this.classProps = character.classProps
    this.characterTraits = character.characterTraits
    this.characterNotes = character.characterNotes
    this.skillsModifiers = character.skillsModifiers
    this.skillFeats = character.skillFeats
    this.spells = character.spells ? character.spells : {}
    this.actions = character.actions ? character.actions : { stride: '', melee: [], ranged: [] }
    this.feats = character.feats ? character.feats : {}
    this.deleted = character.deleted ? character.deleted : 0
  }

  public getProperties(): ICharacter {
    return {
      userName: this.userName,
      _id: this._id,
      created: this.created,
      updated: this.updated,
      basics: this.basics,
      appearance: this.appearance,
      mainStats: this.mainStats,
      modifiers: this.modifiers,
      items: this.items,
      ancestryProps: this.ancestryProps,
      backgroundProps: this.backgroundProps,
      classProps: this.classProps,
      characterTraits: this.characterTraits,
      characterNotes: this.characterNotes,
      skillsModifiers: this.skillsModifiers,
      skillFeats: this.skillFeats,
      spells: this.spells,
      actions: this.actions,
      feats: this.feats,
      deleted: this.deleted
    }
  }
}