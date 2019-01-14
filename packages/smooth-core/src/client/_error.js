/** @jsx jsx */
import { jsx, css } from '@emotion/core'

export default function ErrorPage({ error }) {
  return (
    <div>
      <div
        css={css`
          color: #000;
          background: #fff;
          font-family: -apple-system, BlinkMacSystemFont, Roboto, 'Segoe UI',
            'Fira Sans', Avenir, 'Helvetica Neue', 'Lucida Grande', sans-serif;
          height: 90vh;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        `}
      >
        <div>
          <h1
            css={css`
              display: inline-block;
              border-right: 1px solid rgba(0, 0, 0, 0.3);
              margin: 0;
              margin-right: 20px;
              padding: 10px 24px 10px 0;
              font-size: 24px;
              font-weight: 500;
              vertical-align: top;
            `}
          >
            {error.statusCode || error.name}
          </h1>
          <div
            css={css`
              display: inline-block;
              text-align: left;
              line-height: 50px;
              height: 50px;
              vertical-align: middle;
            `}
          >
            <h2
              css={css`
                font-size: 14px;
                font-weight: normal;
                line-height: inherit;
                margin: 0;
                padding: 0;
              `}
            >
              {error.message}
            </h2>
          </div>
        </div>
        <code
          css={css`
            padding-top: 20px;
            max-height: 400px;
            overflow: auto;
            max-width: 90%;
            text-align: left;
          `}
        >
          <pre>{error.stack}</pre>
        </code>
      </div>
    </div>
  )
}
