// La principal (y practicamente unica) diferencia entre Typescript y Javascript es el agregado de tipos
// tenemos los types y las interfaces, hoy en dia la diferencia entre ambos es practicamente nula
// en general podemos hacer lo mismo con ambos

// todos los archivos .ts deben exportar algo para poder ser compilados

// puede ser cualquier cosa
export {};






// empezamos con los tipos
// el operador | 'o' nos permite decirle a un tipo que puede tener distintos valores
// esto solo puede hacerse con tipos
type Fruta = 'manzana' | 'pera' | 'melon';

type FrutaAnaranjada = 'naranja';

// para extender un tipo usamos &, o usamos | para decir que la variable puede ser uno u otro
// esto mismo tambien puede hacerse extendiendo con interfaces
type MisFrutas = Fruta | FrutaAnaranjada;

// podemos pulsar ctrl + spacebar para abrir las recomendaciones de VSC (autocompletado)
// asi tipamos cualquier cosa en TS
const miFruta: Fruta = 'manzana';

const IUsuario: MisFrutas = 'naranja';

// con types tambien podemos definir objetos, pero veamos como se hace con interfaces
// aqui podemos ver que los types usan =, pero las interfaces no
// ; o , no son necesarios ni en tipos ni en interfaces al definir objetos, pero por estetica usamos ;
// para diferenciar tipos e interfaces, se suele anteponer I a las interfaces
interface IUsuario {
    nombre: string;
    correo: string;
    // con el signo ? podemos decirle a Typescript que un valor no es obligatoria
    edad?: number;
}

// asi podemos extender interfaces
interface IClave extends IUsuario {
    frutaPreferida?: Fruta;
    clave: string;
}

// ahora un objeto de tipo IClave seria
const miUsuario: IClave = {
    nombre: 'Miguel',
    correo: 'miguellfasanellap@gmail.com',
    clave: 'abcd',
    // no ponemos edad ni fruta ya que son opcionales, pero podriamos
}

// tipos e interfaces pueden ser exportados sin complicaciones

// ahora, hay tipos de datos que son compuestos, como los arrays, veamos como podriamos tiparlos
type Juegos = 'God of War' | 'It Takes Two' | 'Beyond Two Souls' | 'Los Sims';

// tenemos dos notaciones, la mas comun es miInterfaz[]
// nota: el array puede estar vacio y Typescript no se quejara
// cuidado! Typescript es keysensitive, por lo que 'Los Sims' !== 'los sims'
const misJuegosFavoritos: Juegos[] = ['It Takes Two', 'God of War'];

// sin embargo, con la notacion Array<miTipo> podemos hacer que un array puede contener variables de diversos tipos
const misJuegosOFrutasFavoritos: Array<Juegos | Fruta> = ['Los Sims', 'manzana', 'melon', 'Beyond Two Souls'];

// ahora veamos como tipar funciones
// con interfaces seria

interface miFuncion {
    (primerParametro: string, segundoParametro: number): boolean;
}
// esto quiere decir que la funcion recibe un parametro string, otro number y retorna un booleano

const miFuncionDeEjemplo: miFuncion = function( primerParametro, segundoParametro ) {
    // Typescript al saber el tipo de las cosas es capaz de recomendarte todos sus metodos y propiedades
    primerParametro.length;
    segundoParametro.toFixed(2);
    return true;
}

const miArrowFunctionDeEjemplo: miFuncion = ( primerParametro, segundoParametro ) => {
    primerParametro.split(' ');
    return false;
}

// ahora bien, generalmente las funciones son unicas, es decir, es raro ver dos funciones recibiendo los mismos
// parametros y retornando el mismo valor, por lo que las funciones suelen tiparse directamente al declararse,
// no se suele crear un tipo o una interfaces para las funciones, aun asi, veamos como tipar una funcion con type

type miFuncionTipada = ( parametroUno: boolean, parametroDos: string ) => string;

const miOtraArrowFunction: miFuncionTipada = ( parametro1, parametro2 ) => {
    return parametro1 + `${ parametro2 }`;
}

// okey, veamos como tipar directamente una funcion
// esta funcion recibe un parametro (objeto) con las propiedades p1, p2 y p3 y retornara un arreglo de string
const funcionTiparaDirectamente = ({ p1, p2, p3 }: { p1: string, p2: number, p3: boolean }): Array<string> => {
    return ['string1', 'string2', 'string3'];
}

const funcionTiparaDirectamente2 = ( parametro1: string, parametro2: string[] ): { error: boolean; message: string; } => {
    // unimos todos los strings del parametro2 con el parametro 1 en una sola cadena de texto
    const stringFinal = parametro2.join(' ') + parametro1

    return {
        error: true,
        message: stringFinal,
    };
}

// en ocasiones, tendemos variables que son ( por ejemplo ) de tipo string pero que hacen referencia a propiedades
// tipadas como textos explicitos (como en el caso de Fruta, que siempre sera un string mas no cualquier string)
// Fruta solo puede tomar ciertos valores ya determinados
// que sucede si queremos indicar que la variable de tipo string hace referencia a una fruta? pues naturalmente
// Typescript se quejaria ya que string !== Fruta, pero podemos usar 'as Fruta' para tratar la variable como tal

const unaFuncionCualquiera = ( miParametro: string ): Fruta => {
    return miParametro as Fruta;
    // si no pusiesemos 'as Fruta' Typescript se quejaria, sin embargo ya no lo hace
}

// esta condicion nos mostraria un error por la consola
// el error dice que la condicion siempre retornara false ya que no hay relacion entre los tipos string (tipo
// de nombre) y number (el tipo del valor al que lo comparamos)
// sin embargo, podemos usar el siguiente comando para decirle a Typescript que NO corrija la siguiente linea

// @ts-ignore
if ( miUsuario.nombre === 5 ) {
    console.log('Hola Mundo!')
}
// asi el error desaparece, esto es un comodin, no debe ser usado excesivamente, solo en ocasiones en las que
// realmente no hayamos encontrado una forma de tipar algo o de corregir el error en cuestion ya que Typescript
// en ocasiones puede ponerse algo fastidioso, pero recuerda que siempre debemos intentar aprender y no rendirnos

// aqui dejare un par de ejemplos reales de como implemento Typescript en mis proyectos
// en algunas partes veras el ts-ignore pero no lo uso en las funciones reales, solo que claramente en este archivo
// no estan definidas todas las variables utilizadas en las funciones

/* --------------------------------------------------- */
interface IProduct {
  
    _id        : string;
    name       : string;
    description: string;
    inStock    : InStockSizes;
    price      : number;
    discount   : number;
    tags       : Tags[];
    sold       : number;
    slug       : string;
  
}

type Tags = 'accesorios' | 'consumibles' | 'ropa' | 'útil';

type InStockSizes = {
   unique: number;
   S?    : number;
   M?    : number;
   L?    : number;
   XL?   : number;
   XXL?  : number;
   XXXL? : number;
}

export const createNewProduct = async ( form: IProduct, unica: boolean, ): Promise<{ error: boolean; message: string; }> => {
    
    let { name = '', description = '', price = 0, discount, inStock, tags = [], slug = '' } = form;
    
    if ( !name || !description || price === 0 || tags.length === 0 )
        return { error: true, message: 'La información no es válida' };

    let { unique, ...tallas } = inStock;
    
    if ( unique > -1 && Object.values( tallas ).some(( value: number, index, array) => typeof value === 'number' && value > 0) ) return { error: true, message: 'Las tallas no son válidas' };

    try {
        // @ts-ignore
        let { data } = await axios.post('/product', {
            name,
            description,
            inStock,
            price,
            discount,
            tags,
            slug: slug.startsWith('/') ? slug : '/' + slug,
            unica,
        });

        return data;
    } catch( error ) {
        console.log( error );

        // @ts-ignore
        if ( axios.isAxiosError( error ) ) {
            return {
                error: true,
                // @ts-ignore
                message: error.response ? error.response.data.message || 'Error' : 'Error',
            }
        }

        return {
            error: true,
            message: 'Error',
        };
    }
}
/* --------------------------------------------------- */


// luego tendremos que aprender a como tipar los metodos y objetos de cada uno de los frameworks que utilizamos
// por lo que esto es solo el comienzo de Typescript! Sigue aprendiendo y practicando para que lleguemos a ser
// cada dia mejores, feliz dia ;)