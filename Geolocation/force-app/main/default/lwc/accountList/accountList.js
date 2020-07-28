import { LightningElement, wire, track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import searchAccounts from '@salesforce/apex/AccountSearchController.searchAccounts';
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';

const columns = [
    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Website', fieldName: 'Website', type: 'url' },
    { label: 'City', fieldName: 'BillingCity', type: 'text' },
    { label: 'State', fieldName: 'BillingState', type: 'text' } 
];

const DELAY = 350;

export default class AccountList extends LightningElement {

    searchTerm = '';
    accounts = [];
    columns = columns;

    @wire(CurrentPageReference) 
    pageRef;

    @wire(searchAccounts, { searchTerm: '$searchTerm' })
    wiredAccounts({ error, data }){
        if (data){
            this.accounts = data;
        } 
        else if(error){
            console.log(error);
            this.accounts = null;
        }
    }

    connectedCallback(){
        registerListener('searchTermChange', this.handleSearchTermChange, this);
    }

    disconnectedCallback(){
        unregisterAllListeners(this);
    }

    handleSearchTermChange(searchTerm){
        this.searchTerm = searchTerm;
    }

    getSelectedRows(event) {
        const selectedRows = event.detail.selectedRows;
        window.clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(() => {
            fireEvent(this.pageRef, 'mapAccounts', selectedRows);
        }, DELAY);   
    }
}