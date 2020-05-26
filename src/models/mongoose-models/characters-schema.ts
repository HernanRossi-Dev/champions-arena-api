import { Document, model, Model, Schema, Types } from 'mongoose'
import { ICharacter } from "../interfaces"
import { ObjectID } from 'mongodb'

const CharacterSchema: Schema = new Schema({
  userName: String,
  basics: {
    name: String,
    player: String,
    LVL: String || Number,
    XP: String,
    homeland: String,
    type: String,
    alignment: String,
    deity: String,
    abilityBoost: String,
  },
  appearance: {
    age: String,
    eyes: String,
    hair: String,
    weight: String,
    height: String,
    gender: String,
  },
  mainStats: {
    STR: String,
    DEX: String,
    CON: String,
    INT: String,
    WIS: String,
    CHA: String,
    AC: String,
    TOUCHAC: String,
    HP: String,
  },
  modifiers: {
    CHA: String,
    CON: String,
    DEX: String,
    INT: String,
    WIS: String,
    STR: String,
    FORT: String,
    WILL: String,
    REFLEX: String,
    TOUCHAC: String,
    AC: String,
    PER: String,
  },
  items: {
    worn: String,
    ready: String,
    stowed: String,
    coins: {
      platinum: Number,
      gold: Number,
      silver: Number,
      copper: Number,
    },
    bulk: String,
  },
  ancestryProps: {
    ancestry: String,
    size: String,
    speed: Number,
    languages: Array,
    ancestryTraits: Array,
    attributes: Object
  },
  backgroundProps: {
    background: String,
    selectBoost: Array,
    freeAbilityBoost: Number,
    skillFeat: String,
    loreSkill: String,
  },
  classProps: {
    class: String,
    keyAbility: Array,
    proficiencies: Object,
    savingThrows: Object,
    skills: Object,
    weapons: Object,
    armor: Object,
    signatureSkills: Array,
    classFeatures: Array,
    items: Array,
  },
  characterTraits: Object,
  characterNotes: String,
  skillsModifiers: Object,
  skillFeats: String,
  spells: Object,
  actions: {
    stride: String,
    melee: Array,
    ranged: Array,
  },
  feats: Object,
}, { typeKey: '$type' })

export interface ICharacterDocument extends ICharacter, Document {
  _id: ObjectID
}

export const CharacterModel: Model<ICharacterDocument> = model<ICharacterDocument>('characters', CharacterSchema)
