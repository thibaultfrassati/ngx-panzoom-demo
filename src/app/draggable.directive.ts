import {Directive, ElementRef, HostListener, Input, Renderer2} from "@angular/core";

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective {
  @Input() draggableData: any;

  private dragging: boolean = false;
  private initialX: number = 0;
  private initialY: number = 0;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    this.dragging = true;
    this.initialX = event.clientX - this.draggableData.x;
    this.initialY = event.clientY - this.draggableData.y;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.dragging) {
      const newX = event.clientX - this.initialX;
      const newY = event.clientY - this.initialY;

      this.renderer.setStyle(this.elementRef.nativeElement, 'transform', `translate(${newX}px, ${newY}px)`);
    }
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.dragging = false;
  }
}
