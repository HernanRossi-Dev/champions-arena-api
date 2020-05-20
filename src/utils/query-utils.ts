import { CharQueryType, CharFilterType } from '../models'

const processCharacterFilter = (query: CharQueryType): CharFilterType => {
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

export {
  processCharacterFilter
}