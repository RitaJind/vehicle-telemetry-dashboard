import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

export interface TelemetryData {
  timestamp: string;
  speed_kph: number;
  battery_soc_percent: number;
  motor_temp_c: number;
  odometer_km: number;
}

@Injectable({
  providedIn: 'root'
})
export class TelemetrySimulationService {
  private allTelemetryData: TelemetryData[] = [];
  private currentIndex = 0;

  // Simple subject to emit current telemetry data
  private currentTelemetrySubject = new BehaviorSubject<TelemetryData | null>(null);
  currentTelemetry$ = this.currentTelemetrySubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadData();
  }

  private loadData() {
    this.http.get<TelemetryData[]>('assets/simple_telemetry.json').subscribe({
      next: (data) => {
        this.allTelemetryData = data;
        this.startSimulation();
      },
      error: () => {
        // Use fallback data if JSON loading fails
        this.allTelemetryData = [{
          timestamp: new Date().toISOString(),
          speed_kph: 75,
          battery_soc_percent: 85,
          motor_temp_c: 65,
          odometer_km: 12345.6
        }];
        this.startSimulation();
      }
    });
  }

  private startSimulation() {
    if (this.allTelemetryData.length === 0) return;

    // Emit first data immediately
    this.emitCurrentData();

    // Update every 5 seconds
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.allTelemetryData.length;
      this.emitCurrentData();
    }, 5000);
  }

  private emitCurrentData() {
    const currentData = this.allTelemetryData[this.currentIndex];
    this.currentTelemetrySubject.next(currentData);
  }
}
