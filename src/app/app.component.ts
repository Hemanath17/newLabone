import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Item } from 'src/model/item';
import {cloneDeep} from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'bs-poc';
  itemControl = new FormControl();
  options: Item[] = [
    { code: '101', description: 'Apple', unit: 'Kg', qty: 1, mrp: 100, disc: 5,dis_rate:0 , price: 0, tax: 10, tax_rate: 0 , amount: 0 },
    { code: '102', description: 'Mango', unit: 'Kg', qty: 3, mrp: 60, disc: 5,dis_rate:0 , price: 0, tax: 2.25, tax_rate: 0, amount: 0 },
    { code: '103', description: 'Banana', unit: 'Kg', qty: 2, mrp: 50, disc: 2,dis_rate:0 , price: 0, tax: 0.9, tax_rate: 0, amount: 0 },
    { code: '104', description: 'Apricot', unit: 'Kg', qty: 10, mrp: 20, disc:3,dis_rate:0, price: 0, tax: 0.1, tax_rate: 0, amount: 0 },
    { code: '105', description: 'Pineapple', unit: 'Kg', qty: 2, mrp: 80, disc: 1,dis_rate:0 , price: 0, tax: 0.45, tax_rate: 0, amount: 0 },
    { code: '106', description: 'Muskmelon', unit: 'Kg', qty: 5, mrp: 30, disc: 1.5,dis_rate:0 , price: 0, tax: 0.675, tax_rate: 0, amount: 0 },
    { code: '107', description: 'Chikku', unit: 'Kg', qty: 8, mrp: 40, disc: 3,dis_rate:0, price: 0, tax: 1.35, tax_rate: 0, amount: 0 },
    { code: '108', description: 'Avacardo', unit: 'Kg', qty: 3, mrp: 340, disc: 4,dis_rate:0 , price: 0, tax: 1.8, tax_rate: 0, amount: 0},
    { code: '109', description: 'Pome', unit: 'Kg', qty: 5, mrp: 230, disc: 2.5,dis_rate:0 , price: 0, tax: 1.125, tax_rate: 0, amount: 0},
    { code: '110', description: 'Beans', unit: 'Kg', qty: 2, mrp: 50, disc: 5,dis_rate:0 , price: 0, tax: 2.25, tax_rate: 0, amount: 0 }
  ];

  filteredOptions: Observable<Item[]>;
  emptyItem: Item = { code:'' , description: '', unit: '', qty: 0, mrp: 0, disc: 0,dis_rate:0 , price: 0, tax: 0, tax_rate: 0 , amount: 0 };
  selectedItem: Item ;
  addedItems: Item[] = [];
  constructor() {
    this.filteredOptions = this.itemControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
    this.selectedItem = cloneDeep(this.emptyItem);
  }

  private _filter(value: string | Item): Item[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.description.toLowerCase();
    return this.options.filter((option) => option.description.toLowerCase().includes(filterValue) || option.code.includes(filterValue));
  }

  displayFn(item: Item): string {
    return item ? item.description : '';
  }

  onOptionSelected(event: any): void {
    this.selectedItem = cloneDeep(event.option.value);
    // Do something with the selectedItemId
    console.log('Selected Item:', this.selectedItem);
  }

  onQtyEnter(event: any): void {
    const enteredQty = event.target.value;
    if (enteredQty) {
      const qty = parseFloat(enteredQty);
      if (!isNaN(qty) && this.selectedItem) {
        this.selectedItem!.qty = qty;
        this.selectedItem.dis_rate = ((this.selectedItem.qty * this.selectedItem.mrp)/100) * this.selectedItem.disc;
        this.selectedItem.price = (this.selectedItem.qty * this.selectedItem.mrp) - this.selectedItem.dis_rate;
        this.selectedItem.tax_rate = (this.selectedItem.price * this.selectedItem.tax)/100;
        this.selectedItem.amount = this.selectedItem.tax_rate + this.selectedItem.price;
        this.addedItems.push(this.selectedItem);
        this.selectedItem = cloneDeep(this.emptyItem);
        this.itemControl.setValue('');
      }
    }
  }


  calculateTotalAmount(): number {
    return this.addedItems.reduce((total, addedItem) => total + addedItem.amount, 0);
  }

  calculateAmount(price: number, taxRate: number): number {
    
    const amount = price;
    return amount;
  }

  removeItem(index: number): void {
    this.addedItems.splice(index, 1);
  }

  footermrp(): number{
    return this.addedItems.reduce((totalMRP, addedItem) => totalMRP + addedItem.mrp, 0);

  }

  footerprice(): number{
    return this.addedItems.reduce((totalPrice, addedItem) => totalPrice + addedItem.price, 0);

  }

  footertax(): number{
    return this.addedItems.reduce((totaltax_rate, addedItem) => totaltax_rate + addedItem.tax_rate, 0);

  }

  footerdiscount(): number{
    return this.addedItems.reduce((totaldis_rate, addedItem) => totaldis_rate + addedItem.dis_rate, 0);

  }

  getTotalItemCount(): number {
    return this.addedItems.length;
  }



}
