export default interface Filter {
  user?: string,
  class?: string,
  ancestry?: string,
  level?: {
    $lte?: number,
    $gte?: number
  }
}