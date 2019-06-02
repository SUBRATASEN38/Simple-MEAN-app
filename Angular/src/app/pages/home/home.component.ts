import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public todoForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
  });
  public edit_id: string;
  public form_mode: string = 'add';
  public edit_index: number;
  public constructor(private fb: FormBuilder, private http: HttpClient) { }
  public todoData: any[] = [];
  base_url: string = 'http://localhost:3000/';
  ngOnInit() {
    this.http.get(this.base_url + '').subscribe(fetchedData => {
      if (fetchedData['response'].status === 200) {
        let result = fetchedData['response'].result;
        this.todoData = [...this.todoData, ...result];
      }
    });
  }

  FormSubmit() {
    if (this.todoForm.valid && this.todoData.length < 10) {
      let data = this.todoForm.value;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      };
      this.http.post(this.base_url + 'add-data', data, httpOptions).subscribe(addedData => {
        if (addedData['response'].status === 200) {
          let result = addedData['response'].result;
          this.todoData = [...this.todoData, ...result]
          this.todoForm.reset();
        }
      })
    }
  }


  editTodo(todo, index) {
    let patch_value = { ...todo };
    this.edit_id = todo._id; this.edit_index = index;
    this.form_mode = 'edit';
    delete patch_value["_id"];
    this.todoForm.patchValue({ ...patch_value });
  }

  updateTodo() {
    if (this.todoForm.valid) {
      let data = { ...this.todoForm.value, ...{ id: this.edit_id } };
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      };
      this.http.post(this.base_url + 'update-data', data, httpOptions).subscribe(updatedData => {
        if (updatedData['response'].status === 200) {
          this.todoData.splice(this.edit_index, 1);
          let result = updatedData['response'].result;
          this.todoData = [...this.todoData, ...result];
          this.form_mode = 'add';
          this.todoForm.reset();
        }
      })
    }
  }


  deleteTodo(id, index) {
    let data = { id: id };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    this.http.post(this.base_url + 'remove-data', data, httpOptions).subscribe(deletedData => {
      if (deletedData['response'].status === 200) {
        this.todoData.splice(index, 1);
        this.todoData = [...this.todoData];
      }
    })
  }
}
