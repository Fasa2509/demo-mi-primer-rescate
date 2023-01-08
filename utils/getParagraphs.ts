export const getParagraphs = ( content:string ): string[] => content.split('\n').filter(text => text);

export const formatText = ( txt: string ): string => {
    const text = txt.toLocaleLowerCase().split('');

    const tx = text.map(( t, index ) => {
        if ( index === 0 ) return t.toLocaleUpperCase();
        if ( text[index - 1] === ' ' ) return t.toLocaleUpperCase();
        return t;
    });

    return tx.join('');
};

export const getImageNameFromUrl = ( imgName: string ): string => {
    let name = imgName.replaceAll('_', ' ').replaceAll('-', ' ')
    if ( /\.jpeg/i.test(name) || /\.webp/i.test(name) ) return name.slice(0, name.length - 5);
    return name.slice(0, name.length - 4);
}

export const getImageKeyFromUrl = ( imgName: string ): string => {
    return imgName.split('/').at(-1)!;
}