import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  apiUrl: string =
    'http://localhost:3001/';
  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'users');

  }

  getAllCategory(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'categories');
  }

  getAllTaskForUser(userId: number, categoryId: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'todos?userId=' + userId + '&categoryId' + categoryId);
  }
  updateTask(task: any): Observable<any> {
    return this.http.put<any>(this.apiUrl + 'todos/' + task.id, task);
  }
  deleteTask(id: number): Observable<any> {
    return this.http.delete<any>(this.apiUrl + 'todos/' + id);
  }

  getAllTask(): Promise<any> {
    return firstValueFrom(this.http.get<any>(this.apiUrl + 'todos'));
  }

  async createNewTask(task: any) {
    const tasks = await this.getAllTask();
    task.id = (tasks.length === 0) ? 1 : Math.max(...tasks.map((task: any) => task.id)) + 1

    return await firstValueFrom(this.http.post(this.apiUrl + 'todos', task))

  }

  addNewUser(user : any , userID :number){
    user.id =userID
    return this.http.post<any>(this.apiUrl + 'users', user);
  
  }
  addNewCategory(category : any , categoryId :number){
    category.id = categoryId;
    return this.http.post<any>(this.apiUrl + 'categories', category);
  
  }

}
