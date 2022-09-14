import Document, {
  DocumentContext,
  DocumentInitialProps,
  Html,
  Head,
  Main,
  NextScript
} from 'next/document'
import Script from 'next/script'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx)

    return initialProps
  }

  render() {
    return (
      <Html lang='es'>
        <Head />
        <body>
          <Main />
          <NextScript />
          <Script src='/getTheme.js' strategy='beforeInteractive' />
        </body>
      </Html>
    )
  }
}
