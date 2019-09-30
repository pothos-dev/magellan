import React from 'react'
import {
  createAppContainer,
  NavigationAction,
  NavigationContainerComponent,
  NavigationRouteConfigMap,
  NavigationScreenProp,
} from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import {
  ComponentMap,
  CreateNavigationOptions,
  CreateNavigationResult,
  ScreenMap,
} from './types'

export function createNavigation<Screens extends ScreenMap>(
  options: CreateNavigationOptions<Screens>
): CreateNavigationResult<Screens> {
  let appContainerInstance: NavigationContainerComponent | null

  function dispatchNavigationAction(action: NavigationAction) {
    if (!appContainerInstance) {
      throw 'NavigationRoot is not initialized'
    }
    appContainerInstance.dispatch(action)
  }

  function navigate<Name extends keyof Screens & string>(
    screenName: Name,
    params: Screens[Name]
  ) {
    dispatchNavigationAction({
      type: 'Navigation/NAVIGATE',
      routeName: screenName,
      params,
    })
  }

  function navigateBack() {
    dispatchNavigationAction({
      type: 'Navigation/BACK',
    })
  }

  function NavigationRoot(screenComponents: ComponentMap<Screens>) {
    const C = options.container

    const routes: NavigationRouteConfigMap<any, any> = {}
    for (const key in screenComponents) {
      const Component = screenComponents[key]
      routes[key] = (props: { navigation: NavigationScreenProp<any, any> }) => {
        const screenElement = <Component {...props.navigation.state.params} />
        if (C) {
          return <C>{screenElement}</C>
        } else {
          return screenElement
        }
      }
    }

    const rootNavigator = createStackNavigator(routes, options.stackConfig)
    const AppContainer = createAppContainer(rootNavigator)

    return <AppContainer ref={ref => (appContainerInstance = ref)} />
  }

  return { dispatchNavigationAction, navigate, navigateBack, NavigationRoot }
}
