import {Component, OnInit} from '@angular/core';
import {v4 as uuidv4} from 'uuid';
import {WatchService} from '../../watch/data-service/watch.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-splash-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.sass']
})
export class HomePageComponent implements OnInit {
    constructor(public service: WatchService, public router: Router) {
    }

    loading = true;
    validationError = false;
    streams: string[] = [];
    userID = '123456';

    async ngOnInit() {
        this.loading = false;
    }

    validUserID(): boolean {
        const pattern = /^[a-zA-Z0-9]{3,}$/;
        return pattern.test(this.userID);
    }

    watchVideo() {
        const validUserID = this.validUserID();

        if (!validUserID) {
            return this.validationError = true;
        }

        this.router.navigate(['/watch'], { queryParams: { streamID: uuidv4(), userID: this.userID } });

    }

    async getCurrentStreams() {
        const validUserID = this.validUserID();

        if (!validUserID) {
            return this.validationError = true;
        }

        this.streams = await this.service.getStreams(this.userID);
    }
}


