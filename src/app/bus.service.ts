import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BusService {
  private apiUrl = 'http://localhost:5074';  // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  getBuses(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl + '/api/Bus/GetFilteredBuses').pipe(
      map(response => response.data) // Correctly map to the data array
    );
  }

  getBus(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl+'/api/Bus/GetBusById/'}${id}`);
  }

  addBus(bus: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+'/api/Bus/AddBus/', bus);
  }

  updateBus(id: number, bus: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl+'/api/Bus/UpdateBus/'}${id}`,bus);
  }

  deleteBus(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl+'/api/Bus/DeleteBus/'}${id}`);
  }
  uploadBusTemplate(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/api/Bus/Upload`, formData);
  }
}
