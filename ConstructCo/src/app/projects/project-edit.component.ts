import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from './../../environments/environment';
import { Project } from './project';
import { Employee } from './../employees/employee';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss']
})
export class ProjectEditComponent implements OnInit {

  // the view title
  title?: string;

  // the form model
  form!: FormGroup;

  // the project object to edit or create
  project?: Project;

  // the project object projectId, as fetched from the active route:
  // It's NULL when we're adding a new project,
  // and not NULL when we're editing an existing one.
  projectId?: number;

  // the countries array for the select
  employees?: Employee[];


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient) {
  }

  ngOnInit() {
    this.form = new FormGroup({

      name: new FormControl('', Validators.required, this.isDupeField("name")), 
      value: new FormControl('', Validators.required),
      balance: new FormControl('', Validators.required),
      employeeId: new FormControl('', Validators.required)

    }, null, this.isDupeProject());

    this.loadData();
  }
  loadData() {

    // load employees
    this.loadEmployees();

    // retrieve the projectId from the 'projectId' parameter
    var idParam = this.activatedRoute.snapshot.paramMap.get('projectId');
    this.projectId = idParam ? +idParam : 0;
    if (this.projectId) {

      // EDIT MODE
      // fetch the project from the server
      var url = environment.baseUrl + 'api/Projects/' + this.projectId;
      this.http.get<Project>(url).subscribe(result => {
        this.project = result;
        this.title = "Edit - " + this.project.projectId;        

        // update the form with the project value
        this.form.patchValue(this.project);
      }, error => console.error(error));
    }
    else {

      // ADD NEW MODE
      this.title = "Create a new Project";
    }
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

  onSubmit() {
    var project = (this.projectId) ? this.project : <Project>{};
    if (project) {
      project.name = this.form.controls['name'].value;
      project.value = +this.form.controls['value'].value;
      project.balance = +this.form.controls['balance'].value;
      project.employeeId = +this.form.controls['employeeId'].value;

      if (this.projectId) {

        // EDIT mode
        var url = environment.baseUrl + 'api/Projects/' + project.projectId;
        this.http
          .put<Project>(url, project)
          .subscribe(result => {

            console.log("Project " + project!.projectId + " has been updated.");

            // go back to cities view
            this.router.navigate(['/projects']);
          }, error => console.error(error));
      }
      else {

        // ADD NEW mode
        var url = environment.baseUrl + 'api/Projects';
        this.http
          .post<Project>(url, project)
          .subscribe(result => {

            console.log("Project " + result.projectId + " has been created.");

            // go back to projects view
            this.router.navigate(['/projects']);
          }, error => console.error(error));
        /*this.isDupeProject();*/
      }
    }
  }
  
  isDupeProject(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } |
      null> => {

      var project = <Project>{};
      project.projectId = (this.projectId) ? this.projectId : 0;
      project.name = this.form.controls['name'].value;
      project.value = +this.form.controls['value'].value;
      project.balance = +this.form.controls['balance'].value;
      project.employeeId = +this.form.controls['employeeId'].value;

      var url = environment.baseUrl + 'api/Projects/IsDupeProject';
      return this.http.post<boolean>(url, project).pipe(map(result => {

        return (result ? { isDupeProject: true } : null);
      }));
    }
  }

  isDupeField(fieldName: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{
      [key: string]: any
    } | null> => {

      var params = new HttpParams()
        .set("projectId", (this.projectId) ? this.projectId.toString() : "0")
        .set("fieldName", fieldName)
        .set("fieldValue", control.value);

      var url = environment.baseUrl + 'api/Projects/IsDupeField';
      return this.http.post<boolean>(url, null, { params })
        .pipe(map(result => {

          return (result ? { isDupeField: true } : null);
        }));
    }
  }
}

