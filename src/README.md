# @bearbytes/magellan

This is a wrapper around [react-navigation](https://github.com/react-navigation/react-navigation), the popular navigation library for React Native.

It adds improved Typescript support and a simplified API for basic navigation needs.

# Getting started

Install the dependency:
`npm i @bearbytes/magellan`

Define the available screens and their corresponding navigation parameters:

```typescript
export interface AppScreens {
  Home: {}
  UserProfile: { userId: string }
  Chat: { partnerUserId: string; isPrivate?: boolean }
}
```

Initialize the navigation system. It will create a StackNavigator which can be pre-configured with the usual [configuration](https://reactnavigation.org/docs/en/stack-navigator.html#stacknavigatorconfig):

```typescript
import { createNavigation } from './lib/Magellan/createNavigationRoot'
import { AppScreens } from './AppScreens'

export const {
  NavigationRoot,
  navigate,
  navigateBack,
  dispatchNavigationAction,
} = createNavigation<AppScreens>({
  // Pass configuration for the main StackNavigator here
  headerMode: 'none',
  transparentCard: true,
})
```

The `NavigationRoot` is a React Component that will contain the currently visible screen(s). Put it into the root of your app. You will need to pass it a component for each screen in the `AppScreens` interface.

```tsx
export default function MyApp() {
  return (
    <SomeContextProvider>
      <MaybeReduxContainerOrSomething>
        {/* Should be the main component */}
        <NavigationRoot
          Home={HomeScreen}
          UserProfile={UserProfileScreen}
          Chat={props => {
            // You could also create adhoc components in here.
            // The props passed to the component are equivalent to
            // navigation parameters in react-navigation.
            if (props.isPrivate) {
              return <PrivateChatScreen {...props} />
            } else {
              return <PublicChatScreen {...props} />
            }
          }}
        />
      </MaybeReduxContainerOrSomething>
    </SomeContextProvider>
  )
}
```

To avoid having to maintain duplicate props definitions, I would advise to use the `AppScreens` interface to define the screen props:

```tsx
export function UserProfileScreen(props: AppScreens['UserProfile']) {
  return <Text>Profile of {props.userId}.</Text>
}
```

# Navigating

As you may have noticed, the [navigation](https://reactnavigation.org/docs/en/navigation-prop.html) prop that is usually used in `react-nativation` is nowhere to be found here. Instead, `magellan` opts to use top level functions to navigate between screens:

```typescript
// The navigate function knows about which screens exist and
// what parameters can or must be passed to them. Typescript
// will enforce that we never forget something here.

navigate('UserProfile', { userId: 'bob' })

// Navigation params must always be passed, even when empty.
navigate('Home', {})

// Go back to the previous screen.
// Does nothing when there is only one screen on the stack.
navigateBack()

// The above actions should be enough for most usecases.
// If you need to use a more complex action, you can dispatch
// it directly. Note that unlike the other functions, no
// typesafeness is guaranteed here.
dispatchNavigationAction({ type: 'Navigation/OPEN_DRAWER' })

dispatchNavigationAction({
  type: 'Navigation/POP_TO_TOP',
  immediate: true,
})
```
