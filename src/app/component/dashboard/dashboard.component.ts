import { Component, inject, OnInit } from '@angular/core';
import { TaskService } from '../../service/task.service';


import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators}

 from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgFor],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  taskService = inject(TaskService);
  users: any[] = [];
  categories: any[] = [];
  selectedUserId!: number;
  selectedcategoryId!: number;
  inprogressTask: any[] = [];
  completedTask: any[] = [];

  selectedTask: any;
  updateTaskForm: FormGroup;
  NewAddTaskForm: FormGroup;
  NewAddUserForm: FormGroup;
  NewAddCategoryForm:FormGroup;


  constructor(private builder: FormBuilder) {
    this.updateTaskForm = builder.group({
      id: [''],
      title: ['', Validators.required],
      description: [''],
      completed: [''],
      dueDate: [''],
      userId: [''],
      categoryId: [''],
    });
  

    this.NewAddTaskForm = builder.group({
      id: [''],
      title: ['', Validators.required],
      description: [''],
      completed: [false],
      dueDate: [''],
      userId: [''],
      categoryId: [''],
    });

    this.NewAddUserForm = builder.group({
      id: [''],
      name: ['', Validators.required],
     
    });

    this.NewAddCategoryForm = builder.group({
      id: [''],
      name: ['', Validators.required],
     
    });
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.getAllCategory();
  }

  getAllUsers() {
    this.taskService.getAllUsers().subscribe((res: any) => {
      this.users = res;
    });
  }

  getAllCategory() {
    this.taskService.getAllCategory().subscribe((res: any) => {
      this.categories = res;
    });
  }

  getAllTask() {
    if (
      this.selectedcategoryId != undefined &&
      this.selectedUserId != undefined
    ) {
      this.taskService
        .getAllTaskForUser(this.selectedUserId, this.selectedcategoryId)
        .subscribe((res: any) => {
          this.filterResults(res);
        });
    } else {
      alert('Please Select User and category');
    }
  }
  filterResults(res: any) {
    this.completedTask = [];
    this.inprogressTask = [];

    res.forEach((task: any) => {
      if (task.completed) {
        this.completedTask.push(task);
      } else {
        this.inprogressTask.push(task);
      }
    });
  }

  selectTask(task: any) {
    this.selectedTask = task;
    this.updateTaskForm.setValue(this.selectedTask);
    console.log(this.updateTaskForm.value);
  }
  updateTask() {
    this.taskService
      .updateTask(this.updateTaskForm.value)
      .subscribe((res: any) => {
        this.getAllTask();
      });
  }

  deleteTask(task: any) {
    if (
      confirm('Are You sure You want to delete task : ' + task.title))
     {
       this.taskService.deleteTask(task.id).subscribe((res: any)=>{

      this.getAllTask();
    })
    }
  }
  addNewTask() {
   this.taskService.createNewTask(this.NewAddTaskForm.value).then((data: any)=>{
    this.selectedcategoryId=data.categoryId;
    this.selectedUserId=data.userId;
    this.getAllTask()
    
   })
  }
  addNewUser(){
    if(this.users.some(user => user.name===this.NewAddUserForm.value.name)){
      alert('User With the same Name Already exists');
      return;
    }
    const userID =(this.users.length === 0) ? 1 : Math.max(...this.users.map((user: any) => user.id)) + 1;
    
    this.taskService.addNewUser(this.NewAddUserForm.value,userID).subscribe((res: any)=>{
      this.ngOnInit()

    })

  }
  addNewCategory(){

  if(this.categories.some(category => category.name === this.NewAddCategoryForm.value.name)) 
    { alert('Category with same name already exists'); return; 
       } 
       const categoryId= (this.categories.length === 0) ? 1 : Math.max(...this.categories.map((category: any) => category.id))+1;
        this.taskService.addNewCategory(this.NewAddCategoryForm.value, categoryId).subscribe((res: any) => { this.ngOnInit();

         })
  }



}
