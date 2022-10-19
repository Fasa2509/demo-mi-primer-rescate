import { Box, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { IAdoption } from '../../interfaces';

interface Props {
    adoption: IAdoption;
}

export const AdminAdoptionInfo: FC<Props> = ({ adoption }) => {

    const {
        particular1,
        particular2,
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
        <Box display='flex' flexDirection='column' gap='1.2rem' className='fadeIn' sx={{ border: '2px solid #eaeaea', padding: '1.2rem', backgroundColor: '#fff', my: 3, borderRadius: '1rem' }}>
            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#444' }}>Interesado en adoptar algún animal en particular</Typography>
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
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#444' }}>1. ¿Por qué motivos desea adoptar una mascota?</Typography>
                
                <Typography>{ input1 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#444' }}>2. ¿En qué lugar o zona reside?</Typography>
                
                <Typography>{ input2 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#444' }}>3. ¿El animal que desea adoptar es para usted o para un tercero?</Typography>
                
                <Typography>{ input3 ? 'Para mí' : 'Tercero' }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#444' }}>4. ¿Cuántas personas habitan en su hogar? ¿Cuál es su parentesco? Enumere sus edades por separado</Typography>
                
                <Typography>{ input4 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#444' }}>5. ¿Viven niños en su hogar? ¿Qué edad tienen?</Typography>
                
                <Typography>{ input5 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#444' }}>6. ¿Todos los miembros de su familia {'('}o habitantes de su hogar{')'} están de acuerdo con adoptar un animal?</Typography>
                
                <Typography>{ input6 ? 'Sí' : 'No' }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#444' }}>7. ¿Viven otros animales en casa?</Typography>
                
                <Typography>{ input7 ? 'Sí' : 'No' }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#444' }}>8. ¿Qué tipo de animal es/son? ¿Están vacunados/castrados? Enumere sus edades</Typography>
                
                <Typography>{ input8 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#444' }}>9. ¿Ha vivido con animales anteriormente? ¿Por qué ya no?</Typography>
                
                <Typography>{ input9 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#444' }}>10. ¿Suele usted viajar o vacacionar?</Typography>
                
                <Typography>{ input10 ? 'Sí' : 'No' }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#444' }}>11. ¿Con qué frecuencia? Si es muy constante, ¿qué hará con el animal cuando tenga que viajar?</Typography>
                
                <Typography>{ input11 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#444' }}>12. ¿Es consciente de los gastos y cuidados que implica tener un animal en casa? ¿Está dispuesto a asumirlos?</Typography>
                
                <Typography>{ input12 ? 'Sí' : 'No' }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#444' }}>13. ¿En qué tipo de vivienda reside?</Typography>
                
                <Typography>{ input13 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#444' }}>14. ¿Vivirá en esa vivienda el animal adoptado?</Typography>
                
                <Typography>{ input14 ? 'Sí' : 'No' }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#444' }}>15. ¿Es propietario de la vivienda donde reside o alquila la propiedad? Si su condición es de inquilino, ¿está seguro de que permiten tener animales?</Typography>
                
                <Typography>{ input15 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#444' }}>16. Si se mudase ¿qué haría con el animal?</Typography>
                
                <Typography>{ input16 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#444' }}>17. ¿Su vivienda cuenta con un espacio al aire libre {'('}patio, porche, terraza, balcón{')'}? De ser así indique cómo es y si tiene un cercado en buenas condiciones {'('}rejas, muros, red, entre otros{')'}</Typography>
                
                <Typography>{ input17 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#444' }}>18. ¿El animal que desea adoptar es para compañía, guardia, trabajo, etc? Si es por otro motivo indique cuál</Typography>
                
                <Typography>{ input18 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#444' }}>19. ¿Cuántas horas al día estima que el animal estará solo en la propiedad?</Typography>
                
                <Typography>{ input19 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#444' }}>20. ¿Cuánto tiempo al día dispone usted o los miembros de su familia para pasear al animal, jugar con él, o amaestrarlo? {'('}Aproximado en horas{')'}</Typography>
                
                <Typography>{ input20 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#444' }}>21. ¿Es consciente de que el animal se adaptará a su nueva familia, lugar y horarios en un periodo aproximado de entre 15 a 30 días?</Typography>
                
                <Typography>{ input21 ? 'Sí' : 'No' }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#444' }}>22. Si su animal presenta una inadaptación o problema de comportamiento, ¿cuál cree que debe ser la solución?</Typography>
                
                <Typography>{ input22 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#444' }}>23. Por favor, indique las características físicas y conductivas del animal que desea adoptar y cualquier dato importante a tener en cuenta que no se le haya preguntado</Typography>
                
                <Typography>{ input23 }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#444' }}>¿Está usted interesad@ en adoptar un cachorro?</Typography>
                
                <Typography>{ cachorro ? 'Sí' : 'No' }</Typography>
            </Box>

            { cachorro &&
                <Box display='flex' flexDirection='column' gap='1.2erem'>
                    <Box display='flex' flexDirection='column'>
                        <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#444' }}>24. ¿Por qué motivos decide adoptar un cachorro?</Typography>
                        
                        <Typography>{ input24 }</Typography>
                    </Box>

                    <Box display='flex' flexDirection='column'>
                        <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#444' }}>25. Indique los cuidados que usted cree que necesita un cachorro</Typography>
                        
                        <Typography>{ input25 }</Typography>
                    </Box>

                    <Box display='flex' flexDirection='column'>
                        <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#444' }}>26. Es un requisito prioritario castrar al animal adoptado entre los primeros 6-8 meses después de su adopción. ¿Está de acuerdo? ¿Se compromete a cumplirlo?</Typography>
                        
                        <Typography>{ input26 ? 'Sí' : 'No' }</Typography>
                    </Box>

                    <Box display='flex' flexDirection='column'>
                        <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#444' }}>27. ¿Es consciente de que un cachorro, durante su proceso de adaptación puede que haga sus necesidades en diferentes lugares de la casa, rompa objetos, llore durante las noches, etc?</Typography>
                        
                        <Typography>{ input27 ? 'Sí' : 'No' }</Typography>
                    </Box>

                    <Box display='flex' flexDirection='column'>
                        <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#444' }}>28. ¿Qué sucedería si su cachorro crece más de lo esperado?</Typography>
                        
                        <Typography>{ input28 }</Typography>
                    </Box>
                </Box>
            }
        </Box>
    )
}
