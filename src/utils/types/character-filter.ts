type CharFilter = {
  user?: string,
  class?: string,
  ancestry?: string,
  level?: {
    $lte?: number,
    $gte?: number
  }
}

export default CharFilter