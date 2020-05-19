import lodash from 'lodash'

const CharacterFilters: any = {
  user: (value: string) => {
    return { user: value }
  },
  type: (value: string) => {
    return { 'basics.type': value }
  },
  class: (value: string) => {
    return { 'classProps.class': value }
  },
  ancestry: (value: string) => {
    return { 'ancestryProps.ancestry': value }
  },
  level_lte: (value: string, filter: object) => {
    const parseValue = parseInt(value, 10)
    const existFilter = lodash.get(filter, 'basics.LVL', null)
    const levelFilter = existFilter ? { 'basics.LVL': { $gte: existFilter.$gte, $lte: parseValue } } : { 'basics.LVL': { $lte: parseValue } }
    return levelFilter
  },
  level_gte: (value: string) => {
    const parseValue = parseInt(value, 10)
    const levelFilter = { 'basics.LVL': { $gte: parseValue } }
    return levelFilter
  },
}

export default CharacterFilters