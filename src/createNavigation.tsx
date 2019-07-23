import React from 'react'
import {
  createAppContainer,
  createStackNavigator,
  NavigationAction,
  NavigationContainerComponent,
  NavigationRouteConfigMap,
  NavigationScreenProp,
  StackNavigatorConfig,
} from 'react-navigation'
import { ComponentMap, CreateNavigationResult, ScreenMap } from './types'

export function createNavigation<Screens extends ScreenMap>(
  navigatorConfig?: StackNavigatorConfig
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
    const routes: NavigationRouteConfigMap = {}
    for (const key in screenComponents) {
      const Component = screenComponents[key]
      routes[key] = (props: { navigation: NavigationScreenProp<any, any> }) => (
        <Component {...props.navigation.state.params} />
      )
    }

    const rootNavigator = createStackNavigator(routes, navigatorConfig)
    const AppContainer = createAppContainer(rootNavigator)

    return <AppContainer ref={ref => (appContainerInstance = ref)} />
  }

  return { dispatchNavigationAction, navigate, navigateBack, NavigationRoot }
}
