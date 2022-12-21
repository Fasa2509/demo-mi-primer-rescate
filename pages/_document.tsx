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

                    <meta name='Keywords' content='mascotas, animales, perros, gatos, adopcion, adoptar, rescate, ayuda, ayudar, fundación' />
                    <meta name='og:locale' content='es_ve' />
                    <link rel="icon" type="image/png" sizes="32x32" href="/icon.png" />
                    
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