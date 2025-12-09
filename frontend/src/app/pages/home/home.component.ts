import { Component } from '@angular/core';
import { LucideAngularModule, Shield, TriangleAlert, Lock, Code } from 'lucide-angular';


@Component({
  selector: 'app-home',
  imports: [LucideAngularModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {
  readonly Shield = Shield;
  readonly TriangleAlert = TriangleAlert;
  readonly Lock = Lock;
  readonly Code = Code;
}
