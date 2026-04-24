import {projectType} from './project'
import {updateType} from './update'
import {thoughtType} from './thought'
import {sketchType} from './sketch'
import {staticPageType} from './staticPage'
import {blockTypes} from './blocks'

export const schemaTypes = [
  projectType,
  updateType,
  thoughtType,
  sketchType,
  staticPageType,
  ...blockTypes,
]
