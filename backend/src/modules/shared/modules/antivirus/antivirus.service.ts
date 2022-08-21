import { Injectable, OnModuleInit } from '@nestjs/common';
import * as ClamScan from 'clamscan';
import { Readable } from 'stream';
import { VirusFoundException } from '@modules/shared/modules/antivirus/virus-found.exception';
import { Logger } from '@logger';

export interface IClamScan {
    get_version: () => void;
    is_infected: (file: string) => Promise<{ file: string; is_infected: boolean; viruses: string[] }>;
    scan_stream: (stream: any) => Promise<{ is_infected: boolean; viruses: string[]; file: string; resultString: string }>;
}
export interface INodeClam {
    init: (options?: any) => Promise<IClamScan>;
}

@Injectable()
export class AntivirusService implements OnModuleInit {
    private clamscan: IClamScan;
    async onModuleInit() {
        const nodeClam: INodeClam = new ClamScan();
        this.clamscan = await nodeClam.init({
            remove_infected: false, // If true, removes infected files
            quarantine_infected: false, // False: Don't quarantine, Path: Moves files to this place.
            scan_log: null, // Path to a writeable log file to write scan results into
            debug_mode: false, // Whether or not to log info/debug/error msgs to the console
            scan_recursively: true, // If true, deep scan folders recursively
            clamscan: {
                path: '/usr/bin/clamscan', // Path to clamscan binary on your server
                db: null, // Path to a custom virus definition database
                scan_archives: true, // If true, scan archives (ex. zip, rar, tar, dmg, iso, etc...)
                active: true, // If true, this module will consider using the clamscan binary
            },
            clamdscan: {
                socket: '/var/run/clamav/clamd.ctl', // Socket file for connecting via TCP
                host: false, // IP of host to connect to TCP interface
                port: false, // Port of host to use when connecting via TCP interface
                timeout: 60000, // Timeout for scanning files
                local_fallback: false, // Do no fail over to binary-method of scanning
                path: '/usr/bin/clamdscan', // Path to the clamdscan binary on your server
                config_file: null, // Specify config file if it's in an unusual place
                multiscan: true, // Scan using all available cores! Yay!
                reload_db: false, // If true, will re-load the DB on every call (slow)
                active: false, // If true, this module will consider using the clamdscan binary
                bypass_test: false, // Check to see if socket is available when applicable
            },
            preference: 'clamdscan', // If clamdscan is found and active, it will be used by default
        });
    }

    async scanBuffer(buffer: Buffer) {
        try {
            const result = await this.clamscan.scan_stream(this.bufferToStream(buffer));
            if (result.is_infected) {
                throw new VirusFoundException();
            }
            return { result };
        } catch (e) {
            if (e instanceof VirusFoundException) {
                throw e;
            }
            Logger.instance.error({
                fn: this.scanBuffer.name,
                message: e.message,
                detail: {
                    stack: e.stack,
                },
            });
        }
    }

    private bufferToStream(binary) {
        return new Readable({
            read() {
                this.push(binary);
                this.push(null);
            },
        });
    }
}
