import { EmployeeService } from './../../../../services/employee.service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TokenService } from '../../../../services/token.service';
import { CustomerService } from '../customer-service/customer.service';
import { DataDictionaryService } from '../customer-service/data-dictionary.service';

/**
 * Generated class for the CustomerFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-customer-form',
  templateUrl: 'customer-form.html',
})
export class CustomerFormPage {
  private customerCreateForm: FormGroup = this.fb.group({
    code: { value: '', disabled: true },
    name: ['', Validators.required],
    status: ['', Validators.required],
    type: ['', Validators.required],
    industry: ['', Validators.required],
    address: '',
    comments: '',
    createtime: null,
    owner: null
  });
  private employees = [];
  private customerStatus = [];
  private customerTypes = [];
  private customerIndustries = [];
  private customer = null;
  private mode: String;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private tokenService: TokenService,
    private customerService: CustomerService,
    private employeeService: EmployeeService,
    private dataDictionaryService: DataDictionaryService,
    private fb: FormBuilder,
    private viewCtrl: ViewController,
    private changeDectorRef: ChangeDetectorRef
  ) {
  }
  
  ionViewWillEnter(){
    this.mode = this.navParams.get('mode');
    this.customer = this.navParams.get('customer');
    if(this.mode == 'edit'){
      this.customerCreateForm.setValue({
        code: this.customer.code,
        name: this.customer.name,
        status: this.customer.status,
        type: this.customer.type,
        industry: this.customer.industry,
        address: this.customer.address,
        comments: this.customer.comments,
        createtime: this.customer.createtime? this.customer.createtime.replace(' ', 'T').split('.')[0]: null,
        owner: this.customer.owner
      })
    }
    if (this.tokenService.access_token) {
      this.initData();
    } else {
      this.tokenService.getToken().subscribe(res => {
        this.tokenService.access_token = res.json().access_token;
        this.tokenService.token_type = res.json().token_type;
        this.initData();
      })
    }
  }

  initData(){
    this.employeeService.getAllEmployees().subscribe(res =>{
      this.employees = res.json().data;
    })
    this.dataDictionaryService.getCustomerStatus().subscribe(res => {
      this.customerStatus = res.json().data
    })
    this.dataDictionaryService.getCustomerType().subscribe(res => {
      this.customerTypes = res.json().data;
    })
    this.dataDictionaryService.getCustomerIndustry().subscribe(res => {
      this.customerIndustries = res.json().data
    })
  }

  onCreate(){
    if(this.tokenService.access_token){
      const customer = this.customerCreateForm.value;
      if(customer.createtime) customer.createtime = customer.createtime.replace('T', ' ').replace('Z','');
      this.customerService.createCustomer(customer).subscribe( res => {
        this.viewCtrl.dismiss({action:'create'});
      })
    }else{
      this.tokenService.getToken().subscribe( res => {
        this.tokenService.access_token = res.json().access_token;
        this.tokenService.token_type = res.json().token_type;
        const customer = this.customerCreateForm.value;
        if (customer.createtime) customer.createtime = customer.createtime.replace('T', ' ').replace('Z', '');
        this.customerService.createCustomer(customer).subscribe(res => {
          this.viewCtrl.dismiss({ action: 'create' });
        })
      })
    }
  }

  onUpdate(){
    if(this.tokenService.access_token){
      const customer = { id: this.customer.id, ...this.customerCreateForm.value };
      if(customer.createtime) customer.createtime = customer.createtime.replace('T',' ').replace('Z', '');
      this.customerService.updateCustomer(customer).subscribe( res => {
        this.viewCtrl.dismiss({action:'update'});
      })
    }else{
      this.tokenService.getToken().subscribe( res => {
        this.tokenService.access_token = res.json().access_token;
        this.tokenService.token_type = res.json().token_type;
        const customer = { id: this.customer.id, ...this.customerCreateForm.value };
        if(customer.createtime) customer.createtime = customer.createtime.replace('T', ' ').replace('Z', '');
        this.customerService.updateCustomer(customer).subscribe(res => {
          this.viewCtrl.dismiss({ action: 'update' });
        })
      })
    }
  }

  onDelete(){
    if(this.tokenService.access_token){
      this.customerService.deleteCustomer(this.customer.id).subscribe( res => {
        this.viewCtrl.dismiss({action:'delete'});
      })
    }else{
      this.tokenService.getToken().subscribe( res => {
        this.tokenService.access_token = res.json().access_token;
        this.tokenService.token_type = res.json().token_type;
        this.customerService.deleteCustomer(this.customer.id).subscribe(res => {
          this.viewCtrl.dismiss({ action: 'delete' });
        })
      })
    }
  }

  onCancel(){
    this.viewCtrl.dismiss({action:'cancel'});
  }

}
