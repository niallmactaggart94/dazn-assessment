import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpGetTask} from '../../shared/http-tasks/http-get.task';
import {HttpPostTask} from '../../shared/http-tasks/http-post.task';

@Injectable({providedIn: 'root'})
export class WatchService {

    url: string;

    constructor(public httpGet: HttpGetTask, public httpPost: HttpPostTask) {
    }

    async getStreams(userID: string): Promise<any> {
        this.url = environment.backendUrl + 'video/streams';
        const options = {
            params: {userID}
        };

        try {
            const streams = await this.httpGet.get(this.url, options);
            return streams;
        } catch (err) {
            throw err;
        }
    }

    async removeStream(userID: string, streamID: string): Promise<any> {
        this.url = environment.backendUrl + 'video/remove';
        const body = {userID, streamID};

        try {
            await this.httpPost.post(this.url, JSON.stringify(body));
        } catch (err) {
            throw err;
        }
    }


}
