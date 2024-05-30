import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-productquntitycounter',
  standalone: true,
  imports: [],
  templateUrl: './productquntitycounter.component.html',
  styleUrl: './productquntitycounter.component.css'
})
export class ProductquntitycounterComponent {
  @Input() totalproductCount : number = 1;
  @Output() totalValueChanged = new EventEmitter<number>();
  @Input() totalCount : number = 1;
  @Input() isUpdating : boolean = false;
  
  decreseCount(){
    if (this.totalproductCount > 1) {
        this.totalproductCount = this.totalproductCount - 1;
        this.emitTotalValueChanged();
    }
  }
  increseCount(){
    if (this.totalproductCount < this.totalCount) {
      this.totalproductCount = this.totalproductCount + 1;
      this.emitTotalValueChanged();
  }
}
emitTotalValueChanged() {
  this.totalValueChanged.emit(this.totalproductCount);
}
}
