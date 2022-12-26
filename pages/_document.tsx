import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initalProps = await Document.getInitialProps(ctx)

        return initalProps
    }

    render() {
        return (
            <Html lang='es'>
                <Head>

                    <link rel="icon" type="image/png" sizes="32x32" href="/icon.png" />
                    <meta name='language' content='es_ve' />
                    <meta name='audience' content='all' />
                    <meta name='keywords' content='mascotas, perros, gatos, adoptar' />
                    <meta name='og:locale' content='es_ve' />
                    <meta property='og:locale' content='es_ve' />
                    <meta name="og:type" content="website" />
                    <meta property="og:type" content="website" />
                    
                </Head>
                <body>
                    <Main />
                    <div id='portal'></div>
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument