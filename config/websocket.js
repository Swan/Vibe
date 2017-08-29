import * as config from '../config/config.json';
import { topScore } from '../events/topscore';

const WebSocket = require('ws');

export function establishWebSocketConnection(client) {
    let socket = new WebSocket(config.websocket);

    socket.onopen = (event) => {
        const message = { type: 'subscribe_scores', data: [] };
        socket.send(JSON.stringify(message));

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            
            if (message.type == "subscribed_to_scores") console.log("[VIBE - WEBSOCKET] Successfully connected & subscribed to the Ripple WebSocket.");

            if (message.type == "new_score" && message.data.play_mode == 3 && message.data.pp >= config.topScores.minPP) {
                console.log("[VIBE - WEBSOCKET] New Mania Score Submitted.");
                return topScore(client, message.data);
            }
        };     
    };

    socket.onclose = (event) => {
        console.log("[VIBE - WEBSOCKET] Socket Closed. Attempting to reconnect...");
        establishWebSocketConnection(client);
    };

}