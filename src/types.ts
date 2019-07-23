import { ComponentType } from 'react'
import { NavigationAction } from 'react-navigation'

export type ScreenName = string
export type ScreenProps = Record<string, any>
export type ScreenMap = Record<ScreenName, ScreenProps>
export type ComponentMap<Screens extends ScreenMap> = {
  [Name in Names<Screens>]: ComponentType<Screens[Name]>
}

type Names<Screens extends ScreenMap> = keyof Screens & string

export interface CreateNavigationResult<Screens extends ScreenMap> {
  dispatchNavigationAction(action: NavigationAction): void

  navigate<Name extends Names<Screens>>(
    screenName: Name,
    params: Screens[Name]
  ): void

  navigateBack(): void

  NavigationRoot: ComponentType<ComponentMap<Screens>>
}
