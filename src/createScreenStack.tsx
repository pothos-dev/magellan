import {
  NavigationContainerRef,
  NavigationProp,
  Route,
} from '@react-navigation/core'
import { NavigationNativeContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createElement, useRef } from 'react'
import {
  BaseScreens,
  CreateScreenStackOptions,
  CreateScreenStackResult,
  Navigate,
  ScreenContainerProps,
} from './types'

const Stack = createStackNavigator()

export function createScreenStack<T extends BaseScreens>(
  options: CreateScreenStackOptions
): CreateScreenStackResult<T> {
  const { stackOptions } = options

  const containerRef = useRef<NavigationContainerRef>()

  function ScreenContainer(props: ScreenContainerProps<T>) {
    const screenNames = Object.keys(props.screens)

    return (
      <NavigationNativeContainer ref={containerRef}>
        <Stack.Navigator screenOptions={stackOptions}>
          {screenNames.map(screenName => (
            <Stack.Screen
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

  const navigate: Navigate<T> = new Proxy(null as any, {
    get(target, propertyName) {
      if (typeof propertyName != 'string') return
      // TODO nesting
      return function(props: any) {
        containerRef.current?.navigate(propertyName, props)
      }
    },
  })

  function useNavigate() {
    // TODO: fetch from context if multiple containers
    return navigate
  }

  return { ScreenContainer, navigate, useNavigate, stackOptions }
}
