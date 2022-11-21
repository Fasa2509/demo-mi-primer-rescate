export interface IPet {

    _id        : string;
    type       : PetType;
    name       : string;
    images     : string[];
    description: string;
    isAble     : boolean;
    
};

export type PetType = 'perro' | 'gato' | 'otro' | 'cambios' | 'experiencias';

export const PetTypeArray: PetType[] = ['perro', 'gato', 'otro', 'cambios', 'experiencias'];

export const adoptionPets: IPet[] = [
    {
        _id: '',
        type: 'perro',
        name: 'Pirata',
        description: 'Distem laborum magna consectetur sunt. Qui eiusmod amet qui fugiat anim sint reprehenderit laboris non enim dolor. Aute quis quis elit irure elit laborum eu ipsum consectetur. Nulla ea anim dolor labore officia.',
        images: ['/square-dog.jpg'],
        isAble: true,
    },
    {
        _id: '',
        type: 'perro',
        name: 'Paco',
        description: 'Ullamco ut Lorem velit eiusmod reprehenderit nulla cillum eu quis sint voluptate voluptate veniam laborum cupidatat velit amet proident aliquip ad reprehenderit amet cupidatat consectetur. Aute fugiat ut culpa et cillum excepteur magna consectetur ea dolor. Culpa ex dolore voluptate nostrud pariatur non velit ea cupidatat sint incididunt. Elit occaecat cillum officia incididunt. Voluptate est dolor mollit cupidatat commodo labore culpa voluptate do dolore laboris exercitation. Et ad consectetur minim enim aliquip irure.',
        images: ['/perro-1.webp'],
        isAble: true,
    },
    {
        _id: '',
        type: 'perro',
        name: 'Lizz',
        description: 'Exercitation amet velit cillum dolor ex esse mollit. Ex qui ad laboris adipisicing dolor minim. Non ullamco in velit exercitation aute aute deserunt proident. Eu aute commodo do laboris commodo consequat aliqua non dolore laborum cupidatat reprehenderit et id.',
        images: ['/perro-2.webp'],
        isAble: true,
    },
    {
        _id: '',
        type: 'perro',
        name: 'Benny',
        description: 'Laboris nulla pariatur enim culpa irure consequat deserunt occaecat adipisicing do laboris dolor enim. Do consectetur sit voluptate ex amet anim sunt reprehenderit anim id fugiat. Dolore ex ad quis sunt quis culpa consectetur sint irure id.',
        images: ['/square-dog.jpg'],
        isAble: true,
    },
    {
        _id: '',
        type: 'gato',
        name: 'Susy',
        description: 'Velit exercitation in amet amet nulla consequat. Quis deserunt et ad pariatur reprehenderit cupidatat fugiat consectetur. Labore dolor consequat laboris exercitation do duis. Labore duis irure magna in reprehenderit cillum. Enim amet elit velit aute irure enim reprehenderit laborum nisi ullamco occaecat Lorem excepteur minim.',
        images: ['/square-dog.jpg'],
        isAble: true,
    },
    {
        _id: '',
        type: 'gato',
        name: 'Zico',
        description: 'Incididunt esse et ea reprehenderit commodo in elit sint. Amet magna sit anim cupidatat eu. Voluptate excepteur id culpa excepteur labore voluptate minim dolor occaecat nulla. Dolor labore enim incididunt non est velit reprehenderit commodo magna laborum.',
        images: ['/gato-1.webp'],
        isAble: true,
    },
    {
        _id: '',
        type: 'gato',
        name: 'Missi',
        description: 'Excepteur nulla consequat. Quis deserunt et nulla culpa qui cupidatat ex ad. Sit ad pariatur reprehenderit cupidatat fugiat consectetur. Labore dolor consequat laboris exercitation do duis. Labore duis irure magna in reprehenderit cillum. Enim amet elit velit aute irure enim reprehenderit laborum nisi ullamco occaecat Lorem excepteur minim.',
        images: ['/gato-2.jpg'],
        isAble: true,
    },
    {
        _id: '',
        type: 'gato',
        name: 'Nébula',
        description: 'Quis deserunt et nulla culpa qui cupidatat ex fugiat consectetur. Labore dolor consequat laboris exercitation do duis irure magna in reprehenderit cillum. Enim amet elit velit aute irure enim reprehenderit laborum nisi minim.',
        images: ['/gato-1.webp'],
        isAble: true,
    },
    {
        _id: '',
        type: 'otro',
        name: 'Lucky',
        description: 'Excepteur nulla consequat nulla culpa qui cupidatat ex ad. Lorem consectetur anim mollit nulla anim labore velit Lorem ea. Non sit commodo irure incididunt pariatur elit. Ipsum commodo enim nulla velit. Nisi aliquip exercitation excepteur voluptate ad dolor. Elit veniam et cillum ex excepteur velit veniam nisi ea magna non. Ad ex consectetur labore aliqua esse nulla elit enim officia labore laborum.',
        images: ['/gato-1.webp'],
        isAble: true,
    },
    {
        _id: '',
        type: 'otro',
        name: 'Manu',
        description: 'Excepteur nulla consequat nulla culpa qui cupidatat ex ad. Lorem consectetur anim mollit nulla anim labore velit Lorem ea. Non sit commodo irure incididunt pariatur elit. Ipsum commodo enim nulla velit. Nisi aliquip exercitation excepteur voluptate ad dolor. Elit veniam et cillum ex excepteur velit veniam nisi ea magna non. Ad ex consectetur labore aliqua esse nulla elit enim officia labore laborum.',
        images: ['/gato-1.webp'],
        isAble: true,
    },
    {
        _id: '',
        type: 'otro',
        name: 'Rick',
        description: 'Excepteur nulla consequat nulla culpa qui cupidatat ex ad. Lorem consectetur anim mollit nulla anim labore velit Lorem ea. Non sit commodo irure incididunt pariatur elit. Ipsum commodo enim nulla velit. Nisi aliquip exercitation excepteur voluptate ad dolor. Elit veniam et cillum ex excepteur velit veniam nisi ea magna non. Ad ex consectetur labore aliqua esse nulla elit enim officia labore laborum.',
        images: ['/gato-2.jpg'],
        isAble: true,
    },
    {
        _id: '',
        type: 'otro',
        name: 'Decco',
        description: 'Excepteur nulla consequat nulla culpa qui cupidatat ex ad. Lorem consectetur anim mollit nulla anim labore velit Lorem ea. Non sit commodo irure incididunt pariatur elit. Ipsum commodo enim nulla velit. Nisi aliquip exercitation excepteur voluptate ad dolor. Elit veniam et cillum ex excepteur velit veniam nisi ea magna non. Ad ex consectetur labore aliqua esse nulla elit enim officia labore laborum.',
        images: ['/gato-2.jpg'],
        isAble: true,
    },
  ]

  export const otherPets: IPet[] = [
    {
        _id: '',
        type: 'cambios',
        name: 'Pirata',
        description: 'Distem laborum magna consectetur sunt. Qui eiusmod amet qui fugiat anim sint reprehenderit laboris non enim dolor. Aute quis quis elit irure elit laborum eu ipsum consectetur. Nulla ea anim dolor labore officia.',
        images: ['/square-dog.jpg', '/perro-1.webp', '/perro-2.webp'],
        isAble: true,
    },
    {
        _id: '',
        type: 'cambios',
        name: 'Paco',
        description: 'Ullamco ut Lorem velit eiusmod reprehenderit nulla cillum eu quis sint voluptate voluptate veniam laborum cupidatat velit amet proident aliquip ad reprehenderit amet cupidatat consectetur. Aute fugiat ut culpa et cillum excepteur magna consectetur ea dolor. Culpa ex dolore voluptate nostrud pariatur non velit ea cupidatat sint incididunt. Elit occaecat cillum officia incididunt. Voluptate est dolor mollit cupidatat commodo labore culpa voluptate do dolore laboris exercitation. Et ad consectetur minim enim aliquip irure.',
        images: ['/perro-1.webp', '/perro-2.webp'],
        isAble: true,
    },
    {
        _id: '',
        type: 'cambios',
        name: 'Lizz',
        description: 'Exercitation amet velit cillum dolor ex esse mollit. Ex qui ad laboris adipisicing dolor minim. Non ullamco in velit exercitation aute aute deserunt proident. Eu aute commodo do laboris commodo consequat aliqua non dolore laborum cupidatat reprehenderit et id.',
        images: ['/perro-2.webp', '/square-dog.jpg'],
        isAble: true,
    },
    {
        _id: '',
        type: 'cambios',
        name: 'Benny',
        description: 'Laboris nulla pariatur enim culpa irure consequat deserunt occaecat adipisicing do laboris dolor enim. Do consectetur sit voluptate ex amet anim sunt reprehenderit anim id fugiat. Dolore ex ad quis sunt quis culpa consectetur sint irure id.',
        images: ['/square-dog.jpg', '/perro-1.webp'],
        isAble: true,
    },
    {
        _id: '',
        type: 'cambios',
        name: 'Susy',
        description: 'Velit exercitation in amet amet nulla consequat. Quis deserunt et ad pariatur reprehenderit cupidatat fugiat consectetur. Labore dolor consequat laboris exercitation do duis. Labore duis irure magna in reprehenderit cillum. Enim amet elit velit aute irure enim reprehenderit laborum nisi ullamco occaecat Lorem excepteur minim.',
        images: ['/square-dog.jpg', '/perro-2.webp'],
        isAble: true,
    },
    {
        _id: '',
        type: 'cambios',
        name: 'Zico',
        description: 'Incididunt esse et ea reprehenderit commodo in elit sint. Amet magna sit anim cupidatat eu. Voluptate excepteur id culpa excepteur labore voluptate minim dolor occaecat nulla. Dolor labore enim incididunt non est velit reprehenderit commodo magna laborum.',
        images: ['/gato-1.webp', '/gato-2.jpg'],
        isAble: true,
    },
    {
        _id: '',
        type: 'experiencias',
        name: 'Missi',
        description: 'Excepteur nulla consequat. Quis deserunt et nulla culpa qui cupidatat ex ad. Sit ad pariatur reprehenderit cupidatat fugiat consectetur. Labore dolor consequat laboris exercitation do duis. Labore duis irure magna in reprehenderit cillum. Enim amet elit velit aute irure enim reprehenderit laborum nisi ullamco occaecat Lorem excepteur minim.',
        images: ['/gato-2.jpg', '/gato-1.webp'],
        isAble: true,
    },
    {
        _id: '',
        type: 'experiencias',
        name: 'Nébula',
        description: 'Quis deserunt et nulla culpa qui cupidatat ex fugiat consectetur. Labore dolor consequat laboris exercitation do duis irure magna in reprehenderit cillum. Enim amet elit velit aute irure enim reprehenderit laborum nisi minim.',
        images: ['/gato-1.webp', '/gato-2.jpg'],
        isAble: true,
    },
    {
        _id: '',
        type: 'experiencias',
        name: 'Lucky',
        description: 'Excepteur nulla consequat nulla culpa qui cupidatat ex ad. Lorem consectetur anim mollit nulla anim labore velit Lorem ea. Non sit commodo irure incididunt pariatur elit. Ipsum commodo enim nulla velit. Nisi aliquip exercitation excepteur voluptate ad dolor. Elit veniam et cillum ex excepteur velit veniam nisi ea magna non. Ad ex consectetur labore aliqua esse nulla elit enim officia labore laborum.',
        images: ['/gato-1.webp', '/gato-2.jpg'],
        isAble: true,
    },
    {
        _id: '',
        type: 'experiencias',
        name: 'Manu',
        description: 'Excepteur nulla consequat nulla culpa qui cupidatat ex ad. Lorem consectetur anim mollit nulla anim labore velit Lorem ea. Non sit commodo irure incididunt pariatur elit. Ipsum commodo enim nulla velit. Nisi aliquip exercitation excepteur voluptate ad dolor. Elit veniam et cillum ex excepteur velit veniam nisi ea magna non. Ad ex consectetur labore aliqua esse nulla elit enim officia labore laborum.',
        images: ['/gato-1.webp', '/gato-2.jpg'],
        isAble: true,
    },
    {
        _id: '',
        type: 'experiencias',
        name: 'Rick',
        description: 'Excepteur nulla consequat nulla culpa qui cupidatat ex ad. Lorem consectetur anim mollit nulla anim labore velit Lorem ea. Non sit commodo irure incididunt pariatur elit. Ipsum commodo enim nulla velit. Nisi aliquip exercitation excepteur voluptate ad dolor. Elit veniam et cillum ex excepteur velit veniam nisi ea magna non. Ad ex consectetur labore aliqua esse nulla elit enim officia labore laborum.',
        images: ['/gato-2.jpg', '/square-dog.jpg', '/gato-1.webp'],
        isAble: true,
    },
    {
        _id: '',
        type: 'experiencias',
        name: 'Decco',
        description: 'Excepteur nulla consequat nulla culpa qui cupidatat ex ad. Lorem consectetur anim mollit nulla anim labore velit Lorem ea. Non sit commodo irure incididunt pariatur elit. Ipsum commodo enim nulla velit. Nisi aliquip exercitation excepteur voluptate ad dolor. Elit veniam et cillum ex excepteur velit veniam nisi ea magna non. Ad ex consectetur labore aliqua esse nulla elit enim officia labore laborum.',
        images: ['/gato-2.jpg', '/gato-1.webp', '/square-dog.jpg'],
        isAble: true,
    },
]