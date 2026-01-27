import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import api from './axios';

declare global {
    interface Window {
        Pusher: any;
        Echo: any;
    }
}

window.Pusher = Pusher;

// Helper to determine if we should enable Reverb/Pusher
const shouldEnableReverb = () => {
    const key = import.meta.env.VITE_REVERB_APP_KEY;
    // Don't enable if missing or if it's our dummy local key
    return key && key !== 'velora_local_key';
};

let echo: any = null;

if (shouldEnableReverb()) {
    echo = new Echo({
        broadcaster: 'reverb',
        key: import.meta.env.VITE_REVERB_APP_KEY,
        wsHost: import.meta.env.VITE_REVERB_HOST,
        wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
        wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
        authorizer: (channel: any, options: any) => {
            return {
                authorize: (socketId: string, callback: Function) => {
                    api.post('/broadcasting/auth', {
                        socket_id: socketId,
                        channel_name: channel.name
                    })
                        .then(response => {
                            callback(false, response.data);
                        })
                        .catch(error => {
                            callback(true, error);
                        });
                }
            };
        },
    });
} else {
    // console.log("Real-time features disabled: No valid Reverb key configured.");
}

export default echo;
