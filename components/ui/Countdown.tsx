import { FC, useEffect, useState } from 'react';
import { formatDuration, intervalToDuration, isBefore, isToday } from 'date-fns'
import { es } from 'date-fns/locale';
import confetti from 'canvas-confetti'
import styles from './Article.module.css';

interface Props {
    end: string;
    selector?: string;
}

export const Countdown: FC<Props> = ({ end, selector }) => {

    const [time, setTime] = useState( '' );

    useEffect(() => {
        if ( isBefore( new Date( end ), new Date() ) ) {
            setTime( '00:00:00' )
        
            if ( selector && isToday( new Date( end ) ) ) {
                let element = document.getElementById( selector );

                setTimeout(() => {
                    element && element.scrollIntoView({ block: 'center', behavior: 'smooth' });

                    confetti({
                        zIndex: 12000,
                        particleCount: 150,
                        spread: 200,
                        angle: 100,
                        origin: {
                            x: 1,
                            y: 1,
                        }
                    })
                
                    confetti({
                        zIndex: 12000,
                        particleCount: 150,
                        spread: 200,
                        angle: 100,
                        origin: {
                            x: 0,
                            y: 1,
                        }
                    })
                }, 2500)
            }
        } else {
            let clockInterval = setInterval(() => {
                let duration;

                try {
                    duration = intervalToDuration({
                        start: new Date(), 
                        end: new Date( end ),
                    })

                    setTime(formatDuration(duration, { delimiter: ' ', locale: es }))
                } catch( error ) {
                    clearInterval( clockInterval );
                    setTime( '00:00:00' );
                }
            }, 1000)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  return (
    <div className={ styles.countdown }>{ time }</div>
  )
}