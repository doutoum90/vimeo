import { Component, OnInit } from '@angular/core';
import { EmbedVideoService } from 'ngx-embed-video';

@Component({
  selector: 'app-test-embedded',
  template: `
  <div style="display: inline-block" [innerHtml]="iframe_html"></div>
  <div style="display: inline-block" [innerHtml]="iframe_html2"></div>
  `
})
export class TestEmbeddedComponent implements OnInit {
  iframe_html: any;
  iframe_html2: any;
  constructor(private embedService: EmbedVideoService) {
  }
  ngOnInit() {
    this.iframe_html = this.embedService.embed_vimeo('349683773');
    this.iframe_html2 = this.embedService.embed('https://vimeo.com/197933516');
  }

}
