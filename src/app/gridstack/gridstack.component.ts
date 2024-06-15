import { Component, ElementRef, ViewChild } from '@angular/core';
import { GridStack, GridStackWidget } from 'gridstack';

@Component({
  selector: 'app-gridstack',
  standalone: true,
  imports: [],
  templateUrl: './gridstack.component.html',
  styleUrl: './gridstack.component.css'
})


export class GridstackComponent {

  public items: GridStackWidget[] = [
    { x: 0, y: 0, w: 9, h: 6, content: '0' },
    { x: 9, y: 0, w: 3, h: 3, content: '1' },
    { x: 9, y: 3, w: 3, h: 3, content: '2' },
  ];
  private grid!: GridStack;

  @ViewChild('gridstackContainer', { static: false }) gridstackContainer!: ElementRef;

  constructor(){}

  public ngOnInit() {
    // this.grid = GridStack.init({
    //   cellHeight: 70,
    // })
    // .load(this.items); 
    // and load our content directly (will create DOM)
  }

  ngAfterViewInit() {
    if (this.gridstackContainer && this.gridstackContainer.nativeElement) {
      this.grid = GridStack.init({
        cellHeight: 70,
        margin: 5,
      }, this.gridstackContainer.nativeElement);

      // Load initial items
      this.grid?.load(this.items);
    } else {
      console.error('gridstackContainer is not defined');
    }
  }
  public add() {
    this.grid.addWidget({w: 3, h:3, content: 'new content'});
  }
  public delete() {
    this.grid.removeWidget(this.grid.engine.nodes[0].el!);
  }
  public change() {
   this.grid.update(this.grid.engine.nodes[0].el!, {w: 1});
  }
}
