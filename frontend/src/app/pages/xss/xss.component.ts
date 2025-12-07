import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  safeContent?: SafeHtml;
}

@Component({
  selector: 'app-xss',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './xss.component.html',
  styleUrl: './xss.component.scss'
})
export class XssComponent implements OnInit, AfterViewChecked {
  comments: Comment[] = [];
  newComment = '';
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
    if (!this.newComment.trim()) return;

    this.http.post('/api/comments', { content: this.newComment })
      .subscribe(() => {
        this.newComment = '';
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
}