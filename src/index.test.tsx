import { createScreens } from './createScreens'
import { Route, SingleScreenRoute } from './types'

interface MyScreens {
  _navigator: 'switch'
  Loading: {}
  Auth: {
    _navigator: 'stack'
    Register: {}
    Login: { loginName: string }
  }
  App: {
    _navigator: 'stack'
    Home: {}
    Settings: {}
    EvenDeeper: {
      _navigator: 'stack'
      TheDarkness: {}
    }
  }
}

const { ScreenContainer, navigate } = createScreens<MyScreens>({})

const R: SingleScreenRoute<MyScreens> = {
  Loading: {},
  // Auth: [],
}

const R2: SingleScreenRoute<MyScreens> = {
  Loading: {},
  Auth: [],
}

const route: Route<MyScreens> = {
  Auth: [],
  App: [
    { Home: {} },
    {
      EvenDeeper: [
        {
          TheDarkness: {},
        },
      ],
    },
  ],
}

function MyScreens() {
  return (
    <ScreenContainer
      screens={{
        Loading: () => null,
        Auth: {
          Login: ({ loginName }) => null,
          Register: () => null,
        },
        App: {
          Home: () => null,
          Settings: () => null,
          EvenDeeper: {
            TheDarkness: () => null,
          },
        },
      }}
    />
  )
}
