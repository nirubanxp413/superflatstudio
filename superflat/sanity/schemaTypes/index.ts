import {projectType} from './project'
import {updateType} from './update'
import {thoughtType} from './thought'
import {sketchType} from './sketch'
import {staticPageType} from './staticPage'
import {blockTypes} from './blocks'
import {appsCtaType, appsNavLinkType} from './apps/appShared'
import {appPageBlockTypes} from './apps/appPageBlocks'
import {appPageType} from './apps/appPage'

export const schemaTypes = [
  projectType,
  updateType,
  thoughtType,
  sketchType,
  staticPageType,
  appPageType,
  appsCtaType,
  appsNavLinkType,
  ...appPageBlockTypes,
  ...blockTypes,
]
