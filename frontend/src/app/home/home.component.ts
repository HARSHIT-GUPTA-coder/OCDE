import { Component, OnInit } from '@angular/core';
// import {ParticlesComponent} from 'angular-particle'
declare var particlesJS: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    particlesJS.load('particles-js', 'assets/particles.json', function() {
      console.log('callback - particles.js config loaded');
      let el = document.querySelector(".particles-js-canvas-el"); 
      // el.setAttribute("height", "100%");
    });
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({behavior:"smooth"});
}
}
