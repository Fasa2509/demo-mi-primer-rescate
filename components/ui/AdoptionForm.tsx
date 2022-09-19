import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography } from "@mui/material"
import { ChangeEvent, FC, useState } from "react"
import styles from './Form.module.css'

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

    const [ form, setForm ] = useState({
        particular1: '',
        particular2: '',
        input1: '',
        input2: '',
        input3: true,
        input4: '',
        input5: '',
        input6: true,
        input7: false,
        input8: '',
        input9: '',
        input10: false,
        input11: '',
        input12: true,
        input13: '',
        input14: true,
        input15: '',
        input16: '',
        input17: '',
        input18: '',
        input19: 0,
        input20: '',
        input21: true,
        input22: '',
        input23: '',
        cachorro: false,
        input24: '',
        input25: '',
        input26: '',
        input27: true,
        input28: '',
    });
    
    const handleSubmit = ( e: any ) => {
        e.preventDefault();
    }

  return (
    <form onSubmit={ handleSubmit } className={ styles.adoption__form }>
        <Box>
            <Typography>Antes de empezar el cuestionario ¿Está usted interesado en algún perro/gato en particular de la manada MPR? De ser así escriba su nombre aquí.</Typography>
            <TextField
                name='particular1'
                value={ form.particular1 }
                label='Perro/gato particular'
                type='text'
                color='secondary'
                variant='filled'
                fullWidth
                onChange={ ( e ) => setForm({ ...form, particular1: e.target.value }) }
            />
        </Box>

        <Box>
            <Typography>Si este ya fue adoptado, ¿estaría interesado en adoptar otro?</Typography>
            <TextField
                name='particular2'
                value={ form.particular2 }
                label='Otro particular'
                type='text'
                color='secondary'
                variant='filled'
                fullWidth
                onChange={ ( e ) => setForm({ ...form, particular2: e.target.value }) }
                />
        </Box>

        <TextField
            name='input1'
            value={ form.input1 }
            label='1. ¿Por qué motivos desea adoptar una mascota?'
            type='text'
            color='secondary'
            variant='filled'
            fullWidth
            multiline
            onChange={ ( e ) => setForm({ ...form, input1: e.target.value }) }
        />

        <TextField
            name='input2'
            value={ form.input2 }
            label='2. ¿En que lugar/zona reside usted?'
            type='text'
            color='secondary'
            variant='filled'
            fullWidth
            onChange={ ( e ) => setForm({ ...form, input2: e.target.value }) }
        />

        <Box>
            <Typography>3. ¿El animal que desea adoptar es para usted o para un tercero?</Typography>
            <RadioGroup
                name="input3"
                row
                value={ form.input3 }
                onChange={( e: ChangeEvent<HTMLInputElement> ) => setForm({ ...form, input3: e.target.value === 'true' }) }
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
                value={ form.input4 }
                label='4. ¿Cuántas personas habitan en su hogar? ¿Cuál es su parentesco? Enumere sus edades por separado'
                type='text'
                color='secondary'
                variant='filled'
                fullWidth
                multiline
                onChange={ ( e ) => setForm({ ...form, input4: e.target.value }) }
            />
        </Box>

        <TextField
            name='input5'
            value={ form.input5 }
            label='5. ¿Viven niños en su hogar? ¿Qué edad tienen?'
            type='text'
            color='secondary'
            variant='filled'
            fullWidth
            multiline
            onChange={ ( e ) => setForm({ ...form, input5: e.target.value }) }
        />

        <Box>
            <Typography>6. ¿Todos los miembros de su familia {'('}o habitantes de su hogar{')'} están de acuerdo con adoptar un animal?</Typography>
            <RadioGroup
                name="input6"
                row
                value={ form.input6 }
                onChange={( e: ChangeEvent<HTMLInputElement> ) => setForm({ ...form, input6: e.target.value === 'true' }) }
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
                    name="input7"
                    row
                    value={ form.input7 }
                    onChange={( e: ChangeEvent<HTMLInputElement> ) => setForm({ ...form, input7: e.target.value === 'true' }) }
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
            { form.input7 &&  <Typography className='fadeIn'>8. ¿Qué tipo de animal es/son? ¿Están vacunados/castrados? Enumere sus edades</Typography> }
            <TextField
                name='input8'
                value={ form.input7 ? form.input8 : '' }
                label='8. ¿Qué animal es? ¿Están vacunados/castrados?'
                type='text'
                disabled={ !form.input7 }
                color='secondary'
                variant='filled'
                fullWidth
                multiline
                onChange={ ( e ) => setForm({ ...form, input8: e.target.value }) }
            />
        </Box>

        <Box>
            <Typography>9. ¿Ha vivido con animales anteriormente? ¿Por qué ya no?</Typography>
            <TextField
                name='input9'
                value={ !form.input7 ? form.input9 : '' }
                label='9. ¿Ha vivido con animales?'
                type='text'
                disabled={ form.input7 }
                color='secondary'
                variant='filled'
                fullWidth
                multiline
                onChange={ ( e ) => setForm({ ...form, input9: e.target.value }) }
            />
        </Box>

        <Box>
            <Typography>10. ¿Suele usted viajar o vacacionar?</Typography>
            <FormLabel>
                <RadioGroup
                    name="input10"
                    row
                    value={ form.input10 }
                    onChange={( e: ChangeEvent<HTMLInputElement> ) => setForm({ ...form, input10: e.target.value === 'true' }) }
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
            { form.input10 && <Typography className='fadeIn'>11. ¿Con qué frecuencia? Si es muy constante, ¿qué hará con el animal cuando tenga que viajar?</Typography> }
            <TextField
                name='input11'
                value={ form.input10 ? form.input11 : '' }
                label='11. Si viaja con frecuencia, ¿qué hará con el animal cuando tenga que viajar?'
                type='text'
                disabled={ !form.input10 }
                color='secondary'
                variant='filled'
                fullWidth
                multiline
                onChange={ ( e ) => setForm({ ...form, input11: e.target.value }) }
            />
        </Box>

        <Box>
            <Typography>12. ¿Es consciente de los gastos y cuidados que implica tener un animal en casa? ¿Está dispuesto a asumirlos?</Typography>
            <FormLabel>
                <RadioGroup
                    name="input12"
                    row
                    value={ form.input12 }
                    onChange={( e: ChangeEvent<HTMLInputElement> ) => setForm({ ...form, input12: e.target.value === 'true' }) }
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
                value={ form.input13 }
                label='13. Casa, deptartamento, finca, quinta etc...'
                type='text'
                color='secondary'
                variant='filled'
                fullWidth
                multiline
                onChange={ ( e ) => setForm({ ...form, input13: e.target.value }) }
            />
        </Box>

        <Box>
            <Typography>14. ¿Vivirá en esa vivienda el animal adoptado?</Typography>
            <FormLabel>
                <RadioGroup
                    name="input14"
                    row
                    value={ form.input14 }
                    onChange={( e: ChangeEvent<HTMLInputElement> ) => setForm({ ...form, input14: e.target.value === 'true' }) }
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
                value={ form.input15 }
                label='15. ¿Es propietario de la vivienda donde reside o la alquila?'
                type='text'
                color='secondary'
                variant='filled'
                fullWidth
                multiline
                onChange={ ( e ) => setForm({ ...form, input15: e.target.value }) }
            />
        </Box>

        <TextField
            name='input16'
            value={ form.input16 }
            label='16. Si se mudase ¿qué haría con el animal?'
            type='text'
            color='secondary'
            variant='filled'
            fullWidth
            multiline
            onChange={ ( e ) => setForm({ ...form, input16: e.target.value }) }
        />

        <Box>
            <Typography>17. ¿Su vivienda cuenta con un espacio al aire libre? {'('}patio, porche, terraza, balcón{')'}. De ser así indique cómo es y si tiene un cercado en buenas condiciones {'('}rejas, muros, red, entre otros{')'}</Typography>
            <TextField
                name='input17'
                value={ form.input17 }
                label='17. ¿Cuenta con espacio al aire libre? De ser así indique cómo es y si tiene un cercado'
                type='text'
                color='secondary'
                variant='filled'
                fullWidth
                multiline
                onChange={ ( e ) => setForm({ ...form, input17: e.target.value }) }
            />
        </Box>

        <Box>
            <Typography>18. ¿El animal que desea adoptar es para compañía, guardia, trabajo, etc? Si es por otro motivo indique cuál</Typography>
            <TextField
                name='input18'
                value={ form.input18 }
                label='18. ¿El animal que desea adoptar es para compañía, guardia, trabajo? Indique el motivo'
                type='text'
                color='secondary'
                variant='filled'
                fullWidth
                multiline
                onChange={ ( e ) => setForm({ ...form, input18: e.target.value }) }
            />
        </Box>

        <Box>
            <Typography>19. ¿Cuántas horas al día estima que el animal estará solo en la propiedad?</Typography>
            <TextField
                name='input19'
                value={ form.input19 }
                label='19. ¿Cuántas horas al día estima que el animal estará solo en la propiedad?'
                type='number'
                color='secondary'
                variant='filled'
                fullWidth
                multiline
                onChange={ ( e ) => {
                    if ( isNaN(Number( e.target.value )) || Number( e.target.value ) < 0 ) return;
                    setForm({ ...form, input19: Number(e.target.value) })}
                }
            />
        </Box>

        <Box>
            <Typography>20. ¿Cuánto tiempo al día dispone usted o los miembros de su familia para pasear al animal, jugar con él, o amaestrarlo? {'('}Aproximado en horas{')'}</Typography>
            <TextField
                name='input20'
                value={ form.input20 }
                label='20. ¿Cuánto tiempo al día disponen? (Aproximado en horas)'
                type='number'
                color='secondary'
                variant='filled'
                fullWidth
                multiline
                onChange={ ( e ) => {
                    if ( isNaN(Number( e.target.value )) || Number( e.target.value ) < 0 ) return;
                    setForm({ ...form, input20: e.target.value })
                }}
            />
        </Box>

        <Box>
            <Typography>21. ¿Es consciente de que el animal se adaptará a su nueva familia, lugar y horarios en un periodo aproximado de entre 15 a 30 días?</Typography>
            <FormLabel>
                <RadioGroup
                    name="input21"
                    row
                    value={ form.input21 }
                    onChange={( e: ChangeEvent<HTMLInputElement> ) => setForm({ ...form, input21: e.target.value === 'true' }) }
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
                value={ form.input22 }
                label='22. Si su animal presenta un problema de comportamiento, ¿cuál cree que es la solución?'
                type='text'
                color='secondary'
                variant='filled'
                fullWidth
                multiline
                onChange={ ( e ) => setForm({ ...form, input22: e.target.value }) }
            />
        </Box>

        <Box>
            <Typography>23. Por favor, indique las características físicas y conductivas del animal que desea adoptar y cualquier dato importante a tener en cuenta que no se le haya preguntado</Typography>
            <TextField
                name='input23'
                value={ form.input23 }
                label='23. Indique las características físicas y conductivas del animal que desea adoptar y cualquier dato importante a tener en cuenta'
                type='text'
                color='secondary'
                variant='filled'
                fullWidth
                multiline
                onChange={ ( e ) => setForm({ ...form, input23: e.target.value }) }
            />
        </Box>

        <Box>
            <Typography>¿Está usted interesad@ en adoptar un cachorro?</Typography>
            <FormLabel>
                <RadioGroup
                    name="cachorro"
                    row
                    value={ form.cachorro }
                    onChange={( e: ChangeEvent<HTMLInputElement> ) => setForm({ ...form, cachorro: e.target.value === 'true' }) }
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
            form.cachorro && (
                <Box className='fadeIn' display='flex' flexDirection='column' gap='1.5rem'>
                    <Box>
                        <Typography>24. ¿Por qué motivos decide adoptar un cachorro?</Typography>
                        <TextField
                            name='input24'
                            value={ form.input24 }
                            label='24. ¿Por qué motivos decide adoptar un cachorro?'
                            type='text'
                            color='secondary'
                            variant='filled'
                            fullWidth
                            multiline
                            onChange={ ( e ) => setForm({ ...form, input24: e.target.value }) }
                        />
                    </Box>
                    
                    <Box>
                        <Typography>25. Indique los cuidados que usted cree que necesita un cachorro</Typography>
                        <TextField
                            name='input25'
                            value={ form.input25 }
                            label='25. Indique los cuidados que usted cree que necesita un cachorro'
                            type='text'
                            color='secondary'
                            variant='filled'
                            fullWidth
                            multiline
                            onChange={ ( e ) => setForm({ ...form, input25: e.target.value }) }
                        />
                    </Box>

                    <Box>
                        <Typography>26. Es un requisito prioritario castrar al animal adoptado entre los primeros 6-8 meses después de su adopción ¿Está de acuerdo? ¿Se compromete a cumplirlo?</Typography>
                        <TextField
                            name='input26'
                            value={ form.input26 }
                            label='26. Es un requisito prioritario castrar al animal adoptado entre los primeros 6-8 meses después de su adopción ¿Está de acuerdo? ¿Se compromete a cumplirlo?'
                            type='text'
                            color='secondary'
                            variant='filled'
                            fullWidth
                            multiline
                            onChange={ ( e ) => setForm({ ...form, input26: e.target.value }) }
                        />
                    </Box>

                    <Box>
                        <Typography>27. ¿Es consciente de que un cachorro, durante su proceso de adaptación puede que haga sus necesidades en diferentes lugares de la casa, rompa objetos, llore durante las noches, etc?</Typography>
                        <FormLabel>
                            <RadioGroup
                                name="input27"
                                row
                                value={ form.input27 }
                                onChange={( e: ChangeEvent<HTMLInputElement> ) => setForm({ ...form, input27: e.target.value === 'true' }) }
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
                            value={ form.input28 }
                            label='28. ¿Qué sucedería si su cachorro crece más de lo esperado?'
                            type='text'
                            color='secondary'
                            variant='filled'
                            fullWidth
                            multiline
                            onChange={ ( e ) => setForm({ ...form, input28: e.target.value }) }
                        />
                    </Box>
                </Box>
            )
        }
    </form>
  )
}
