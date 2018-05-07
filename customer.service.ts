/** 
 *@author Ziwen Zhao
 *@description Customer Service
 */
import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { TokenService } from "../../../../services/token.service";
import { Platform } from "ionic-angular";
import { UrlConfig } from '../../../../shared/url-constants'
@Injectable()
export class CustomerService{
    
    constructor(
        private http:Http,
        private platform: Platform,
        private tokenService:TokenService,
        private urlConfig: UrlConfig ){
        }

    /**
     * @returns {Headers} HttpHeaders.
     */
    getHeaders(){
        return new Headers({
            Authorization: this.tokenService.token_type + ' ' + this.tokenService.access_token
        })
    }

    /**
     * @returns {Observable<Response>} HttpResponse
     */
    getAllCustomers(){
        return this.http.get(this.urlConfig.CUSTOMER_URL,{headers:this.getHeaders()});
    }

    /**
     * @param {string} id
     * @returns {Observable<Response>} HttpResponse
     */
    getCustomerById(id){
        return this.http.get(this.urlConfig.CUSTOMER_URL+'/'+id,{headers: this.getHeaders()});
    }
    
    /**
     * @param {any} customer Customer Object
     * @returns {Observable<Response>} HttpResponse
     */
    createCustomer(customer){
        return this.http.post(this.urlConfig.CUSTOMER_URL,customer,{headers:this.getHeaders()});
    }

    /**
     * @param {any} customer Customer Object
     * @returns {Observable<Response>} HttpResponse
     */
    updateCustomer(customer){
        return this.http.put(this.urlConfig.CUSTOMER_URL,customer,{headers: this.getHeaders()});
    }

    /**
     * @param {string} id 
     * @returns {Observable<Response>} HttpResponse
     */
    deleteCustomer(id){
        return this.http.delete(this.urlConfig.CUSTOMER_URL+'/'+id,{headers: this.getHeaders()});
    }

    
}