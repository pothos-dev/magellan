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
import { ScreenMap } from './types'

export function createNavigation<Screens extends ScreenMap>(
  navigatorConfig?: StackNavigatorConfig
) {
  let appContainerInstance: NavigationContainerComponent | null
  function dispatch(action: NavigationAction) {
    if (!appContainerInstance) {
      throw 'NavigationRoot is not initialized'
    }
    appContainerInstance.dispatch(action)
  }

  type Params = { [Screen in keyof Screens]: Screens[Screen] }
  function navigate<Screen extends keyof Screens & string>(
    screenName: Screen,
    params: Params[Screen]
  ) {
    dispatch({
      type: 'Navigation/NAVIGATE',
      routeName: screenName,
      params,
    })
  }

  function navigateBack() {
    dispatch({
      type: 'Navigation/BACK',
    })
  }

  type ComponentMap = {
    [Screen in keyof Screens]: React.ComponentType<Params[Screen]>
  }
  function NavigationRoot(screenComponents: ComponentMap) {
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

  return { navigate, navigateBack, NavigationRoot }
}
