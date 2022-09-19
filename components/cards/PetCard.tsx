import { FC } from "react";
import { Card, CardMedia } from "@mui/material";
import { ModalWindow } from "../ui";

export interface Pet {
    name: string;
    story: string;
    image: string;
}

export interface Props {
    pet: Pet;
}

export const PetCard: FC<Props> = ({ pet }) => {
  return (
        <Card sx={{ position: 'relative' }}>
            <CardMedia
                component='img'
                className='fadeIn'
                image={ pet.image }
                alt={ pet.name }
            />

            <ModalWindow title={ pet.name } buttonTxt={ pet.name } buttonStyle={{ position: 'absolute', right: '.5rem', bottom: '.7rem', borderRadius: '10rem' }}>
                <p>{ pet.story }</p>
            </ModalWindow>
        </Card>
  )
}