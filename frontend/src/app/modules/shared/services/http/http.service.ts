import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    constructor(private http: HttpClient, private logger: NGXLogger) {}

    public fullUrl(endpoint: string, version: string = environment.apiVersion): string {
        const url = `${environment.backendUrl}/${version}`;
        return `${url}/${endpoint}`;
    }

    get(endpoint: string, type: string = HttpType.JSON): Observable<any> {
        endpoint = this.fullUrl(endpoint);
        this.logger.debug(`GET ${endpoint}`, { endpoint, type });
        return this.http.get(endpoint, this.getOptions(type));
    }

    delete(endpoint: string, type: string = HttpType.JSON): Observable<any> {
        endpoint = this.fullUrl(endpoint);
        this.logger.debug(`DELETE ${endpoint}`, { endpoint, type });
        return this.http.delete(endpoint, this.getOptions(type));
    }

    post(endpoint: string, data: any, type: HttpType = HttpType.JSON): Observable<any> {
        endpoint = this.fullUrl(endpoint);
        this.logger.debug(`POST ${endpoint}`, { endpoint, data, type });
        const body = data;
        return this.http.post(endpoint, body, this.getOptions(type));
    }

    put(endpoint: string, data: any, type: HttpType = HttpType.JSON): Observable<any> {
        endpoint = this.fullUrl(endpoint);
        this.logger.debug(`PUT ${endpoint}`, { endpoint, data, type });
        const body = data;
        return this.http.put(endpoint, body, this.getOptions(type));
    }

    getSecure(endpoint: string, type: HttpType = HttpType.JSON): Observable<any> {
        return this.get(endpoint, type);
    }

    postSecure(endpoint: string, data: any, type: HttpType = HttpType.JSON): Observable<any> {
        // const body = JSON.stringify(data);
        return this.post(endpoint, data, type);
    }

    putSecure(endpoint: string, data: any, type: HttpType = HttpType.JSON): Observable<any> {
        return this.put(endpoint, data, type);
    }

    deleteSecure(endpoint: string, type: HttpType = HttpType.JSON): Observable<any> {
        return this.delete(endpoint, type);
    }

    downloadFile(endpoint: string): Observable<{ file: Blob; filename: string }> {
        return this.http
            .get(this.fullUrl(endpoint), {
                observe: 'response',
                responseType: 'blob',
            })
            .pipe(
                map((response) => {
                    const contentDispositionHeader: string = response.headers.get('Content-Disposition');
                    const parts: string[] = contentDispositionHeader.split(';');
                    const filename = decodeURIComponent(parts[1].split('=')[1]);
                    const file = response.body;
                    return {
                        filename,
                        file,
                    };
                }),
            );
    }

    downloadFileWithBody(endpoint: string, body: object): Observable<{ file: Blob; filename: string }> {
        return this.http
            .post(this.fullUrl(endpoint), body, {
                observe: 'response',
                responseType: 'blob',
            })
            .pipe(
                map((response) => {
                    const contentDispositionHeader: string = response.headers.get('Content-Disposition');
                    const parts: string[] = contentDispositionHeader.split(';');
                    const filename = decodeURIComponent(parts[1].split('=')[1]);
                    const file = response.body;
                    return {
                        filename,
                        file,
                    };
                }),
            );
    }

    uploadFiles(endpoint: string, files: File[], body: object, ocr?: boolean): Observable<any> {
        const formData: FormData = new FormData();
        for (const file of files) {
            formData.append('files[]', file, file.name);
        }
        formData.append('body', JSON.stringify(body));
        if (ocr) {
            formData.append('ocr', JSON.stringify(ocr));
        }

        return this.http.post(this.fullUrl(endpoint), formData);
    }

    uploadFile(endpoint: string, file: File, body: object, ocr?: boolean): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        formData.append('body', JSON.stringify(body));
        if (ocr) {
            formData.append('ocr', JSON.stringify(ocr));
        }
        return this.http.post(this.fullUrl(endpoint), formData);
    }

    private getOptions(type: string = HttpType.JSON): { headers: HttpHeaders; responseType: any } {
        switch (type) {
            case HttpType.JSON:
                return {
                    headers: new HttpHeaders({ 'Response-Type': 'json', 'Content-Type': 'application/json' }),
                    responseType: 'json',
                };
            case HttpType.ARRAY_BUFFER:
                return {
                    headers: new HttpHeaders({ 'Response-Type': 'arraybuffer', 'Content-Type': 'application/json' }),
                    responseType: 'arraybuffer',
                };
            case HttpType.BLOB:
                return {
                    headers: new HttpHeaders({ 'Response-Type': 'blob', 'Content-Type': 'application/json' }),
                    responseType: 'blob',
                };
            case HttpType.TEXT:
                return {
                    headers: new HttpHeaders({ 'Response-Type': 'text', 'Content-Type': 'application/json' }),
                    responseType: 'text',
                };
        }
    }
}

export enum HttpType {
    JSON = 'json',
    TEXT = 'text',
    ARRAY_BUFFER = 'arraybuffer',
    BLOB = 'blob',
}
