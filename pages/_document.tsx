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

                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                    />
                    <link rel="icon" type="image/png" sizes="32x32" href="/icon.png" />
                    <meta name='audience' content='all' />
                    <meta name='keywords' content='mascotas, perros, gatos, adoptar' />
                    <meta name='og:locale' content='es_ve' />
                    <meta name="og:type" content="website" />
                    
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