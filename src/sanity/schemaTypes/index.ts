import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {postType} from './postType'
import {authorType} from './authorType'
import {propertyType} from './property'
import {guideType} from './guide'
import {recommendationType} from './recommendation'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    postType,
    authorType,
    guideType,
    recommendationType,
    propertyType,
  ],
}
