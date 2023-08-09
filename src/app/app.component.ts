import {
  Component,
  ElementRef,
  ChangeDetectionStrategy,
  AfterViewInit,
  ViewChild, OnDestroy,
} from '@angular/core';
import { PanZoomConfig, PanZoomModel} from 'ngx-panzoom';
import {Subscription} from "rxjs";

@Component({
    selector: 'app-root',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './app.component.html',
    styleUrls: [
        './app.component.scss'
    ]
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  circles: { x: number; y: number; selected: boolean }[] = [];
  selectedCircleIndex: number | null = null;
  panZoomConfig: PanZoomConfig = new PanZoomConfig();
  private modelChangedSubscription: Subscription;
  private cancelPropagationEvent: boolean = false;
  private dragging: boolean = false;
  private dragStartPoint: { x: number, y: number } | null = null;
  private canvasPanEnabled: boolean = true; // Ajoutez cette propriété
  private isDraggingCircle: boolean = false;

  ngAfterViewInit(): void {
    this.modelChangedSubscription = this.panZoomConfig.modelChanged.subscribe((model: PanZoomModel) => this.onModelChanged(model));

    // Écouter les clics sur le document pour fermer le menu
    document.addEventListener('click', this.handleDocumentClick.bind(this));
  }

  ngOnDestroy(): void {
    this.modelChangedSubscription.unsubscribe();
  }

  onModelChanged(model: PanZoomModel): void {
    // Handle model changes if needed
  }

  addCircle(event: MouseEvent): void {
    if (this.selectedCircleIndex === null) {
      const svgElement = this.mapContainer.nativeElement;
      const svgPoint = svgElement.createSVGPoint();
      svgPoint.x = event.clientX;
      svgPoint.y = event.clientY;

      const transformMatrix = svgElement.getScreenCTM()!.inverse();
      const newPoint = svgPoint.matrixTransform(transformMatrix);

      this.circles.push({ x: newPoint.x, y: newPoint.y, selected: false });
    }
  }

  removeSelectedCircle(): void {
    if (this.selectedCircleIndex !== null) {
      this.circles.splice(this.selectedCircleIndex, 1);
      this.selectedCircleIndex = null;
    }
  }

  selectCircle(index: number,  event : MouseEvent): void {
    // console.log("circle selected");
    console.log(this.circles);
    console.log(this.selectedCircleIndex);
    if (this.selectedCircleIndex !== null) {
      this.circles[this.selectedCircleIndex].selected = false;
    }
    this.selectedCircleIndex = index;
    this.circles[index].selected = true;
    this.cancelPropagationEvent = true;
    event.stopPropagation();
  }

  deselectCircle(): void {
    console.log("circle selected");
    if (this.selectedCircleIndex !== null) {
      this.circles[this.selectedCircleIndex].selected = false;
      this.selectedCircleIndex = null;
    }
  }

  closeMenu(): void {
    this.deselectCircle();
  }

  handleDocumentClick(event: MouseEvent): void {
    if (!this.mapContainer.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  }

  handleCanvasClick(event: MouseEvent): void {
    if (!this.mapContainer.nativeElement.contains(event.target)) {
      this.deselectCircle();
    }
  }

  onMouseMove(e: MouseEvent): void {
    if (this.dragging && this.selectedCircleIndex !== null && this.dragStartPoint) {
      // Met à jour les coordonnées du point sélectionné en fonction du mouvement de la souris
      const svgElement = this.mapContainer.nativeElement;
      const svgPoint = svgElement.createSVGPoint();
      svgPoint.x = e.clientX;
      svgPoint.y = e.clientY;

      const transformMatrix = svgElement.getScreenCTM()!.inverse();
      const newPoint = svgPoint.matrixTransform(transformMatrix);

      const circle = this.circles[this.selectedCircleIndex];
      circle.x = newPoint.x;
      circle.y = newPoint.y;
    }
  }
  onMouseUp(): void {
    if (this.dragging) {
      this.dragging = false;
      this.dragStartPoint = null;
      this.canvasPanEnabled = true;
      this.panZoomConfig.panOnClickDrag = true;
      window.removeEventListener('mousemove', this.onMouseMove.bind(this));
    }
  }

  onMouseDown(event: MouseEvent): void {
    if (this.selectedCircleIndex) {
      console.log("Mouse down");
      event.stopPropagation();
      this.startDrag(event, this.selectedCircleIndex);
      this.panZoomConfig.panOnClickDrag=false;
    }
  }

  startDrag(event: MouseEvent, index: number): void {
    if (!this.dragging) {
      this.selectedCircleIndex = index;
      this.dragging = true;
      this.dragStartPoint = { x: this.circles[index].x, y: this.circles[index].y };
      this.canvasPanEnabled = false;
      this.panZoomConfig.panOnClickDrag = false;
    }
  }
}
