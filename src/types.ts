import { Action } from '@react-navigation/core/lib/typescript/CommonActions'
import { StackActionType } from '@react-navigation/routers'
import { StackNavigationOptions } from '@react-navigation/stack'
import { ComponentType, ReactNode } from 'react'

// Options passed to createNavigation().
export interface CreateNavigationOptions<Screens extends ScreenMap> {
  container?: React.ComponentType<{ children: ReactNode }>
  stackNavigationOptions?: StackNavigationOptions
}

// Result of createNavigation().
export interface CreateNavigationResult<Screens extends ScreenMap> {
  // This it the component that will render the current screen.
  NavigationRoot: ComponentType<ComponentMap<Screens>>

  // Navigate to any screen, passing the props to the screen component.
  navigate<Name extends Names<Screens>>(
    screenName: Name,
    props: Screens[Name]
  ): void

  // Navigate back to the last screen.
  navigateBack(): void

  // Dispatch an arbitrary navigation action to the react-navigation lib.
  dispatchNavigationAction(action: MagellanAction): void
}

export type MagellanAction = Action | StackActionType

export type ScreenName = string
export type ScreenProps = Record<string, any>
export type ScreenMap = Record<ScreenName, ScreenProps>
export type ComponentMap<Screens extends ScreenMap> = {
  [Name in Names<Screens>]: ComponentType<Screens[Name]>
}

type Names<Screens extends ScreenMap> = keyof Screens & string
