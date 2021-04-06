import {Component, HostListener, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { validate as uuidValidate } from 'uuid';
import {WatchService} from './data-service/watch.service';
import {environment} from '../../environments/environment';


@Component({
  selector: 'app-watch-stream',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.sass']
})
export class WatchComponent implements OnInit {
  error: string;
  loading = true;
  userID: string;
  streamID: string;
  src: any;

  constructor(public route: ActivatedRoute, public service: WatchService) {

  }

  async ngOnInit() {
    this.streamID = this.getStreamID();
    this.userID = this.getUserID();

    if (!this.streamID || !uuidValidate(this.streamID)) {
      this.error = 'Incorrect ID used for stream';
    }

    if (!this.userID) {
      this.error = 'No User specified';
    }

    this.loading = false;
  }

  @HostListener('window:beforeunload', ['$event'])
  public onBeforeUnload = async () => {

    const url = environment.backendUrl + 'video/remove';
    const data = {
        streamID: this.streamID,
        userID: this.userID
    };

    navigator.sendBeacon(url, JSON.stringify(data));
  }

  @HostListener('window:popstate', ['$event'])
  public onPopState = async () => {
    await this.service.removeStream(this.userID, this.streamID);
  }

  public videoErrorHandler = () => {
      this.error = 'Something has gone wrong loading the video';
  }

  public getStreamID = () => this.route.snapshot.queryParams.streamID || '';
  public getUserID = () => this.route.snapshot.queryParams.userID || '';

}
