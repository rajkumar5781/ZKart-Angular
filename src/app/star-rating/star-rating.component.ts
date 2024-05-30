import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.css'
})
export class StarRatingComponent {
  @Input() rating = 0;
  stars: boolean[] = [];

  ngOnInit() {
    this.stars = Array(5).fill(false).map((_, i) => i < this.rating);
  }

}
