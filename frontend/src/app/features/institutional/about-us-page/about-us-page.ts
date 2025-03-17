import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-about-us-page',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './about-us-page.html',
  styleUrl: './about-us-page.css',
})
export class AboutUsPage {}
