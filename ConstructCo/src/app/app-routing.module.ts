import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

import { AssignmentsComponent } from './assignments/assignments.component';
import { AssignmentEditComponent } from './assignments/assignment-edit.component';
import { EmployeesComponent } from './employees/employees.component';
import { JobsComponent } from './jobs/jobs.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectEditComponent } from './projects/project-edit.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'assignments', component: AssignmentsComponent },
  { path: 'assignment/:assignmentId', component: AssignmentEditComponent },
  { path: 'assignment', component: AssignmentEditComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: 'jobs', component: JobsComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'project/:projectId', component: ProjectEditComponent },
  { path: 'project', component: ProjectEditComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
