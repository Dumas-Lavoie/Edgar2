
import { App } from "./App2";


var path = window.location.pathname;
var page = path.split("/").pop();
console.log( page );

let createApp = (opt) => {
    let test = new App();
 }

export class otherApp { 
    
    constructor (option) {
        
           
        this.app = createApp(option);
    }
 }