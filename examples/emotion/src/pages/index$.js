/** @jsx jsx */
import { jsx, css } from '@emotion/core'

export default () => (
  <div
    css={css`
      font: 15px Helvetica, Arial, sans-serif;
      background: #eee;
      padding: 100px;
      text-align: center;
      transition: 100ms ease-in background;

      &:hover {
        background: #ccc;
      }
    `}
  >
    <p>Hello World</p>
  </div>
)
