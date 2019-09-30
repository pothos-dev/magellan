import { ComponentType, ReactNode } from 'react'
import { NavigationAction } from 'react-navigation'
import { NavigationStackConfig } from 'react-navigation-stack'

export interface CreateNavigationOptions<Screens extends ScreenMap> {
  container?: React.ComponentType<ContainerProps<Screens>>
  stackConfig?: NavigationStackConfig
}

export interface CreateNavigationResult<Screens extends ScreenMap> {
  dispatchNavigationAction(action: NavigationAction): void

  navigate<Name extends Names<Screens>>(
    screenName: Name,
    params: Screens[Name]
  ): void

  navigateBack(): void

  NavigationRoot: ComponentType<ComponentMap<Screens>>
}

export type ScreenName = string
export type ScreenProps = Record<string, any>
export type ScreenMap = Record<ScreenName, ScreenProps>
export type ComponentMap<Screens extends ScreenMap> = {
  [Name in Names<Screens>]: ComponentType<Screens[Name]>
}

type Names<Screens extends ScreenMap> = keyof Screens & string

interface ContainerProps<Screens extends ScreenMap> {
  children: ReactNode
}
