import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LucideAngularModule, Bug, TriangleAlert } from 'lucide-angular';
import { CodeblockComponent } from '../../shared/codeblock/codeblock.component';

interface Comment {
  id: number;
  username:string;
  content: string;
  createdAt: string;
  safeContent?: SafeHtml;
}

@Component({
  selector: 'app-xss',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, LucideAngularModule, CodeblockComponent],
  templateUrl: './xss.component.html',
  styleUrls: ['./xss.component.scss']
})
export class XssComponent implements OnInit, AfterViewChecked {
  readonly Bug = Bug;
  readonly TriangleAlert = TriangleAlert;
  comments: Comment[] = [];
  newComment = '';
  newUsername = '';
  private lastRenderedCommentIds = new Set<number>();

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.loadComments();
  }

  ngAfterViewChecked() {
    // After Angular updated the DOM it executes any scripts for newly rendered comments
    this.executePendingScripts();
  }

  loadComments() {
    this.http.get<Comment[]>('/api/comments').subscribe(data => {
      // attach a SafeHtml property for rendering
      this.comments = data.map(c => ({
        ...c,
        safeContent: this.sanitizer.bypassSecurityTrustHtml(c.content)
      }));
      // clear tracker so we will execute scripts for newly-loaded comments
      this.lastRenderedCommentIds.clear();
    });
  }

  submit() {
    if (!this.newComment.trim() || !this.newUsername.trim()) return;

    this.http.post('/api/comments', {
      username: this.newUsername,
      content: this.newComment
    }).subscribe(() => {
        this.newComment = '';
        this.newUsername = '';
        this.loadComments();
      });
  }

  private executePendingScripts() {
    for (const c of this.comments) {
      if (this.lastRenderedCommentIds.has(c.id)) continue;

      const container = document.getElementById(`comment-${c.id}`);
      if (!container) continue;

      // query for any script tags found inside the rendered HTML
      const scripts = Array.from(container.querySelectorAll('script'));
      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script');

        // copy attributes (if needed)
        for (let i = 0; i < oldScript.attributes.length; i++) {
          const attr = oldScript.attributes[i];
          newScript.setAttribute(attr.name, attr.value);
        }

        // inline script content
        newScript.text = oldScript.textContent ?? '';
        //append and remove (optional)
        container.appendChild(newScript);
        // If you want to remove the newly appended script after execution:
        // container.removeChild(newScript);
      });

      this.lastRenderedCommentIds.add(c.id);
    }
  }


  vulnerableCode = `// VULNERABLE CODE - DO NOT USE IN PRODUCTION
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Comment {
  id: number;
  username: string;
  content: string;     // <-- ez a mező tartalmazza a nyers HTML-t / scriptet
  createdAt: string;
}

@Component({
  selector: 'app-xss-demo',
  templateUrl: './xss-demo.component.html'
})
export class XssDemoComponent implements OnInit {

  comments: Comment[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // sérülékeny: a tartalmat minden tisztítás nélkül betöltjük
    this.http.get<Comment[]>('/api/comments')
      .subscribe(data => this.comments = data);
  }
}`;

  xssRawCode = `<img src=x onerror="alert('XSS')">
<script>alert('Try me')</script>
<img src=x onerror="document.body.innerHTML='if you dare!'">`;

  secureCode = `// SAFE CODE - Use this approach instead
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import DOMPurify from 'dompurify';

interface Comment {
  id: number;
  username: string;
  content: string;
  createdAt: string;
  safeContent?: SafeHtml;
}

@Component({
  selector: 'app-xss-demo',
  templateUrl: './xss-demo.component.html'
})
export class XssDemoComponent implements OnInit {

  comments: Comment[] = [];

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    // Safe: Sanitize content before displaying using DOMPurify
    this.http.get<Comment[]>('/api/comments')
      .subscribe(data => {
        this.comments = data.map(comment => ({
          ...comment,
          safeContent: this.sanitizer.bypassSecurityTrustHtml(
            DOMPurify.sanitize(comment.content)
          )
        }));
      });
  }
}`;

}