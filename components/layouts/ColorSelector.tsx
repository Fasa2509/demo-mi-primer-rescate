import React, { useEffect, useState } from 'react'

const initialColor = [
    {
        color: '#2ACED8'
    },
    {
        color: '#2AD8A4'
    },
    {
        color: '#B74FD1'
    },
]

let aColor = ''

export const ColorSelector = () => {

    const [visible, setVisible] = useState( false );
    const [input, setInput] = useState('');
    const [colors, setColors] = useState(initialColor);

    useEffect(() => {
        document.addEventListener('click', (e: any) => {
            let target = e.target
            if ( target.matches('.color-selector div') ) {
                aColor = target.style.backgroundColor
            } else if ( target.matches('.color-selector') || target.matches('.color-selector input') || target.matches('.color-selector button') ) {
                return
            } else {
                if ( !aColor ) return;
                target.style.backgroundColor = aColor
            }
        })
    }, [])

    const handleClick = ( e: any ) => {
        const lastColor = document.querySelector('.active-color')

        if ( lastColor ) lastColor.classList.remove('active-color')

        e.target.classList.add('active-color')
    }

    const handleColor = () => {
        let regExp = /^#[0-9A-F]{6,8}$/i

        if ( regExp.test( input ) ) {
            setColors([ ...colors, { color: input } ])
        }
    }

  return (
    <div className='color-selector' style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', maxWidth: '122px', padding: '8px', backgroundColor: '#FFF', border: 'thin solid black', position: 'fixed', top: '20vh', left: 0, borderRadius: '5px', zIndex: 11000, transform: visible ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 500ms ease' }}>
        <button onClick={ () => setVisible( !visible ) } style={{ position: 'absolute', top: 0, right: '-16px', width: '16px', height: '16px', backgroundColor: 'white', border: 'none' }}>{ !visible ? '>' : 'x' }</button>
        
        {
            colors.map(( color, index ) => (
                <div onClick={ handleClick } key={ index } style={{ backgroundColor: color.color, minWidth: '16px', height: '16px', borderRadius: '2px' }}></div>
            ))
        }

        <input value={ input } onChange={ (e) => setInput(e.target.value) } type="text" placeholder='Agregar color' style={{ maxWidth: '100px' }} />

        <button onClick={ handleColor } style={{ margin: '0' }} className='button'>Agregar</button>

        <button style={{ margin: '0' }} className='button' onClick={ () => {
            // console.log(aColor)
            aColor = ''
            // console.log(aColor)
            if ( document.querySelector('.active-color') ) document.querySelector('.active-color')!.classList.remove('active-color')
        } }>Quitar</button>
    </div>
  )
}
