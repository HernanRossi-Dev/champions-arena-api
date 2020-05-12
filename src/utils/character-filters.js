'use strict';

import lodash from 'lodash';

const CharacterFilters = {
  user: (value) => {
    return { user: value };
  },
  type: (value) => {
    return { 'basics.type': value };
  },
  class: (value) => {
    return { 'classProps.class': value };
  },
  ancestry: (value) => {
    return { 'ancestryProps.ancestry': value };
  },
  level_lte: (value, filter) => {
    const parseValue = parseInt(value, 10);
    const existFilter = lodash.get(filter, 'basics.LVL', null);
    const levelFilter = existFilter ? { 'basics.LVL': { $gte: existFilter.$gte, $lte: parseValue } } : { 'basics.LVL': { $lte: parseValue } };
    return levelFilter;
  },
  level_gte: (value) => {
    const parseValue = parseInt(value, 10);
    const levelFilter = { 'basics.LVL': { $gte: parseValue } };
    return levelFilter;
  },
};

export default CharacterFilters;