import { NOTIFICATION_TYPE, Store } from "react-notifications-component";

interface notificationOptions {
    title: string;
    message: string;
    notType?: NOTIFICATION_TYPE;
    duration?: number;
    onScreen?: boolean;
}

export const callNotification = ({ title, message, notType = 'default', duration = 8000, onScreen = true }: notificationOptions) => {
    Store.addNotification({
        title,
        message,
        type: notType,
        insert: "bottom",
        container: "bottom-left",
        animationIn: ["animate__animated animate__fadeIn"],
        animationOut: ["animate__animated animate__fadeOut"],
        dismiss: {
            duration,
            onScreen,
            pauseOnHover: true,
            click: false,
            showIcon: true,
        },
        slidingEnter: {
            delay: 0,
            timingFunction: 'ease-out',
            duration: 500,
        },
        slidingExit: {
            delay: 0,
            timingFunction: 'ease-in-out',
            duration: 350,
        }
    })
}