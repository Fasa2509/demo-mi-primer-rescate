import { ChangeEvent, FC, useContext, useState, useRef } from "react"
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Box, FormControlLabel, FormLabel, Input, Radio, RadioGroup, TextField, Typography } from "@mui/material"
import { useSnackbar } from "notistack";

import { ScrollContext } from "../../context";
import { dbAdoptions } from "../../database";
import { ConfirmNotificationButtons, PromiseConfirmHelper } from "../../utils";
import styles from './Form.module.css';

const baseForm = {
    particular1: '',
    particular2: '',
    contact: {
        facebook: '',
        instagram: '',
        whatsapp: '',
    },
    input1: '',
    input2: '',
    input3: false,
    input4: '',
    input5: '',
    input6: false,
    input7: false,
    input8: '',
    input9: '',
    input10: false,
    input11: '',
    input12: false,
    input13: '',
    input14: false,
    input15: '',
    input16: '',
    input17: '',
    input18: '',
    input19: 0,
    input20: 0,
    input21: false,
    input22: '',
    input23: '',
    cachorro: false,
    input24: '',
    input25: '',
    input26: false,
    input27: false,
    input28: '',
}

// Antes de empezar el cuestionario ¿Está usted interesado en algún perro/gato en particular de la manada MPR? De ser así escriba su nombre aquí. 

// Si este ya fue adoptado, ¿estaría interesado en adoptar otro? 

// 1. ¿Por qué motivos desea adoptar una mascota? 

// 2. ¿En que lugar/zona reside usted?

// 3. ¿El animal que desea adoptar es para usted o para un tercero? 

// 4. ¿Cuántas personas habitan en su hogar? ¿Cual es su parentesco? Enumere sus edades por separado

// 5. ¿Viven niños en su hogar? ¿Que edad tienen? 

// 6. ¿Todos los miembros de su familia (o habitantes de su hogar) están de acuerdo con adoptar un animal? 

// 7. ¿Viven otros animales en casa? 

// 8. Si es así, ¿que tipo de animal es/son? ¿Se encuentran vacunados/castrados? Enumere sus edades 

// 9. En caso de que no los haya, ¿ha tenido/vivido con animales alguna vez? ¿Por qué ya no? 

// 10. ¿Suele usted viajar/vacacionar? ¿Con que frecuencia? 

// 11. Si es muy constante la frecuencia con la que viaja, ¿que hará con el animal cuando tenga que viajar? 

// 12. ¿Es consciente de los gastos y cuidados que implica tener un animal en casa? ¿Está dispuesto a asumirlos? 

// 13. ¿En que tipo de vivienda reside? (casa, townhouse, depto, finca, casa quinta etc.)

// 14. ¿Vivirá en esa vivienda el animal adoptado? 

// 15. ¿Es propietario de la vivienda donde reside o alquila la propiedad? Si su condición es de inquilino, ¿está seguro de que permiten tener animales? 

// 16. Si se mudara de su actual vivienda ¿que haría con el animal? 

// 17. ¿Su vivienda cuenta con un espacio al aire libre? (patio, porche, terraza, balcón) de ser así indique como es y si tiene un cercado en buenas condiciones (rejas, muros, red, entre otros)

// 18. ¿El animal que desea adoptar es para compañía, guardia, trabajo, etc? Si es por otro motivo indique cuál 

// 19. ¿Cuantas horas al día estima que el animal estará solo en la propiedad? 

// 20. ¿Cuanto tiempo al día dispone usted o los miembros de su familia para pasear al animal, jugar con el, o amaestrarlo? 

// 21. ¿Es consciente de que el animal se adaptará a su nueva familia, lugar y horarios en un periodo aproximado de entre 15 a 30 días? 

// 22. Si su animal presenta una inadaptación o problema de comportamiento, ¿cual cree que debe ser la solución? 

// 23. Por favor, indique las características físicas y conductivas del animal que desea adoptar y cualquier dato importante a tener en cuenta que no se le haya preguntado. 

// LAS PREGUNTAS A CONTINUACIÓN DEBERÁN SER RESPONDIDAS POR AQUELLAS PERSONAS INTERESADAS EN ADOPTAR UN CACHORRO 

// 24. ¿Por qué motivos decide adoptar un cachorro? 

// 25. Indique los cuidados que usted cree que necesita un cachorro 

// 26. Es un requisito prioritario castrar al animal adoptado entre los primeros 6-8 meses después de su adopción ¿Está de acuerdo? ¿Se compromete a cumplirlo?

// 27. ¿Es consciente de que un cachorro, durante su proceso de adaptación puede que haga sus necesidades en diferentes lugares de la casa, rompa objetos, llore durante las noches, etc? 

// 278. ¿Que sucedería si su cachorro crece más de lo esperado?

export const AdoptionForm: FC = () => {

    const { data: session } = useSession();
    const router = useRouter();
    const { setIsLoading } = useContext( ScrollContext );
    const adoptionForm = useRef( null );
    const numberInput1 = useRef( null );
    const numberInput2 = useRef( null );
    const { enqueueSnackbar } = useSnackbar();
    const [disabledInputs, setDisabledInputs] = useState({
        input8: false,
        input9: true,
        input11: true,
        cachorro: true,
    });

    const handleSubmit = async ( e: any ) => {
        e.preventDefault();

        if ( !adoptionForm.current ) return;

        const formInfo = Object.fromEntries( new FormData( adoptionForm.current ) );

        if ( `${ formInfo.input19 }`.length === 0 || isNaN( Number( formInfo.input19 ) ) || Number( formInfo.input19 ) < 0 || Number( formInfo.input19 ) > 24 ) {
            // @ts-ignore
            numberInput1.current && numberInput1.current.focus();
            return enqueueSnackbar('Introduce una cantidad de horas válida', { variant: 'warning' });
        }

        if ( `${ formInfo.input20 }`.length === 0 || isNaN( Number( formInfo.input20 ) ) || Number( formInfo.input20 ) < 0 || Number( formInfo.input20 ) > 24 ) {
            // @ts-ignore
            numberInput2.current && numberInput2.current.focus();
            return enqueueSnackbar('Introduce una cantidad de horas válida', { variant: 'warning' });
        }

        const { contactfb, contactig, contactwa, ...restForm } = formInfo;

        const form = {
            ...baseForm,
            contact: {
                facebook: contactfb,
                instagram: contactig,
                whatsapp: contactwa,
            },
            ...restForm,
        };

        console.log( form );

        if ( !session || !session?.user ) return router.push('/auth?p=/adoptar');

        let key = enqueueSnackbar('¿Quieres enviar el formulario?', {
            variant: 'info',
            autoHideDuration: 10000,
            action: ConfirmNotificationButtons,
        });

        const accepted = await PromiseConfirmHelper( key, 10000 );

        if ( !accepted ) return;

        setIsLoading( true );
        
        // @ts-ignore
        const res = await dbAdoptions.createAdoption({ ...form, user: session.user._id, });
        
        enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });
        
        setIsLoading( false );

        return;
    }

  return (
    <form id='adoption-form' ref={ adoptionForm } onSubmit={ handleSubmit } className={ styles.adoption__form }>
        <Box>
            <Typography>Antes de empezar el cuestionario, ¿está usted interesad@ en algún perro/gato en particular de la manada MPR? De ser así escriba su nombre aquí.</Typography>
            <TextField
                name='particular1'
                label='Perro/gato particular'
                type='text'
                color='secondary'
                variant='filled'
                fullWidth
            />
        </Box>

        <Box>
            <Typography>Si este ya fue adoptado, ¿estaría interesad@ en adoptar otro?</Typography>
            <TextField
                name='particular2'
                label='Otro particular'
                type='text'
                color='secondary'
                variant='filled'
                fullWidth
            />
        </Box>

        <Box display='flex' flexDirection='column' gap='.5rem'>
            <Typography>¿Cómo podemos contactarle? Es necesario al menos un método de contacto</Typography>
            <TextField
                name='contactfb'
                label='Facebook'
                type='text'
                color='secondary'
                variant='filled'
                fullWidth
            />
            <TextField
                name='contactig'
                label='Instagram'
                type='text'
                color='secondary'
                variant='filled'
                fullWidth
            />
            <TextField
                name='contactwa'
                label='Whatsapp'
                type='text'
                color='secondary'
                variant='filled'
                fullWidth
            />
        </Box>

        <TextField
            name='input1'
            label='1. ¿Por qué motivos desea adoptar una mascota?'
            type='text'
            color='secondary'
            variant='filled'
            fullWidth
            multiline
            required
        />

        <TextField
            name='input2'
            label='2. ¿En qué lugar o zona reside?'
            type='text'
            color='secondary'
            variant='filled'
            fullWidth
            required
        />

        <Box>
            <Typography>3. ¿El animal que desea adoptar es para usted o para un tercero?</Typography>
            <RadioGroup
                name='input3'
                row
            >
                {
                    ['Para mí', 'Tercero'].map( option => (
                        <FormControlLabel
                            key={ option }
                            value={ option !== 'Tercero' }
                            control={ <Radio color='secondary' /> }
                            label={ option }
                        />
                    ))
                }
            </RadioGroup>
        </Box>

        <Box>
            <Typography>4. ¿Cuántas personas habitan en su hogar? ¿Cuál es su parentesco? Enumere sus edades por separado</Typography>
            <TextField
                name='input4'
                label='4. ¿Cuántas personas habitan en su hogar? ¿Cuál es su parentesco? Enumere sus edades por separado'
                type='text'
                color='secondary'
                variant='filled'
                fullWidth
                multiline
                required
            />
        </Box>

        <TextField
            name='input5'
            label='5. ¿Viven niños en su hogar? ¿Qué edad tienen?'
            type='text'
            color='secondary'
            variant='filled'
            fullWidth
            multiline
            required
        />

        <Box>
            <Typography>6. ¿Todos los miembros de su familia {'('}o habitantes de su hogar{')'} están de acuerdo con adoptar un animal?</Typography>
            <RadioGroup
                name='input6'
                row
            >
                {
                    ['Sí', 'No'].map( option => (
                        <FormControlLabel
                            key={ option }
                            value={ option !== 'No' }
                            control={ <Radio color='secondary' /> }
                            label={ option }
                        />
                    ))
                }
            </RadioGroup>
        </Box>

        <Box>
            <Typography>7. ¿Viven otros animales en casa?</Typography>
            <FormLabel>
                <RadioGroup
                    name='input7'
                    row
                    onChange={( e: ChangeEvent<HTMLInputElement> ) => setDisabledInputs({ ...disabledInputs, input8: e.target.value !== 'true', input9: e.target.value === 'true' }) }
                    >
                    {
                        ['Sí', 'No'].map( option => (
                            <FormControlLabel
                                key={ option }
                                value={ option !== 'No' }
                                control={ <Radio color='secondary' /> }
                                label={ option }
                            />
                        ))
                    }
                </RadioGroup>
            </FormLabel>
        </Box>

        <Box>
            { !disabledInputs.input8 &&  <Typography className='fadeIn'>8. ¿Qué tipo de animal es/son? ¿Están vacunados/castrados? Enumere sus edades</Typography> }
            <TextField
                name='input8'
                label='8. ¿Qué animal es? ¿Están vacunados/castrados?'
                type='text'
                disabled={ disabledInputs.input8 }
                color='secondary'
                variant='filled'
                fullWidth
                multiline
                required={ !disabledInputs.input8 }
            />
        </Box>

        <Box>
            { !disabledInputs.input9 && <Typography className='fadeIn'>9. ¿Ha vivido con animales anteriormente? ¿Por qué ya no?</Typography> }
            <TextField
                name='input9'
                label='9. ¿Ha vivido con animales?'
                type='text'
                disabled={ disabledInputs.input9 }
                color='secondary'
                variant='filled'
                fullWidth
                multiline
                required={ !disabledInputs.input9 }
            />
        </Box>

        <Box>
            <Typography>10. ¿Suele usted viajar o vacacionar?</Typography>
            <FormLabel>
                <RadioGroup
                    name='input10'
                    row
                    onChange={( e: ChangeEvent<HTMLInputElement> ) => setDisabledInputs({ ...disabledInputs, input11: e.target.value !== 'true' }) }
                >
                    {
                        ['Sí', 'No'].map( option => (
                            <FormControlLabel
                                key={ option }
                                value={ option !== 'No' }
                                control={ <Radio color='secondary' /> }
                                label={ option }
                            />
                        ))
                    }
                </RadioGroup>
            </FormLabel>
        </Box>

        <Box>
            { !disabledInputs.input11 && <Typography className='fadeIn'>11. ¿Con qué frecuencia? Si es muy constante, ¿qué hará con el animal cuando tenga que viajar?</Typography> }
            <TextField
                name='input11'
                label='11. Si viaja con frecuencia, ¿qué hará con el animal cuando tenga que viajar?'
                type='text'
                disabled={ disabledInputs.input11 }
                color='secondary'
                variant='filled'
                fullWidth
                multiline
                required={ !disabledInputs.input11 }
            />
        </Box>

        <Box>
            <Typography>12. ¿Es consciente de los gastos y cuidados que implica tener un animal en casa? ¿Está dispuesto a asumirlos?</Typography>
            <FormLabel>
                <RadioGroup
                    name='input12'
                    row
                >
                    {
                        ['Sí', 'No'].map( option => (
                            <FormControlLabel
                                key={ option }
                                value={ option !== 'No' }
                                control={ <Radio color='secondary' /> }
                                label={ option }
                            />
                        ))
                    }
                </RadioGroup>
            </FormLabel>
        </Box>

        <Box>
            <Typography>13. ¿En qué tipo de vivienda reside?</Typography>
            <TextField
                name='input13'
                label='13. Casa, deptartamento, finca, quinta etc...'
                type='text'
                color='secondary'
                variant='filled'
                fullWidth
                multiline
                required
            />
        </Box>

        <Box>
            <Typography>14. ¿Vivirá en esa vivienda el animal adoptado?</Typography>
            <FormLabel>
                <RadioGroup
                    name='input14'
                    row
                >
                    {
                        ['Sí', 'No'].map( option => (
                            <FormControlLabel
                                key={ option }
                                value={ option !== 'No' }
                                control={ <Radio color='secondary' /> }
                                label={ option }
                            />
                        ))
                    }
                </RadioGroup>
            </FormLabel>
        </Box>

        <Box>
            <Typography>15. ¿Es propietario de la vivienda donde reside o alquila la propiedad? Si su condición es de inquilino, ¿está seguro de que permiten tener animales?</Typography>
            <TextField
                name='input15'
                label='15. ¿Es propietario de la vivienda donde reside o la alquila?'
                type='text'
                color='secondary'
                variant='filled'
                fullWidth
                multiline
                required
            />
        </Box>

        <TextField
            name='input16'
            label='16. Si se mudase ¿qué haría con el animal?'
            type='text'
            color='secondary'
            variant='filled'
            fullWidth
            multiline
            required
        />

        <Box>
            <Typography>17. ¿Su vivienda cuenta con un espacio al aire libre {'('}patio, porche, terraza, balcón{')'}? De ser así indique cómo es y si tiene un cercado en buenas condiciones {'('}rejas, muros, red, entre otros{')'}</Typography>
            <TextField
                name='input17'
                label='17. ¿Cuenta con espacio al aire libre? De ser así indique cómo es y si tiene un cercado'
                type='text'
                color='secondary'
                variant='filled'
                fullWidth
                multiline
                required
            />
        </Box>

        <Box>
            <Typography>18. ¿El animal que desea adoptar es para compañía, guardia, trabajo, etc? Si es por otro motivo indique cuál</Typography>
            <TextField
                name='input18'
                label='18. ¿El animal que desea adoptar es para compañía, guardia, trabajo? Indique el motivo'
                type='text'
                color='secondary'
                variant='filled'
                fullWidth
                multiline
                required
            />
        </Box>

        <Box>
            <Typography>19. ¿Cuántas horas al día estima que el animal estará solo en la propiedad?</Typography>
            <TextField
                inputRef={ numberInput1 }
                name='input19'
                label='19. ¿Cuántas horas al día estima que el animal estará solo en la propiedad?'
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                type='number'
                color='secondary'
                variant='filled'
                fullWidth
            />
        </Box>

        <Box>
            <Typography>20. ¿Cuánto tiempo al día dispone usted o los miembros de su familia para pasear al animal, jugar con él, o amaestrarlo? {'('}Aproximado en horas{')'}</Typography>
            <TextField
                inputRef={ numberInput2 }
                name='input20'
                label='20. ¿Cuánto tiempo al día dispone? (Aproximado en horas)'
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                type='number'
                color='secondary'
                variant='filled'
                fullWidth
            />
        </Box>

        <Box>
            <Typography>21. ¿Es consciente de que el animal se adaptará a su nueva familia, lugar y horarios en un periodo aproximado de entre 15 a 30 días?</Typography>
            <FormLabel>
                <RadioGroup
                    name='input21'
                    row
                >
                    {
                        ['Sí', 'No'].map( option => (
                            <FormControlLabel
                                key={ option }
                                value={ option !== 'No' }
                                control={ <Radio color='secondary' /> }
                                label={ option }
                            />
                        ))
                    }
                </RadioGroup>
            </FormLabel>
        </Box>

        <Box>
            <Typography>22. Si su animal presenta una inadaptación o problema de comportamiento, ¿cuál cree que debe ser la solución?</Typography>
            <TextField
                name='input22'
                label='22. Si su animal presenta un problema de comportamiento, ¿cuál cree que es la solución?'
                type='text'
                color='secondary'
                variant='filled'
                fullWidth
                multiline
                required
            />
        </Box>

        <Box>
            <Typography>23. Por favor, indique las características físicas y conductivas del animal que desea adoptar y cualquier dato importante a tener en cuenta que no se le haya preguntado</Typography>
            <TextField
                name='input23'
                label='23. Indique las características físicas y conductivas del animal que desea adoptar y cualquier dato importante a tener en cuenta'
                type='text'
                color='secondary'
                variant='filled'
                fullWidth
                multiline
                required
            />
        </Box>

        <Box>
            <Typography>¿Está usted interesad@ en adoptar un cachorro?</Typography>
            <FormLabel>
                <RadioGroup
                    name='cachorro'
                    row
                    onChange={( e: ChangeEvent<HTMLInputElement> ) => setDisabledInputs({ ...disabledInputs, cachorro: e.target.value !== 'true' }) }
                >
                    {
                        ['Sí', 'No'].map( option => (
                            <FormControlLabel
                                key={ option }
                                value={ option !== 'No' }
                                control={ <Radio color='secondary' /> }
                                label={ option }
                            />
                        ))
                    }
                </RadioGroup>
            </FormLabel>
        </Box>

        {
            !disabledInputs.cachorro && (
                <Box className='fadeIn' display='flex' flexDirection='column' gap='1.5rem'>
                    <Box>
                        <Typography>24. ¿Por qué motivos decide adoptar un cachorro?</Typography>
                        <TextField
                            name='input24'
                            label='24. ¿Por qué motivos decide adoptar un cachorro?'
                            type='text'
                            color='secondary'
                            variant='filled'
                            fullWidth
                            multiline
                            required
                        />
                    </Box>
                    
                    <Box>
                        <Typography>25. Indique los cuidados que usted cree que necesita un cachorro</Typography>
                        <TextField
                            name='input25'
                            label='25. Indique los cuidados que usted cree que necesita un cachorro'
                            type='text'
                            color='secondary'
                            variant='filled'
                            fullWidth
                            multiline
                            required
                        />
                    </Box>

                    <Box>
                        <Typography>26. Es un requisito prioritario castrar al animal adoptado entre los primeros 6-8 meses después de su adopción. ¿Está de acuerdo? ¿Se compromete a cumplirlo?</Typography>
                        <FormLabel>
                            <RadioGroup
                                name='input26'
                                row
                            >
                            {
                                ['Sí', 'No'].map( option => (
                                    <FormControlLabel
                                        key={ option }
                                        value={ option !== 'No' }
                                        control={ <Radio color='secondary' /> }
                                        label={ option }
                                    />
                                ))
                            }
                            </RadioGroup>
                        </FormLabel>
                    </Box>

                    <Box>
                        <Typography>27. ¿Es consciente de que un cachorro, durante su proceso de adaptación puede que haga sus necesidades en diferentes lugares de la casa, rompa objetos, llore durante las noches, etc?</Typography>
                        <FormLabel>
                            <RadioGroup
                                name='input27'
                                row
                            >
                                {
                                    ['Sí', 'No'].map( option => (
                                        <FormControlLabel
                                            key={ option }
                                            value={ option !== 'No' }
                                            control={ <Radio color='secondary' /> }
                                            label={ option }
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormLabel>
                    </Box>

                    <Box>
                        <Typography>28. ¿Qué sucedería si su cachorro crece más de lo esperado?</Typography>
                        <TextField
                            name='input28'
                            label='28. ¿Qué sucedería si su cachorro crece más de lo esperado?'
                            type='text'
                            color='secondary'
                            variant='filled'
                            fullWidth
                            multiline
                            required
                        />
                    </Box>
                </Box>
            )
        }

        <Input type='submit' color='secondary' />
    </form>
  )
}
