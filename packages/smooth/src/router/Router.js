import { useContext } from 'react'
import { __RouterContext } from 'react-router-dom'

export {
  Router,
  BrowserRouter,
  StaticRouter,
  Route,
  Redirect,
  Prompt,
  Switch,
  generatePath,
  matchPath,
  withRouter,
} from 'react-router-dom'

export function useRouter() {
  return useContext(__RouterContext)
}
