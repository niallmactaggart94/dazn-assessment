import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HttpPostTask {
    constructor(private http: HttpClient) { }

    async post(url: string, body: any): Promise<any> {
        try {
            return await this.http.post(url, body).toPromise();
        } catch (error) {
            throw error;
        }
    }
}
