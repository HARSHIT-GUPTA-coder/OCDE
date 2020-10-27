import { Component, OnInit } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';

@Component({
  selector: 'app-main-view',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  files = {
    names: [],
    pageToLoadNext: 1,
  };
  pageSize = 10;

  constructor(private sidebarService: NbSidebarService) {
    this.files.names.push(...['afsafasfasf','afsafasfasf','afsafasfasf','afsafasfasf','afsafasfasf','afsafasfasf','afsafasfasf','afsafasfasf','afsafasfasf','afsafasfasf','afsafasfasf','afsafasfasf',]);
  }

  loadNext(cardData) {
    cardData.pageToLoadNext++;
    // this.newsService.load(cardData.pageToLoadNext, this.pageSize)
    //   .subscribe(nextNews => {
    //     cardData.placeholders = [];
    //     cardData.news.push(...nextNews);
    //     cardData.loading = false;
    //     cardData.pageToLoadNext++;
    //   });
    
  }

  onClick(s) {
    console.log(s)
  }
  ngOnInit(): void {
    this.sidebarService.collapse('code')
  }

}
