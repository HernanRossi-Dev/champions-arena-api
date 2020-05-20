import { CharQueryType, CharFilterType, UserQueryType, UserFilterType } from '../models'
import { CharacterFilters } from '.'

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
  const filter: CharFilterType = Object.keys(query)
    .reduce<CharFilterType>((acc: object, key: string): object => {
      const value = query[key as keyof CharQueryType]
      const addFilter = CharacterFilters[key](value, filter)
      return Object.assign(acc, addFilter)
    }, {})
    return filter
}

const processFindUserFilter = (query: UserQueryType): UserFilterType => {
  const filter: UserFilterType = {}
  const filterParams = ['firstName', 'lastName', 'email', '_id']
  filterParams.map((param) => {
    if (query[param as keyof UserQueryType]) {
      const newFilterParam : string = query[param as keyof UserFilterType]!
      filter[param as keyof UserFilterType] = newFilterParam
    }
  })
  return filter
}

export {
  processFindCharacterFilter,
  processDeleteCharacterFilter,
  processFindUserFilter
}