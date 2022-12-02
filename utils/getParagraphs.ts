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