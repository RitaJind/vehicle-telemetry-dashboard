import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelemetrySimulationService, TelemetryData } from '../services/telemetry-simulation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit, OnDestroy {
  currentVehicleData: TelemetryData | null = null;
  private telemetrySubscription: Subscription | undefined;

  constructor(private telemetryService: TelemetrySimulationService) { }

  ngOnInit(): void {
    this.telemetrySubscription = this.telemetryService.currentTelemetry$.subscribe(data => {
      this.currentVehicleData = data;
      console.log('Current vehicle data updated:', data);
    });
  }

  ngOnDestroy(): void {
    this.telemetrySubscription?.unsubscribe();
  }
}
