
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import * as Player from "@vimeo/player/dist/player.js";

@Component({
  selector: 'app-test-player',
  template: `
  <div #player_container style="display: inline-block"></div>
  <div #player_container2 style="display: inline-block"></div>`,
})
export class TestPlayerComponent implements AfterViewInit {

  @ViewChild('player_container') playerContainer;
  @ViewChild('player_container2') playerContainer2;
  private player1: Player;
  private player2: Player;
  ngAfterViewInit() {
    this.player1 = new Player(this.playerContainer.nativeElement, {
      id: 349683773,
      width: 640

    });
    this.player2 = new Player(this.playerContainer2.nativeElement, {
      url: 'https://vimeo.com/348721737',
      width: 640
    });
  }
}
