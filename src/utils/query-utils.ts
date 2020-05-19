import { CharQuery, CharFilter } from './index'

const processCharacterFilter = (query: CharQuery): CharFilter => {
  const filter: CharFilter = {}
  const filterParams = ['user', 'class', 'ancestry']
  filterParams.forEach((key: string) => {
    if (query[key as keyof CharQuery]) {
      filter[key as keyof CharFilter] = query[key as keyof CharQuery]
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