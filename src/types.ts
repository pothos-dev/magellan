import { Unionize } from 'utility-types'

// Helper Types
type Dictionary<T = any> = Record<string, T>
type ObjectToArray<T> = T[keyof T]

// Base Types
export type BaseScreens = Dictionary

type SwitchContainer = { _navigator: 'switch' }
type StackContainer = { _navigator: 'stack' }
type ScreensContainer = SwitchContainer | StackContainer

type ScreenNames<T extends BaseScreens> = Exclude<keyof T, '_navigator'>

type ComponentMap<T extends BaseScreens> = {
  [Name in ScreenNames<T>]: T[Name] extends ScreensContainer
    ? ComponentMap<T[Name]>
    : React.ComponentType<T[Name]>
}

type Navigate<T extends BaseScreens> = {
  [K in ScreenNames<T>]: T[K] extends ScreensContainer
    ? Navigate<T[K]>
    : (props: T[K]) => void
}

export type MultiScreenRoute<T extends BaseScreens> = SingleScreenRoute<T>[]
export type SingleScreenRoute<T extends BaseScreens> = Unionize<
  {
    [Name in ScreenNames<T>]: T[Name] extends ScreensContainer
      ? Route<T[Name]>
      : T[Name]
  }
>

export type Route<T extends BaseScreens> = T extends SwitchContainer
  ? SingleScreenRoute<T>
  : MultiScreenRoute<T>

export interface ScreenContainerProps<T extends BaseScreens> {
  screens: ComponentMap<T>
}

export interface CreateScreensOptions<T extends BaseScreens> {}
export interface CreateScreensResult<T extends BaseScreens> {
  ScreenContainer: React.ComponentType<ScreenContainerProps<T>>
  useNavigate(): Navigate<T>
  navigate: Navigate<T>
}
