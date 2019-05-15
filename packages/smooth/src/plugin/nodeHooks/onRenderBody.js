import { applyHook } from '../node'

export const onRenderBody = config => ({
  headComponents = [],
  htmlAttributes = {},
  bodyAttributes = {},
  preBodyComponents = [],
  postBodyComponents = [],
  bodyProps = {},
  pathname,
}) => {
  function setHeadComponents(components) {
    headComponents = [...headComponents, ...components]
  }

  function setHtmlAttributes(attributes) {
    htmlAttributes = { ...htmlAttributes, ...attributes }
  }

  function setBodyAttributes(attributes) {
    bodyAttributes = { ...bodyAttributes, ...attributes }
  }

  function setPreBodyComponents(components) {
    preBodyComponents = [...preBodyComponents, ...components]
  }

  function setPostBodyComponents(components) {
    postBodyComponents = [...postBodyComponents, ...components]
  }

  function setBodyProps(props) {
    bodyProps = { ...bodyProps, ...props }
  }

  applyHook(config, 'onRenderBody', {
    pathname,
    setHeadComponents,
    setHtmlAttributes,
    setBodyAttributes,
    setPreBodyComponents,
    setPostBodyComponents,
    setBodyProps,
  })

  return {
    headComponents,
    htmlAttributes,
    bodyAttributes,
    preBodyComponents,
    postBodyComponents,
    bodyProps,
  }
}
