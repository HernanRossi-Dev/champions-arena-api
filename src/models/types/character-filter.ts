import { QueryFindOptions } from "mongoose"

interface CharFilterType extends QueryFindOptions {
  user?: string
  class?: string
  ancestry?: string
  level?: {
    $lte?: number,
    $gte?: number
  }
  name?: string
}

export default CharFilterType