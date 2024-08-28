import { Component, OnInit , ViewChild, ElementRef} from '@angular/core';
import { BusService } from '../bus.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import  FileSaver from 'file-saver';

@Component({
  selector: 'app-bus-list',
  templateUrl: './bus-list.component.html',
  styleUrls: ['./bus-list.component.css']
})
export class BusListComponent implements OnInit {
  fileErrorMessage: string | null = null;

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  displayedColumns: string[] = [
    'id', 
    'driverName', 
    'driverPhoneNumber', 
    'busStopStation', 
    'carNumber', 
    'busCapacity', 
    'carModel', 
    'busLineStops', 
    'busType',
    'Actions'
  ];
  dataSource = new MatTableDataSource<any>();

  constructor(private busService: BusService, private router: Router,private http: HttpClient,private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadBuses();
  }

  loadBuses(): void {
    this.busService.getBuses().subscribe((data) => {
      console.log(data); 
      this.dataSource.data = data;
    });
  }

  deleteBus(id: number): void {
    this.busService.deleteBus(id).subscribe(() => {
      this.loadBuses();
    });
  }

  editBus(id: number): void {
    this.router.navigate(['/buses/edit', id]);
  }

  viewDetails(id: number): void {
    this.router.navigate(['/buses/details', id]);
  }

  addBus(): void {
    this.router.navigate(['/buses/add']);
  }
  downloadTemplate(): void {
    this.http.get('assets/Template.xlsx', { responseType: 'blob' }).subscribe(blob => {
      const fileURL = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = fileURL;
      anchor.download = 'Template.xlsx';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(fileURL); // Clean up the object URL
    }, error => {
      alert('Error downloading the file.');
    });
  }
  
  
  
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      if (!fileName.endsWith('.xlsx')) {
        this.fileErrorMessage = 'Only Excel files (.xlsx) are allowed.';
        this.snackBar.open(this.fileErrorMessage, 'Close', {
          duration: 3000,
        });
        event.target.value = ''; // Clear the input
      } else {
        this.fileErrorMessage = null;
        // Handle the file upload here
        this.busService.uploadBusTemplate(file).subscribe({
          next: (response) => {
            alert('File uploaded and processed successfully.');
            this.loadBuses();
          },
          error: (error) => {
            console.error('Upload error:', error);
            alert('File upload failed.');
          }
        });
      }
    }
  }
  

  uploadTemplate(): void {
    this.fileInput.nativeElement.click();
  }
  navigateToAddBus(): void {
    this.router.navigate(['buses/add']); // Adjust the route path based on your routing configuration
  }
}
