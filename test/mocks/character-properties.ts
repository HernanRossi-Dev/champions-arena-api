import { sample } from "lodash";

const CharacterProperties = {
  background:['Acolyte', 'Acrobat', 'Animal Whisperer', 'Barkeep',
  'Blacksmith', 'Criminal', 'Entertainer', 'Gladiator',
  'Hunter', 'Laborer', 'Merchant', 'Noble', 'Nomad', 'Sailor', 'Scholar',
  'Scout', 'Street Urchin', 'Warrior'],
  types: ['NPC', 'Player', 'Iconic'],
  classes: ['Barbarian', 'Alchemist', 'Bard', 'Cleric', 'Druid',
    'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Wizard'],
  ancestries: ['Dwarf', 'Elf', 'Gnome', 'Goblin', 'Half-elf', 'Half-orc', 'Halfling', 'Human'],
  genders: ['Male', 'Female', 'Other'],
  alignments: ['Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral',
    'Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'],
}

const getCharacterProperties = {
  getBackground: () : string => {return <string>sample(CharacterProperties.background)},
  getType: () : string => {return <string>sample(CharacterProperties.types)},
  getClass: () : string => {return <string>sample(CharacterProperties.classes)},
  getAncestry: () : string => {return <string>sample(CharacterProperties.ancestries)},
  getGender: () : string => {return <string>sample(CharacterProperties.genders)},
  getAlignment: () : string => {return <string>sample(CharacterProperties.alignments)},
}
export default getCharacterProperties