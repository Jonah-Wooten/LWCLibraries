import {LightningElement} from 'lwc';
import myJPEG_icon from '@salesforce/resourceUrl/nexientJPEG';

export default class Varient extends LightningElement {
    nexientJpeg=myJPEG_icon;

    clickedButtonLabel;

    handleClick(event) {
        this.clickedButtonLabel=event.target.label;
    }

}