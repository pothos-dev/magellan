import { CommonActions, NavigationContainerRef } from '@react-navigation/core'
import { NavigationNativeContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import {
  ComponentMap,
  CreateNavigationOptions,
  CreateNavigationResult,
  MagellanAction,
  ScreenMap,
} from './types'

const Stack = createStackNavigator()

export function createNavigation<Screens extends ScreenMap>(
  options: CreateNavigationOptions<Screens>
): CreateNavigationResult<Screens> {
  // Global instance of the NavigationContainer to dispatch navigation actions to
  let globalContainer: NavigationContainerRef | null

  // This it the component that will render the current screen.
  function NavigationRoot(screenComponents: ComponentMap<Screens>) {
    const ScreenWrapper = options.container

    const stackScreens = []
    for (const screenName in screenComponents) {
      let ScreenComponent = screenComponents[screenName]

      if (ScreenWrapper) {
        ScreenComponent = props => (
          <ScreenWrapper>
            <ScreenComponent {...props} />
          </ScreenWrapper>
        )
      }

      stackScreens.push(
        <Stack.Screen
          name={screenName}
          component={({ navigation }) => (
            <ScreenComponent {...navigation.state.params} />
          )}
        />
      )
    }

    const StackNavigator = (
      <Stack.Navigator
        headerMode={'none'}
        screenOptions={options.stackNavigationOptions}
      >
        {stackScreens}
      </Stack.Navigator>
    )

    return (
      <NavigationNativeContainer ref={ref => (globalContainer = ref)}>
        {StackNavigator}
      </NavigationNativeContainer>
    )
  }

  function dispatchNavigationAction(action: MagellanAction) {
    if (!globalContainer) {
      throw 'NavigationRoot is not mounted'
    }
    globalContainer.dispatch(action)
  }

  function navigate<Name extends keyof Screens & string>(
    screenName: Name,
    params: Screens[Name]
  ) {
    dispatchNavigationAction(
      CommonActions.navigate({ name: screenName, params })
    )
  }

  function navigateBack() {
    dispatchNavigationAction(CommonActions.goBack())
  }

  return { dispatchNavigationAction, navigate, navigateBack, NavigationRoot }
}
