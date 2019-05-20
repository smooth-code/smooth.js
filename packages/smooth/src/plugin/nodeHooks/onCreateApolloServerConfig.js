import { applyHook } from '../node'

export const onCreateApolloServerConfig = config => ({
  apolloServerConfig: defaultApolloServerConfig,
}) => {
  let apolloServerConfig = defaultApolloServerConfig

  applyHook(config, 'onCreateApolloServerConfig', {
    getConfig() {
      return apolloServerConfig
    },
    actions: {
      setApolloServerConfig(additionalConfig) {
        apolloServerConfig = {
          ...apolloServerConfig,
          ...additionalConfig,
        }
      },
      replaceApolloServerConfig(newConfig) {
        apolloServerConfig = newConfig
      },
    },
  })

  return apolloServerConfig
}
