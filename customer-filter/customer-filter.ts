import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { CustomerService } from '../customer-service/customer.service';
import { TokenService } from '../../../../services/token.service';
import * as _ from 'lodash';
/**
 * Generated class for the CustomerFilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-customer-filter',
  templateUrl: 'customer-filter.html',
})
export class CustomerFilterPage {
  private customerCodeOptions = [];
  private customerNameOptions = [];
  private customerStatusOptions = [];
  private customerTypeOptions = [];
  private customerIndustryOptions = [];
  private customerOwnerNameOptions = [];

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
              private customerService: CustomerService,
              private tokenService: TokenService,
              private viewCtrl: ViewController
              ) {
  }

  ionViewWillEnter(){
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
    this.customerService.getAllCustomers().subscribe(res => {
      const customers = res.json().data;
      this.customerCodeOptions = _.sortBy(_.uniq(customers.map(customer => customer.code)));
      this.customerNameOptions = _.sortBy(_.uniq(customers.map(customer => customer.name)));
      this.customerStatusOptions = _.sortBy(_.uniq(customers.map(customer => customer.statusname)));
      this.customerTypeOptions = _.sortBy(_.uniq(customers.map(customer => customer.typename)));
      this.customerIndustryOptions = _.sortBy(_.uniq(customers.map(customer => customer.industryname)));
      this.customerOwnerNameOptions = _.sortBy(_.uniq(customers.map(customer => customer.ownername)));
      this.selectedCustomerCode = this.navParams.get('selectedCustomerCode');
      this.selectedCustomerName = this.navParams.get('selectedCustomerName');
      this.selectedCustomerStatus = this.navParams.get('selectedCustomerStatus');
      this.selectedCustomerType = this.navParams.get('selectedCustomerType');
      this.selectedCustomerIndustry = this.navParams.get('selectedCustomerIndustry');
      this.selectedStartTime = this.navParams.get('selectedStartTime');
      this.selectedEndTime = this.navParams.get('selectedEndTime');
    });
  }

  onRest(){
    this.selectedCustomerCode = [];
    this.selectedCustomerName = [];
    this.selectedCustomerStatus = [];
    this.selectedCustomerType = [];
    this.selectedCustomerIndustry = [];
    this.selectedStartTime = null;
    this.selectedEndTime = null;
    this.selectedOwnerName = [];
  }

  onCancel(){
    this.viewCtrl.dismiss({action:'cancel'})
  }

  onConfirm(){
    this.viewCtrl.dismiss({
      action:'filter',
      selectedCustomerCode: this.selectedCustomerCode,
      selectedCustomerName: this.selectedCustomerName,
      selectedCustomerStatus: this.selectedCustomerStatus,
      selectedCustomerType: this.selectedCustomerType,
      selectedCustomerIndustry: this.selectedCustomerIndustry,
      selectedStartTime: this.selectedStartTime,
      selectedEndTime: this.selectedEndTime,
      selectedOwnerName: this.selectedOwnerName
    })
  }


}
