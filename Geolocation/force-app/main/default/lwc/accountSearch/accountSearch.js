import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';

const DELAY = 350;

export default class AccountSearch extends LightningElement {

    searchTerm = '';
    delayTimeout;

    @wire(CurrentPageReference) 
    pageRef;

    handleSearchTermChange(event) {
        this.searchTerm = event.detail.value;
        this.fireChangeEvent();
    }

    fireChangeEvent() {
        window.clearTimeout(this.delayTimeout);
        const searchTerm = this.searchTerm;
        console.log(this.searchTerm);
        this.delayTimeout = setTimeout(() => {
            fireEvent(this.pageRef, 'searchTermChange', searchTerm);
        }, DELAY);
    }
}