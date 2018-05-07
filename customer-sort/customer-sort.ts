import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the CustomerSortPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-customer-sort',
  templateUrl: 'customer-sort.html',
})
export class CustomerSortPage {
  private sortOrder: String;
  constructor(
    private navCtrl: NavController, 
    private navParams: NavParams,
    private viewCtrl: ViewController) {
  }

  ionViewWillEnter(){
    this.sortOrder = this.navParams.get('sortOrder');
  }

  onChange(){
    this.viewCtrl.dismiss(this.sortOrder);
  }
}
