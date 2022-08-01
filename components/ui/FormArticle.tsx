import { FC, FormEvent, useState, useEffect } from 'react';
import styles from './Form.module.css'

let formInitialState = {
  title: '',
  content: '',
  files: [] as any,
}

let initialArticles = [
  {
    title: 'Artículo #1',
    content: `Anim eu aliquip laborum cillum aute sint fugiat incididunt ea sit labore.
    Excepteur laborum commodo Lorem ut consequat. Consectetur aliquip ea sit laborum nisi est consectetur sint Lorem ullamco pariatur velit enim.
    Excepteur irure in nulla deserunt consequat proident nulla do incididunt qui ea sunt elit minim. Aliquip nulla aliqua do Lorem esse magna nisi Lorem cupidatat aliqua.`,
    createdAt: Date.now() - 70000000 * Math.random()
  },
  {
    title: 'Artículo Número 2',
    content: `Reprehenderit nulla quis incididunt cupidatat aute fugiat excepteur consequat aliquip sunt officia. Sint in consectetur voluptate nulla dolore sint pariatur minim in ut.
    Eu dolor consectetur consequat adipisicing consectetur dolore id.
    Proident ullamco elit mollit dolor ullamco culpa velit. Pariatur nostrud ad nulla anim deserunt occaecat elit irure esse consequat qui velit duis. Est sunt Lorem eu officia dolore.`,
    createdAt: Date.now() - 50000000000 * Math.random()
  },
  {
    title: 'Artículo 3!!!',
    content: `Cupidatat nulla tempor sunt consectetur ipsum fugiat ea dolore. Elit labore qui ullamco aliquip ex laboris. Minim sunt nulla nisi reprehenderit ad ullamco in labore. Sunt velit ad ad reprehenderit ad elit sint.
    Eiusmod dolor quis incididunt officia non aliquip qui occaecat labore.
    Mollit sint in enim qui do ullamco incididunt consequat laboris laborum qui proident. Commodo reprehenderit aute consectetur eu incididunt labore quis Lorem labore dolor dolor cupidatat eiusmod ex.
    Labore minim adipisicing cupidatat fugiat non adipisicing et incididunt est ea. Ut Lorem dolore pariatur eu.`,
    createdAt: Date.now() - 9000000000 * Math.random()
  }
]

export const FormArticle: FC = () => {

  const [form, setForm] = useState(formInitialState);

  useEffect(() => {
    let articles = JSON.parse( window.localStorage.getItem('articles') || '[]' )

    if ( articles.length === 0 ) window.localStorage.setItem('articles', JSON.stringify( initialArticles ))
  }, [])

  const handleSubmit = async ( e: FormEvent<HTMLFormElement> ) => {
    e.preventDefault()
    
    alert('Guardando articulo en la base de datos!')
    setForm( formInitialState )

    let articles = JSON.parse( window.localStorage.getItem('articles') || '[]' )
    window.localStorage.setItem('articles', JSON.stringify( [{ title: form.title, content: form.content, createdAt: Date.now() }, ...articles] ))
  }

  return (
    <form className={ styles.form } onSubmit={ handleSubmit }>
        <p className={ styles.subtitle }>Crea un artículo para la página</p>

        <input className={ styles.form__field } type="text" name='title' placeholder='Título' value={ form.title } onChange={ (e) => setForm({ ...form, title: e.target.value }) } required />

        <textarea className={ styles.form__field } name="content" placeholder='Escribe aquí el contenido' rows={ 10 } value={ form.content } onChange={ (e) => setForm({ ...form, content: e.target.value }) } required />

        <p className={ styles.subtitle }>Aún no se pueden subir imágenes, pero inténtalo de todos modos!</p>
        <p className={ styles.subtitle }>Cuando un archivo pese más de 0.5MB, su peso será resaltado en rojo</p>

        <div style={{ display: 'flex', gap: form.files.length > 0 ? '.5rem' : '0' }}>

          <label style={{ alignSelf: 'center' }} className={ styles.button } htmlFor="file-input">Elegir archivos</label>
          
          {/* Este input file tiene un display: none; es decir, no se ve! */}
          <input id='file-input' type="file" accept="image/jpg, image/jpeg, image/png" multiple onChange={ (e) => setForm({ ...form, files: e.target.files }) } />
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {
              form.files.length > 0 && Array.from(form.files).map( (file: any, index: number) => (
                <span key={ file.name + index }>{ file.name } <b style={{ color: (file.size/(1024000)) >= 0.5 ? 'red' : 'initial' }}>{ (file.size/(1024000)).toFixed(2) }MB</b></span>
              ))
            }
          </div>
        </div>

        <input type='submit' className={ styles.button } value='Guardar Artículo' />
    </form>
  )
}
