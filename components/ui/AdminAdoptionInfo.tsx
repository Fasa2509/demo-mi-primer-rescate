import { FC } from 'react';
import { Box, Divider, Typography } from '@mui/material';

import { formatText } from '../../utils'
import { IAdoption } from '../../interfaces';

interface Props {
    adoption: IAdoption;
}

export const AdminAdoptionInfo: FC<Props> = ({ adoption }) => {

    const {
        particular1,
        particular2,
        contact,
        input1,
        input2,
        input3,
        input4,
        input5,
        input6,
        input7,
        input8,
        input9,
        input10,
        input11,
        input12,
        input13,
        input14,
        input15,
        input16,
        input17,
        input18,
        input19,
        input20,
        input21,
        input22,
        input23,
        cachorro,
        input24,
        input25,
        input26,
        input27,
        input28,
        createdAt,
    } = adoption;
    
    return (
        <Box display='flex' flexDirection='column' gap='1.5rem' className='fadeIn' sx={{ boxShadow: '0 0 1rem -.7rem #333', padding: '1.2rem', backgroundColor: '#fff', my: 3, borderRadius: '1rem' }}>
                
            <Typography>Esta petición fue creada el { new Date( createdAt ).toLocaleDateString() }</Typography>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: '500', color: '#222' }}>Métodos de contacto</Typography>
                <Divider sx={{ mb: 1 }} />
                
                {
                    Object.entries( contact ).filter(( current ) => current[0] !== '_id' && current[1].trim()).map(( current ) => <Typography key={ current[0] }>{ formatText( current[0] ) }: { current[1] }</Typography>)
                }
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: '500', color: '#222' }}>Interesado en adoptar algún animal en particular</Typography>
                <Divider sx={{ mb: 1 }} />
                {
                    particular1 && <Typography>{ particular1 }</Typography>
                }
                {
                    particular2 && <Typography>{ particular2 }</Typography>
                }
                {
                    !particular1 && !particular2 && <Typography>No</Typography>
                }
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: '500', color: '#222' }}>1. ¿Por qué motivos desea adoptar una mascota?</Typography>
                <Divider sx={{ mb: 1 }} />
                
                <Typography>{ input1 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: '500', color: '#222' }}>2. ¿En qué lugar o zona reside?</Typography>
                <Divider sx={{ mb: 1 }} />
                
                <Typography>{ input2 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: '500', color: '#222' }}>3. ¿El animal que desea adoptar es para usted o para un tercero?</Typography>
                <Divider sx={{ mb: 1 }} />
                
                <Typography>{ input3 ? 'Para mí' : 'Tercero' }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: '500', color: '#222' }}>4. ¿Cuántas personas habitan en su hogar? ¿Cuál es su parentesco? Enumere sus edades por separado</Typography>
                <Divider sx={{ mb: 1 }} />
                
                <Typography>{ input4 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: '500', color: '#222' }}>5. ¿Viven niños en su hogar? ¿Qué edad tienen?</Typography>
                <Divider sx={{ mb: 1 }} />
                
                <Typography>{ input5 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: '500', color: '#222' }}>6. ¿Todos los miembros de su familia {'('}o habitantes de su hogar{')'} están de acuerdo con adoptar un animal?</Typography>
                <Divider sx={{ mb: 1 }} />
                
                <Typography>{ input6 ? 'Sí' : 'No' }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: '500', color: '#222' }}>7. ¿Viven otros animales en casa?</Typography>
                <Divider sx={{ mb: 1 }} />
                
                <Typography>{ input7 ? 'Sí' : 'No' }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: '500', color: '#222' }}>8. ¿Qué tipo de animal es/son? ¿Están vacunados/castrados? Enumere sus edades</Typography>
                <Divider sx={{ mb: 1 }} />
                
                <Typography>{ input8 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: '500', color: '#222' }}>9. ¿Ha vivido con animales anteriormente? ¿Por qué ya no?</Typography>
                <Divider sx={{ mb: 1 }} />
                
                <Typography>{ input9 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: '500', color: '#222' }}>10. ¿Suele usted viajar o vacacionar?</Typography>
                <Divider sx={{ mb: 1 }} />
                
                <Typography>{ input10 ? 'Sí' : 'No' }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: '500', color: '#222' }}>11. ¿Con qué frecuencia? Si es muy constante, ¿qué hará con el animal cuando tenga que viajar?</Typography>
                <Divider sx={{ mb: 1 }} />
                
                <Typography>{ input11 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: '500', color: '#222' }}>12. ¿Es consciente de los gastos y cuidados que implica tener un animal en casa? ¿Está dispuesto a asumirlos?</Typography>
                <Divider sx={{ mb: 1 }} />
                
                <Typography>{ input12 ? 'Sí' : 'No' }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: '500', color: '#222' }}>13. ¿En qué tipo de vivienda reside?</Typography>
                <Divider sx={{ mb: 1 }} />
                
                <Typography>{ input13 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: '500', color: '#222' }}>14. ¿Vivirá en esa vivienda el animal adoptado?</Typography>
                <Divider sx={{ mb: 1 }} />
                
                <Typography>{ input14 ? 'Sí' : 'No' }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: '500', color: '#222' }}>15. ¿Es propietario de la vivienda donde reside o alquila la propiedad? Si su condición es de inquilino, ¿está seguro de que permiten tener animales?</Typography>
                <Divider sx={{ mb: 1 }} />
                
                <Typography>{ input15 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: '500', color: '#222' }}>16. Si se mudase ¿qué haría con el animal?</Typography>
                <Divider sx={{ mb: 1 }} />
                
                <Typography>{ input16 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: '500', color: '#222' }}>17. ¿Su vivienda cuenta con un espacio al aire libre {'('}patio, porche, terraza, balcón{')'}? De ser así indique cómo es y si tiene un cercado en buenas condiciones {'('}rejas, muros, red, entre otros{')'}</Typography>
                <Divider sx={{ mb: 1 }} />
                
                <Typography>{ input17 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: '500', color: '#222' }}>18. ¿El animal que desea adoptar es para compañía, guardia, trabajo, etc? Si es por otro motivo indique cuál</Typography>
                <Divider sx={{ mb: 1 }} />
                
                <Typography>{ input18 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: '500', color: '#222' }}>19. ¿Cuántas horas al día estima que el animal estará solo en la propiedad?</Typography>
                <Divider sx={{ mb: 1 }} />
                
                <Typography>{ input19 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: '500', color: '#222' }}>20. ¿Cuánto tiempo al día dispone usted o los miembros de su familia para pasear al animal, jugar con él, o amaestrarlo? {'('}Aproximado en horas{')'}</Typography>
                <Divider sx={{ mb: 1 }} />
                
                <Typography>{ input20 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: '500', color: '#222' }}>21. ¿Es consciente de que el animal se adaptará a su nueva familia, lugar y horarios en un periodo aproximado de entre 15 a 30 días?</Typography>
                <Divider sx={{ mb: 1 }} />
                
                <Typography>{ input21 ? 'Sí' : 'No' }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: '500', color: '#222' }}>22. Si su animal presenta una inadaptación o problema de comportamiento, ¿cuál cree que debe ser la solución?</Typography>
                <Divider sx={{ mb: 1 }} />
                
                <Typography>{ input22 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: '500', color: '#222' }}>23. Por favor, indique las características físicas y conductivas del animal que desea adoptar y cualquier dato importante a tener en cuenta que no se le haya preguntado</Typography>
                <Divider sx={{ mb: 1 }} />
                
                <Typography>{ input23 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: '500', color: '#222' }}>¿Está usted interesad@ en adoptar un cachorro?</Typography>
                <Divider sx={{ mb: 1 }} />
                
                <Typography>{ cachorro ? 'Sí' : 'No' }</Typography>
            </Box>

            { cachorro &&
                <Box display='flex' flexDirection='column' gap='1.5rem'>
                    <Box display='flex' flexDirection='column'>
                        <Typography sx={{ fontSize: '1.1rem', fontWeight: '500', color: '#222' }}>24. ¿Por qué motivos decide adoptar un cachorro?</Typography>
                        <Divider sx={{ mb: 1 }} />
                        
                        <Typography>{ input24 }</Typography>
                    </Box>

                    <Box display='flex' flexDirection='column'>
                        <Typography sx={{ fontSize: '1.1rem', fontWeight: '500', color: '#222' }}>25. Indique los cuidados que usted cree que necesita un cachorro</Typography>
                        <Divider sx={{ mb: 1 }} />

                        <Typography>{ input25 }</Typography>
                    </Box>

                    <Box display='flex' flexDirection='column'>
                        <Typography sx={{ fontSize: '1.1rem', fontWeight: '500', color: '#222' }}>26. Es un requisito prioritario castrar al animal adoptado entre los primeros 6-8 meses después de su adopción. ¿Está de acuerdo? ¿Se compromete a cumplirlo?</Typography>
                        <Divider sx={{ mb: 1 }} />

                        <Typography>{ input26 ? 'Sí' : 'No' }</Typography>
                    </Box>

                    <Box display='flex' flexDirection='column'>
                        <Typography sx={{ fontSize: '1.1rem', fontWeight: '500', color: '#222' }}>27. ¿Es consciente de que un cachorro, durante su proceso de adaptación puede que haga sus necesidades en diferentes lugares de la casa, rompa objetos, llore durante las noches, etc?</Typography>
                        <Divider sx={{ mb: 1 }} />

                        <Typography>{ input27 ? 'Sí' : 'No' }</Typography>
                    </Box>

                    <Box display='flex' flexDirection='column'>
                        <Typography sx={{ fontSize: '1.1rem', fontWeight: '500', color: '#222' }}>28. ¿Qué sucedería si su cachorro crece más de lo esperado?</Typography>
                        <Divider sx={{ mb: 1 }} />

                        <Typography>{ input28 }</Typography>
                    </Box>
                </Box>
            }
        </Box>
    )
}
