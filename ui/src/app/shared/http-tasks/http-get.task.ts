import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HttpGetTask {
  constructor(private http: HttpClient) { }

  async get(url: string, options: any = {headers : {}, params: {}}): Promise<any> {
    try {
      return await this.http.get(url, options).toPromise();
    } catch (error) {
      throw error;
    }
  }
}
