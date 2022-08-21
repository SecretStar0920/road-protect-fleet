import { Global, Injectable } from '@nestjs/common';
import { DistributedWebsocket } from '@modules/shared/modules/socket-state/distributed-websocket';

@Global()
export class SocketStateService {
    private socketState = new Map<string, DistributedWebsocket>();

    static instance: SocketStateService;
    constructor() {
        SocketStateService.instance = this;
    }

    public add(socketId: string, socket: DistributedWebsocket) {
        this.socketState.set(socketId, socket);
    }

    public remove(socketId: string) {
        this.socketState.delete(socketId);
    }

    public get(socketId: string) {
        return this.socketState.get(socketId);
    }

    public getAll(): DistributedWebsocket[] {
        const all: DistributedWebsocket[] = [];
        this.socketState.forEach((sockets) => all.push(sockets));
        return all;
    }
}
