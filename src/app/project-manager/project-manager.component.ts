import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import {  ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-project-manager',
  standalone: true,
  imports: [CommonModule,NgSelectModule,FormsModule,ReactiveFormsModule,HttpClientModule],
  templateUrl: './project-manager.component.html',
  styleUrl: './project-manager.component.scss'
})
export class ProjectManagerComponent {

  // @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent | any;
  
  myForm: FormGroup;
  platformVal:any = ""

  platform = [
    { id: 1, name: 'iOS' },
    { id: 2, name: 'Android' },
    { id: 3, name: 'Angular' },
    { id: 4, name: 'React' },

];

  constructor(private fb: FormBuilder,private http: HttpClient, private modalService: NgbModal) {
    this.myForm = this.fb.group({
      projectName: null,
      platform: null,
      link: null,
      created_on: null,
      username: null,
      password:null
    });
  }
  ngOnInit(): void {
    this.getData()
  }

  paging:any = 10
  pageNum(event:any){
    this.paging = event
    // this.currentPage = page
    this.getData()
  }

  
  getNameData:any
  getNameDataNumber:any
  numArr: any = []
  currentPage = 1
  searchName:any = ''
  getData() {
    const self = this
    this.http.get(`${environment.host}/project-manager/getProject?page=${this.currentPage}&pageNo=${this.paging}&name=${this.searchName}&platform=${this.platformVal}`).subscribe({
      next(data: any){
        
        self.getNameData = data.rows
        self.getNameDataNumber = Math.ceil(data.count/self.paging)
        
      },
      error(err) {
          console.log(err);
          
      },
    }
    )    
  }

  
  totalPages: any
  onPageChange(page: number){
    this.currentPage = page
    this.getData()
  }

  cancel(){
    this.myForm.reset()
    this.getID = false
  }

  getID: boolean = false
  editData: any

  edit(content:any, data: any) {
    
    this.modalService.open(content, { scrollable: true, size: 'l'  },);
    
    this.getID = true
    this.editData = data
    console.log( this.editData,"ass");

    this.myForm.patchValue({
    ...data,
    created_on : data.created_on
    })

  }

  del(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${environment.host}/project-manager/deleteProject/${data.id}`).subscribe({
        next:(data)=>{
          console.log(data);
          this.getData()
        }
      })
        Swal.fire({
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1000
        }
        )
      }
    })
   
  }

  onSubmit() {
    console.log(this.myForm.value);
    try {

      if (this.getID) {

        this.http.put(`${environment.host}/project-manager/updateProject/${this.editData.id}`, this.myForm.value).subscribe(data => {
          console.log(data);
          this.getData()
          Swal.fire({
            icon: 'success',
            title: 'Data Updated',
            showConfirmButton: false,
            timer: 1000
          })
  
        })
        
      }else{

        this.http.post(`${environment.host}/project-manager/addProject`, this.myForm.value).subscribe(data => {
          console.log(data);
          this.getData()
          Swal.fire({
            icon: 'success',
            title: 'Data Added',
            showConfirmButton: false,
            timer: 1000
          })
  
        })
      }

      this.modalService.dismissAll()
      this.getID = false
      this.myForm.reset()

    } catch (error) {
      console.log(error)
    }
  }
  getNameVal(event:any){

    this.searchName = event.target.value
    this.getData()
  }

  
 
  getPlatformVal(event:any){
    this.platformVal = event.target.value
    // this.searchName = event.target.value
    this.getData()
  }

  openModal(content:any) {
    this.modalService.open(content, { scrollable: true, size: 'l'  },);
}

}
