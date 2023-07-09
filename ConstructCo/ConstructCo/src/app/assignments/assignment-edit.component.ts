import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from './../../environments/environment';
import { Assignment } from './assignment';
import { Project } from './../projects/project';
import { Employee } from './../employees/employee';
import { Job } from './../jobs/job';

@Component({
  selector: 'app-assignment-edit',
  templateUrl: './assignment-edit.component.html',
  styleUrls: ['./assignment-edit.component.scss']
})
export class AssignmentEditComponent implements OnInit {

  // the view title
  title?: string;

  // the form model
  form!: FormGroup;

  // the assignment object to edit or create
  assignment?: Assignment;

  // the assignment object assignmentId, as fetched from the active route:
  // It's NULL when we're adding a new assignment,
  // and not NULL when we're editing an existing one.
  assignmentId?: number;

  // the projects array for the select
  public projects?: Project[] = [];

  // the employees array for the select
  public employees?: Employee[] = [];

  // the jobs array for the select
  public jobs?: Job[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      assignDate: new FormControl('', Validators.required),
      projectId: new FormControl('', Validators.required),
      employeeId: new FormControl('', Validators.required),
      assignJobId: new FormControl('', Validators.required),                  
      assignHourCharge: new FormControl('', Validators.required),
      hours: new FormControl('', Validators.required),
      charge: new FormControl('', Validators.required)

    }, null, this.isDupeAssignment());

    this.loadData();
  }
  loadData() {

    // load projects
    this.loadProjects();

    // load employees
    this.loadEmployees();

    // load jobs
    this.loadJobs();

    // retrieve the assignmantId from the 'assignmentId' parameter
    var idParam = this.activatedRoute.snapshot.paramMap.get('assignmentId');
    this.assignmentId = idParam ? +idParam : 0;
    if (this.assignmentId) {

      // EDIT MODE
      // fetch the assignment from the server
      var url = environment.baseUrl + 'api/Assignments/' + this.assignmentId;
      this.http.get<Assignment>(url).subscribe(result => {
        this.assignment = result;
        this.title = "Edit - " + this.assignment.assignmentId;

        // update the form with the assignment value
        this.form.patchValue(this.assignment);
      }, error => console.error(error));
    }
    else {

      // ADD NEW MODE
      this.title = "Create a new Assignment";
    }
  }

  loadProjects() {
    // fetch all the projects from the server
    var url = environment.baseUrl + 'api/Projects';
    var params = new HttpParams()
      .set("pageIndex", "0")
      .set("pageSize", "9999")
      .set("sortColumn", "name");

    this.http.get<any>(url, { params }).subscribe(result => {
      this.projects = result.data;
    }, error => console.error(error));
  }

  loadEmployees() {
    // fetch all the employees from the server
    var url = environment.baseUrl + 'api/Employees';
    var params = new HttpParams()
      .set("pageIndex", "0")
      .set("pageSize", "9999")
      .set("sortColumn", "lastName");

    this.http.get<any>(url, { params }).subscribe(result => {
      this.employees = result.data;
    }, error => console.error(error));
  }

  loadJobs() {
    // fetch all the jobs from the server
    var url = environment.baseUrl + 'api/Jobs';
    var params = new HttpParams()
      .set("pageIndex", "0")
      .set("pageSize", "9999")
      .set("sortColumn", "description");

    this.http.get<any>(url, { params }).subscribe(result => {
      this.jobs = result.data;
    }, error => console.error(error));
  }

  onSubmit() {
    var assignment = (this.assignmentId) ? this.assignment : <Assignment>{};
    if (assignment) {
      assignment.assignDate = this.form.controls['assignDate'].value;
      assignment.projectId = +this.form.controls['projectId'].value;
      assignment.employeeId = +this.form.controls['employeeId'].value;
      assignment.assignJobId = +this.form.controls['assignJobId'].value;
      assignment.assignHourCharge = +this.form.controls['assignHourCharge'].value;
      assignment.hours = +this.form.controls['hours'].value;
      assignment.charge = +this.form.controls['charge'].value;

      if (this.assignmentId) {

        // EDIT mode
        var url = environment.baseUrl + 'api/Assignments/' + assignment.assignmentId;
        this.http
          .put<Assignment>(url, assignment)
          .subscribe(result => {

            console.log("Assignment " + assignment!.assignmentId + " has been updated.");

            // go back to assignments view
            this.router.navigate(['/assignments']);
          }, error => console.error(error));
      }
      else {

        // ADD NEW mode
        var url = environment.baseUrl + 'api/Assignments';
        this.http
          .post<Assignment>(url, assignment)
          .subscribe(result => {

            console.log("Assignment " + result.assignmentId + " has been created.");

            // go back to assignments view
            this.router.navigate(['/assignments']);
          }, error => console.error(error));
      }
    }
  }

  isDupeAssignment(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } |
      null> => {

      var assignment = <Assignment>{};
      assignment.assignmentId = (this.assignmentId) ? this.assignmentId : 0;
      assignment.assignDate = this.form.controls['assignDate'].value;
      assignment.projectId = +this.form.controls['projectId'].value;
      assignment.employeeId = +this.form.controls['employeeId'].value;
      assignment.assignJobId = +this.form.controls['assignJobId'].value;
      assignment.assignHourCharge = +this.form.controls['assignHourCharge'].value;
      assignment.hours = +this.form.controls['hours'].value;
      assignment.charge = +this.form.controls['charge'].value;

      var url = environment.baseUrl + 'api/Assignments/IsDupeAssignment';
      return this.http.post<boolean>(url, assignment).pipe(map(result => {

        return (result ? { isDupeAssignment: true } : null);
      }));
    }
  }

  //isDupeField(fieldName: string): AsyncValidatorFn {
  //  return (control: AbstractControl): Observable<{
  //    [key: string]: any
  //  } | null> => {

  //    var params = new HttpParams()
  //      .set("assignmentId", (this.assignmentId) ? this.assignmentId.toString() : "0")
  //      .set("fieldName", fieldName)
  //      .set("fieldValue", control.value);

  //    var url = environment.baseUrl + 'api/Assignments/IsDupeField';
  //    return this.http.post<boolean>(url, null, { params })
  //      .pipe(map(result => {

  //        return (result ? { isDupeField: true } : null);
  //      }));
  //  }
 /* }*/
}
