import { get } from 'lodash'
import { CharQueryType, CharFilterType, IUserQueryType, IUserFilterType } from '../models'

const processDeleteCharacterFilter = (query: CharQueryType): CharFilterType => {
  const filter: CharFilterType = {}
  const filterParams = ['user', 'class', 'ancestry']
  filterParams.forEach((key: string) => {
    if (query[key as keyof CharQueryType]) {
      filter[key as keyof CharFilterType] = query[key as keyof CharQueryType]
    }
  })
  if (query.level_lte || query.level_gte) {
    filter.level = {}
    if (query.level_lte) {
      filter.level.$lte = parseInt(query.level_lte, 10)
    }
    if (query.level_gte) {
      filter.level.$gte = parseInt(query.level_gte, 10)
    }
  }
  return filter
}

const processFindCharacterFilter = (query: CharQueryType): CharFilterType => {
  const filter: CharFilterType = {}
  const filterParams = ['user', 'class', 'ancestry', 'level', 'name']
  filterParams.map((param) => {
    if (query[param as keyof CharQueryType]) {
      const newFilterParam: string = <string>query[param as keyof CharQueryType]
      const addFilter = CharacterFilters[param](newFilterParam, filter)
      Object.assign(filter, addFilter)
    }
  })
  return filter
}

const processFindUserFilter = (query: IUserQueryType): IUserFilterType => {
  const filter: IUserFilterType = {}
  const filterParams = ['firstName', 'lastName', 'email', '_id', 'userName']
  filterParams.map((param) => {
    if (query[param as keyof IUserQueryType]) {
      const newFilterParam: string = <string>query[param as keyof IUserQueryType]
      filter[param as keyof IUserFilterType] = newFilterParam
    }
  })
  return filter
}

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
    const existFilter = get(filter, 'basics.LVL', null)
    const levelFilter = existFilter ? { 'basics.LVL': { $gte: existFilter.$gte, $lte: parseValue } } : { 'basics.LVL': { $lte: parseValue } }
    return levelFilter
  },
  level_gte: (value: string) => {
    const parseValue = parseInt(value, 10)
    const levelFilter = { 'basics.LVL': { $gte: parseValue } }
    return levelFilter
  },
}

export {
  processFindCharacterFilter,
  processDeleteCharacterFilter,
  processFindUserFilter
}