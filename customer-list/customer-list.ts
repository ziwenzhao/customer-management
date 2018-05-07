import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, PopoverController } from 'ionic-angular';
import { CustomerService } from '../customer-service/customer.service';
import { TokenService } from '../../../../services/token.service';
import { CustomerFilterPage } from '../customer-filter/customer-filter';
import * as _ from 'lodash';
import { CustomerFormPage } from '../customer-form/customer-form';
import { CustomerSortPage } from '../customer-sort/customer-sort';
/**
 * Generated class for the CustomerListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-customer-list',
  templateUrl: 'customer-list.html',
})
export class CustomerListPage {
  private customers = [];
  private filteredCustomers = [];
  private search = false;
  private sortOrder: String;
  private selectedCustomerCode = [];
  private selectedCustomerName = [];
  private selectedCustomerStatus = [];
  private selectedCustomerType = [];
  private selectedCustomerIndustry = [];
  private selectedStartTime = null;
  private selectedEndTime = null;
  private selectedOwnerName = [];
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private tokenService: TokenService,
              private customerService: CustomerService,
              private modalCtrl: ModalController,
              private popoverCtrl: PopoverController,
              private changeDetectorRef: ChangeDetectorRef
              ) {
  }

  ionViewWillEnter(){
    if(this.tokenService.access_token){
      this.initData();
    }else{
      this.tokenService.getToken().subscribe( res => {
        this.tokenService.access_token = res.json().access_token;
        this.tokenService.token_type = res.json().token_type;
        this.initData();
      })
    }
    
  }

  initData(){
    this.customerService.getAllCustomers().subscribe(res => {
      this.customers = res.json().data;
      console.log(this.customers);
      this.setFilteredCustomers();
    })
  }

  onToggleSearch(){
    this.search = !this.search;
    this.changeDetectorRef.detectChanges();
  }

  onCancelSearch(){
    this.search = false;
  }

  onSearchChange(event){
    this.setFilteredCustomers();
    this.filteredCustomers = this.filteredCustomers.filter(customer => customer.name.indexOf(event.target.value) != -1);
  }

  onSort(event){
    const popover = this.popoverCtrl.create(CustomerSortPage,{sortOrder: this.sortOrder});
    popover.present({
      ev: event,
    });
    popover.onDidDismiss(sortOrder => {
      if(sortOrder){
        this.sortOrder = sortOrder;
        switch (sortOrder) {
          case 'nameAscending':
            this.filteredCustomers = _.sortBy(this.filteredCustomers, 'name');
            break;
          case 'nameDescending':
            this.filteredCustomers = _.sortBy(this.filteredCustomers, 'name');
            _.reverse(this.filteredCustomers);
            break;
          case 'createtimeAscending':
            this.filteredCustomers = _.sortBy(this.filteredCustomers, 'createtime');
            break;
          case 'createtimeDescending':
            this.filteredCustomers = _.sortBy(this.filteredCustomers, 'createtime');
            _.reverse(this.filteredCustomers);
            break;
        }
      }
    })
  }

  onOpenFilter(){
    const modal = this.modalCtrl.create(CustomerFilterPage,{
      selectedCustomerCode: this.selectedCustomerCode,
      selectedCustomerName: this.selectedCustomerName,
      selectedCustomerStatus: this.selectedCustomerStatus,
      selectedCustomerType: this.selectedCustomerType,
      selectedCustomerIndustry: this.selectedCustomerIndustry,
      selectedStartTime: this.selectedStartTime,
      selectedEndTime: this.selectedEndTime,
      selectedOwnerName: this.selectedOwnerName
    });
    modal.present();
    modal.onDidDismiss(data => {
      if(data && data.action == 'filter'){
        this.selectedCustomerCode = data.selectedCustomerCode;
        this.selectedCustomerName = data.selectedCustomerName;
        this.selectedCustomerStatus = data.selectedCustomerStatus;
        this.selectedCustomerType = data.selectedCustomerType;
        this.selectedCustomerIndustry = data.selectedCustomerIndustry;
        this.selectedStartTime = data.selectedStartTime;
        this.selectedEndTime = data.selectedEndTime;
        this.selectedOwnerName = data.selectedOwnerName;
        this.setFilteredCustomers();
      }
    })
  }

  setFilteredCustomers(){
    this.filteredCustomers = this.customers.filter( customer => {
      return (_.isEmpty(this.selectedCustomerCode) || this.selectedCustomerCode.indexOf(customer.code || '无') != -1) &&
        (_.isEmpty(this.selectedCustomerName) || this.selectedCustomerName.indexOf(customer.name || '无') != -1) &&
        (_.isEmpty(this.selectedCustomerStatus) || this.selectedCustomerStatus.indexOf(customer.statusname || '无') != -1) &&
        (_.isEmpty(this.selectedCustomerType) || this.selectedCustomerType.indexOf(customer.typename ||  '无') != -1) &&
        (_.isEmpty(this.selectedCustomerIndustry) || this.selectedCustomerIndustry.indexOf(customer.industryname || '无') != -1) &&
        (!this.selectedStartTime || customer.createtime && new Date(customer.createtime) >= new Date(this.selectedStartTime)) &&
        (!this.selectedEndTime || customer.createtime && new Date(customer.createtime) <= new Date(this.selectedEndTime)) &&
        (_.isEmpty(this.selectedOwnerName) || this.selectedOwnerName.indexOf(customer.ownername || '无') != -1);
    })
  }

  onCreate(){
    const modal = this.modalCtrl.create(CustomerFormPage,{mode:'create'});
    modal.present();
    modal.onDidDismiss( data => {
      if(data && data.action == 'create') this.initData();
    })
  }

  onEdit(customer){
    const modal = this.modalCtrl.create(CustomerFormPage,{mode:'edit',customer});
    modal.present();
    modal.onDidDismiss( data => {
      if(data && (data.action == 'update' || data.action == 'delete')){
        this.initData();
      }
    })
  }



}
