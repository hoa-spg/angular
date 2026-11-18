import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AirportHeader } from './airport-header/airport-header';

@Component({
  imports: [RouterOutlet, AirportHeader],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
