import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

const getDistanceToNow = ( date: number ) => {
    const fromNow = formatDistanceToNow( date, { locale: es } )

    return `hace ${ fromNow }`
}

export {
    getDistanceToNow,
}