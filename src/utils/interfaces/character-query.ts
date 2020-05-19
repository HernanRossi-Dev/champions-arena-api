export default interface CharacterQuery {
  user?: string,
  class?: string,
  ancestry?: string,
  level_lte?: string,
  level_gte?: string
}