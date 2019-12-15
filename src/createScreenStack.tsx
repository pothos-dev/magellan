import {
  NavigationContainerRef,
  NavigationProp,
  Route,
} from '@react-navigation/core'
import { NavigationNativeContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React, { createElement } from 'react'
import {
  BaseScreens,
  Navigate,
  ScreenContainerProps,
  ScreenStack,
} from './types'

const Stack = createStackNavigator()

export function createScreenStack<T extends BaseScreens>(): ScreenStack<T> {
  let containerRef: NavigationContainerRef

  function ScreenContainer(props: ScreenContainerProps<T>) {
    const screenNames = Object.keys(props.screens)

    return (
      <NavigationNativeContainer
        ref={ref => {
          containerRef = ref
        }}
      >
        <Stack.Navigator {...props}>
          {screenNames.map(screenName => (
            <Stack.Screen
              key={screenName}
              name={screenName}
              component={wrapComponent(props.screens[screenName])}
            />
          ))}
        </Stack.Navigator>
      </NavigationNativeContainer>
    )
  }

  function wrapComponent<P>(
    component: React.ComponentType<P>
  ): React.ComponentType<any> {
    return function({
      route,
      navigation,
    }: {
      route: Route<any>
      navigation: NavigationProp<any>
    }) {
      return createElement(component, route?.params ?? ({} as any))
    }
  }

  const navigate = new Proxy({} as Navigate<T>, {
    get(target, propertyName) {
      if (typeof propertyName != 'string') return
      // TODO nesting
      return function(props: any) {
        containerRef?.navigate(propertyName, props)
      }
    },
  })

  function useNavigate() {
    // TODO: fetch from context if multiple containers
    return navigate
  }

  return { ScreenContainer, navigate, useNavigate }
}
