import { LightningElement, track, wire } from 'lwc';

import getAccount from '@salesforce/apex/AccountRecords.getAccounts';
import getContact from '@salesforce/apex/ContactRecords.getContact';
import deleteContacts from '@salesforce/apex/ContactDeletion.deleteContacts';
import contactAPI from '@salesforce/schema/Contact';
import conFirstName from '@salesforce/schema/Contact.FirstName';
import conLastName from '@salesforce/schema/Contact.LastName';
import conEmail from '@salesforce/schema/Contact.Email'
import conAccountId from '@salesforce/schema/Contact.AccountId'



const columns = [
    { label: 'Name', fieldName: 'Name' }
]
const conColumns=[
    {label:'First Name',fieldName:'FirstName'},
    {label:'LastName Name',fieldName:'LastName'},
    {label:'Email',fieldName:'Email'},
    {label:'Account',fieldName:'AccountId'},
]
export default class AccountDetails extends LightningElement {
    data;
    error;
    columns = columns;
    contacts;
    accId="";
    conColumns=conColumns;
    contactFields=[conFirstName,conLastName,conEmail,conAccountId];
    contactObject=contactAPI;
    isModal=false;
    @wire(getAccount) wiredAccounts({ error, data }) {
        if (data) {
            this.data = data;
            this.error = undefined;
            this.name=data[0].Name;
            console.log(this.name);
            this.accId=data[0].Id;
            this.setContacts(this.accId);
        }
        else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }
   
    setContacts(accId){
        getContact({accId}).then(result=>{
            this.contacts=result;
            console.log(this.contacts);
        }).catch(err=>{
            console.log(err);
        })
    }
    
    handleClick(e){
        console.log(e);
        this.accId=e.target.value;
        console.log(this.accId);
        this.setContacts(this.accId);
    }
    handleSelection(e){
        let table=this.template.querySelector(".account-tb");
        console.log(table.selectedRows);
        this.accId=table.selectedRows[0];
        this.setContacts(this.accId);
    }
    openModal(){
        this.isModal=true;
    }
    closeModal(){
        this.isModal=false;
    }

    handleContactDelete(){
       let delContacts=this.template.querySelector(".con-data-table");
       console.log(delContacts.selectedRows);
       let idList=delContacts.selectedRows;
       console.log(idList);
       deleteContacts({idList});
       this.setContacts(this.accId);
    };
}
