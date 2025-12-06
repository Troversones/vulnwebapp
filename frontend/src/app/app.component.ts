import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  template: `
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-content">
        <div class="navbar-items">

          <div class="navbar-brand">
            Vulnerable Web App Demo
          </div>

          <div class="navbar-links">
            <button routerLink="/" routerLinkActive="active" class="nav-button" [routerLinkActiveOptions]="{exact: true}"> Home </button>
            <button routerLink="/xss" routerLinkActive="active" class="nav-button"> Stored XSS </button>
          </div>
          
        </div>
      </div>
    </div>
  </nav>
  `,
  styleUrl: './app.component.scss',
  imports: [RouterLink, RouterLinkActive]
})
export class NavBar {}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBar],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
