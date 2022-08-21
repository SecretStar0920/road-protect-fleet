import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { NGXLogger } from 'ngx-logger';

@Injectable({
    providedIn: 'root',
})
export class SocketManagementService {
    socketId: string;

    constructor(private socket: Socket, private logger: NGXLogger) {
        this.connect();
    }

    connect() {
        this.onConnection();
        this.socket.connect();
    }

    disconnect() {
        this.socket.disconnect(true);
    }

    onConnection() {
        this.socket.fromEvent('connect').subscribe((result) => {
            this.logger.info('Socket connected: ', this.socket.ioSocket.id);
            sessionStorage.setItem('io', this.socket.ioSocket.id);
            this.socketId = this.socket.ioSocket.id;
        });
    }
}
