import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { jwt } from "./utils";

export async function middleware( req: NextRequest, ev: NextFetchEvent ) {

    // if ( req.nextUrl.pathname.startsWith('/admin') ) {

    //     const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    //     if ( !session ) {
    //         const requestedPage = req.nextUrl.pathname as any;
    //         return NextResponse.redirect( `http://localhost:3000/auth/login?=${ requestedPage }` );
    //     }

    //     const validRoles = ['superuser', 'admin'];

    //     if ( !validRoles.includes( session.user.role ) ) {
    //         return NextResponse.redirect( 'http://localhost:3000/' )
    //     }

    //     return NextResponse.next()

    // }

    if ( req.nextUrl.pathname.startsWith('/auth') ) {
        const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        if ( session ) {
            const destination = req.nextUrl.searchParams.get('p') || '/';
            return NextResponse.redirect( `http://localhost:3000${destination}` );
        }
    }

    if ( 
        req.nextUrl.pathname.startsWith('/admin') ||
        req.nextUrl.pathname.startsWith('/api/admin') ||
        req.nextUrl.pathname.startsWith('/api/article') ||
        req.nextUrl.pathname.startsWith('/api/seed')
    ) {
        const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        const validRoles = ['superuser', 'admin'];

        if ( !session || !validRoles.includes( session.user.role ) ) {
            return NextResponse.redirect( 'http://localhost:3000/' );
        }
    }

    if ( req.nextUrl.pathname.startsWith('/personal') ) {
        const session: any = await getToken({ req });

        if ( !session ) {
            return NextResponse.redirect( 'http://localhost:3000/' )
        }
    }




    // if ( !token ) return new Response('No Autorizado', {
    //     status: 401
    // })

    // return new Response( 'Token:' + token );

    return NextResponse.next();

}