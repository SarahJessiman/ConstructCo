import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { Employee } from './employee';


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})

export class EmployeesComponent implements OnInit {
  public displayedColumns: string[] = ['employeeId', 'lastName', 'firstName', 'initials', 'hireDate', 'jobId', 'yearsOfService'];
  public employees!: MatTableDataSource<Employee>;

  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string = "employeeId";
  public defaultSortOrder: "asc" | "desc" = "asc";

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient) {
  }
  ngOnInit() {
    this.loadData();
  }
  loadData() {
    var pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    this.getData(pageEvent);
  }

  getData(event: PageEvent) {
    var url = environment.baseUrl + 'api/Employees';
    var params = new HttpParams()
      .set("pageIndex", event.pageIndex.toString())
      .set("pageSize", event.pageSize.toString())
      .set("sortColumn", (this.sort)
        ? this.sort.active
        : this.defaultSortColumn)
      .set("sortOrder", (this.sort)
        ? this.sort.direction
        : this.defaultSortOrder);
    this.http.get<any>(url, { params })
      .subscribe(result => {
        this.paginator.length = result.totalCount;
        this.paginator.pageIndex = result.pageIndex;
        this.paginator.pageSize = result.pageSize;
        this.employees = new MatTableDataSource<Employee>(result.data);
      }, error => console.error(error));
  }
}

