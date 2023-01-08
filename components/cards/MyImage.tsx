import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { Box } from '@mui/material';
import styles from '../layouts/Loader.module.css';

type myProps = ImageProps & { alt: string; sm?: boolean; };

export const MyImage = (props: myProps) => {

    const [loading, setLoading] = useState( true );

    return (
        <>
            <Image {...props} alt={ props.alt } onLoadingComplete={ () => setLoading( false ) } onError={ () => setLoading( false ) } />
            { loading &&
                <Box sx={{ position: 'absolute', top: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className={ props.sm ? styles.print : styles.big__print }></div>
                </Box>
            }
        </>
    )
}