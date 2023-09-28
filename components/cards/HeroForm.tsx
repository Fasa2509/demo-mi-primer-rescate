import { FC, useContext, useRef, useState } from 'react';
import NextLink from 'next/link';
import { Box, Button, TextField, Link } from '@mui/material';
import { useSnackbar } from 'notistack';

import { dbImages } from '../../database';
import { ScrollContext } from '../../context';
import { MyImage } from './MyImage';
import { Slider } from './Slider';
import { IIndexImage } from '../../interfaces';
import { ConfirmNotificationButtons, PromiseConfirmHelper, getImageNameFromUrl, getImageKeyFromUrl } from '../../utils';
import styles from '../ui/Form.module.css';

interface Props {
    images: IIndexImage[];
}

export const HeroForm: FC<Props> = ({ images: allImages }) => {

    const [images, setImages] = useState(allImages);
    const [currentSection, setCurrentSection] = useState<IIndexImage>({ _id: '', alt: '', url: '' });
    const { isLoading, setIsLoading } = useContext(ScrollContext);
    const imagenRef = useRef<HTMLInputElement>(null);
    const textRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);
    const linkTextRef = useRef<HTMLInputElement>(null);
    const colorRef = useRef<HTMLInputElement>(null);
    const rangeRef = useRef<HTMLInputElement>(null);

    const { enqueueSnackbar } = useSnackbar();

    const addImage = async () => {
        if (!imagenRef.current || !imagenRef.current.files || !imagenRef.current.files[0])
            return enqueueSnackbar('Aún no has seleccionado ninguna imagen', { variant: 'info' });

        setIsLoading(true);

        const fileReader = new FileReader();
        fileReader.readAsDataURL(imagenRef.current.files[0]);
        fileReader.addEventListener('load', (e) => {
            const result = e.target?.result;

            if (!result) return enqueueSnackbar('Ocurrió un error cargando la imagen', { variant: 'error' });

            setCurrentSection((prevState) => ({ ...prevState, url: result as string }));

            setIsLoading(false);
        });

        fileReader.addEventListener('error', () => {
            enqueueSnackbar('Ocurrió un error cargando la imagen', { variant: 'error' });
            setIsLoading(false)
        });

        return;
    }

    const addInfo = () => {
        if (!textRef.current || !colorRef.current || !rangeRef.current || !linkRef.current || !linkTextRef.current || isNaN(Number(rangeRef.current.value))) return;

        setCurrentSection((prevState) => ({ ...prevState, content: textRef.current!.value, bgcolor: colorRef.current!.value + Number(rangeRef.current!.value).toString(16), link: linkRef.current!.value, linkText: linkTextRef.current!.value }));
        textRef.current.value = '';
        linkRef.current.value = '';
        linkTextRef.current.value = '';
    }

    const addImageInfo = async () => {
        if (!imagenRef.current || !imagenRef.current.files || !imagenRef.current.files[0]) return;

        if ((currentSection.bgcolor && (!currentSection.content)) || (currentSection.content && (!currentSection.bgcolor)) || (currentSection.link && (!currentSection.bgcolor || !currentSection.content || !currentSection.linkText)))
            return enqueueSnackbar('Falta información de la sección', { variant: 'warning' });

        let key = enqueueSnackbar(`¿Subir imagen?`, {
            variant: 'info',
            autoHideDuration: 10000,
            action: ConfirmNotificationButtons,
        });

        const confirm = await PromiseConfirmHelper(key, 10000);

        if (!confirm) return;

        setIsLoading(true);
        const data = await dbImages.uploadImageToS3(imagenRef.current.files[0]);
        setIsLoading(false);

        if (!data.imgUrl || data.error) return enqueueSnackbar('Ocurrió un error subiendo la imagen', { variant: 'error' });

        setImages((prevState) => [...prevState, { ...currentSection, url: data.imgUrl!, alt: imagenRef.current!.files![0].name }]);
        setCurrentSection({ _id: '', url: '', alt: '' });
    }

    const removeImage = async ({ index, _id, url }: { index: number; _id: string; url: string; }) => {
        if (images.length < 1) return enqueueSnackbar('No hay imágenes', { variant: 'info' });

        let key = enqueueSnackbar(`¿Segur@ que quieres eliminar la imagen ${index}`, {
            variant: 'warning',
            autoHideDuration: 10000,
            action: ConfirmNotificationButtons,
        });

        const confirm = await PromiseConfirmHelper(key, 10000);

        if (!confirm) return;

        setIsLoading(true);

        if (_id) {
            setIsLoading(true);
            const res = await dbImages.deleteIndexImage(_id);

            if (res.error) {
                enqueueSnackbar(res.message, { variant: 'error' });
                setIsLoading(false);
                return;
            };
        }

        if (/aws/i.test(url) && (/\.jpeg/i.test(url) || /\.jpg/i.test(url) || /\.webp/i.test(url) || /\.png/i.test(url) || /\.gif/i.test(url))) {
            const resS3 = await dbImages.deleteImageFromS3(getImageKeyFromUrl(url));

            (!resS3.error)
                ? setImages((prevState) => prevState.filter((img, idx) => idx !== index - 1))
                : setImages((prevState) => prevState.map((img, idx) => (idx !== index - 1) ? img : { ...img, _id: '' }));

            setIsLoading(false);

            enqueueSnackbar(resS3.message, { variant: !resS3.error ? 'success' : 'error' });
            if (resS3.error) return;
        }
    };

    const saveChanges = async () => {
        if (isLoading) return;

        let key = enqueueSnackbar('¿Quieres guardar los cambios?', {
            variant: 'info',
            autoHideDuration: 12000,
            action: ConfirmNotificationButtons
        });

        const accepted = await PromiseConfirmHelper(key, 12000);

        if (!accepted) return;

        setIsLoading(true);
        const res = await dbImages.saveIndexSections(images);
        setIsLoading(false);

        return enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });
    }

    return (
        <section style={{ width: 'clamp(280px, 90%, 850px)', margin: '0 auto .5rem' }} className='fadeIn'>

            <form className={styles.form}>

                <p className={styles.subtitle}>Agregar Imagen de Inicio</p>

                <p>Las imágenes deben tener una dimensión de al menos 1280 x 720.</p>

                <input ref={imagenRef} className={styles.no__display} multiple accept='image/png, image/jpg, image/jpeg, image/gif, image/webp' type='file' name='image' onChange={addImage} />
                <Button className='button low--padding' fullWidth onClick={() => isLoading || imagenRef.current!.click()}>Agregar imagen</Button>

                <p>Usa *_ <span className='slider__emphasis'>texto</span> _* para dar énfasis al texto.</p>
                <TextField inputRef={textRef} name='texto' label='Texto (no obligatorio)' type='text' color='secondary' variant='filled' multiline />

                <Box display='flex' columnGap={1}>
                    <TextField sx={{ flexGrow: 1 }} inputRef={linkRef} name='texto' label='Url (no obligatorio)' type='url' color='secondary' variant='filled' multiline />
                    <TextField sx={{ flexGrow: 1 }} inputRef={linkTextRef} name='link-texto' label='Texto de Url (no obligatorio)' type='text' color='secondary' variant='filled' multiline />
                </Box>

                <Box>
                    <p style={{ display: 'inline', paddingRight: '.8rem' }}>Color de fondo</p>
                    <input ref={colorRef} name='color' type='color' />
                </Box>

                <Box sx={{ display: 'flex', columnGap: '.8rem', alignItems: 'center' }}>
                    <p>Opacidad</p>
                    <input ref={rangeRef} style={{ flexGrow: 1 }} name='color' type='range' min={0} max={255} />
                </Box>

                <Button className='button low--padding' fullWidth onClick={addInfo}>Agregar información</Button>

                {
                    currentSection.url &&
                    <>
                        <Box className='fadeIn' sx={{ position: 'relative', aspectRatio: 16 / 9, width: '100%', borderRadius: '.5rem', overflow: 'hidden', marginBottom: '1rem' }}>
                            <MyImage layout='fill' src={currentSection.url} alt={currentSection.alt} style={{ color: currentSection.bgcolor ? currentSection.bgcolor : 'none' }} />
                            {
                                currentSection.bgcolor &&
                                <Box sx={{ overflow: 'hidden', position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', aspectRatio: 16 / 9, backgroundColor: currentSection.bgcolor }}>
                                    <p className='slider__content'>{currentSection.content!.split('*').map((str) => (str.startsWith('_') && str.at(-1) === '_') ? <span className='slider__emphasis'>{str.slice(1, -1)}</span> : str)}</p>
                                    {
                                        (currentSection.link && currentSection.linkText) ?
                                            ((/\/miprimerrescate/.test(currentSection.link) || /\/apoyo/.test(currentSection.link) || /\/adoptar/.test(currentSection.link) || /\/cambios/.test(currentSection.link) || /\/tienda/.test(currentSection.link)))
                                                ? <NextLink href={currentSection.link} passHref>
                                                    <a className='slider__link'>
                                                        {currentSection.linkText}
                                                    </a>
                                                </NextLink>
                                                : <a href={currentSection.link} className='slider__link' target='_blank' id='456' rel='noreferrer'>{currentSection.linkText}</a>
                                            : <></>
                                    }
                                </Box>
                            }
                        </Box>
                        <Button className='button low--padding button--purple' fullWidth onClick={addImageInfo}>Agregar sección</Button>
                    </>
                }


            </form>


            <section className='fadeIn' style={{ margin: '0 auto', backgroundColor: '#fcfcfc', borderRadius: '.5rem', overflow: 'hidden', boxShadow: '0 0 1.2rem -.4rem #666' }}>
                <Slider identifier='hero-form' duration={8000} autorun={false}>
                    {
                        images.map(({ _id, url, alt, bgcolor, content, link, linkText }, index) =>
                            <Box key={index} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', aspectRatio: '16/9', position: 'relative' }}>
                                <Box sx={{ position: 'relative', zIndex: '1', display: 'block', width: '100%' }}>
                                    <MyImage src={url} alt={alt} layout='responsive' width={1280} height={720} />
                                    {
                                        bgcolor &&
                                        <Box sx={{ overflow: 'hidden', position: 'absolute', top: 0, left: 0, zIndex: '90', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', aspectRatio: 16 / 9, backgroundColor: bgcolor }}>
                                            <p className='slider__content'>{content!.split('*').map((str) => (str.startsWith('_') && str.at(-1) === '_') ? <span className='slider__emphasis'>{str.slice(1, -1)}</span> : str)}</p>
                                            {
                                                (link && linkText) ?
                                                    ((/\/miprimerrescate/.test(link) || /\/apoyo/.test(link) || /\/adoptar/.test(link) || /\/cambios/.test(link) || /\/tienda/.test(link)))
                                                        ? <NextLink href={link} passHref>
                                                            <a className='slider__link'>
                                                                {linkText}
                                                            </a>
                                                        </NextLink>
                                                        : <a href={link} className='slider__link' target='_blank' id='456' rel='noreferrer'>{linkText}</a>
                                                    : <></>
                                            }
                                        </Box>
                                    }
                                </Box>
                                <Box sx={{ position: 'absolute', zIndex: '99', top: '1rem', left: '1rem', display: 'flex', alignItems: 'stretch', gap: '.5rem' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: '#111', backgroundColor: '#fcfcfc', borderRadius: '4px', width: '1.8rem' }}>
                                        {index + 1}
                                    </Box>
                                    <Button className='button button--error low--padding low--font--size' onClick={() => removeImage({ index: index + 1, _id, url })}>Eliminar</Button>
                                </Box>
                            </Box>
                        )
                    }
                </Slider>
            </section>

            <Button className='button button--purple low--padding' sx={{ mt: 2 }} color='primary' fullWidth onClick={saveChanges}>Guardar cambios</Button>

        </section>
    )
}
