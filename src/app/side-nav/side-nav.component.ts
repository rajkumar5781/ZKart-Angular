import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent {

  @Output() closeSidenav = new EventEmitter<void>();

  navclose(){
    this.closeSidenav.emit();
  }
}
