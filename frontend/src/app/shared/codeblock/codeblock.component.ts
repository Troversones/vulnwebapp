import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-code-block',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './codeblock.component.html',
  styleUrls: ['./codeblock.component.scss']
})
export class CodeblockComponent {
  @Input() public title?: string;
  @Input() public code: string = '';
}
