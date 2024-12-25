import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import * as html2pdf from 'html2pdf.js';
import { OrderService } from '../services/order.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [DatePipe, CommonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule, NgClass],
  providers: [DatePipe, OrderService],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.css'
})
export class OrderFormComponent implements OnInit {
  currentDate: string;
  userMessage: string = '';
  charactersCount: number = 0;

  orderId = Math.floor(100000 + Math.random() * 900000);

  invoiceCreated: boolean = false;
  invoiceDateCreation: string = '';

  constructor(private datePipe: DatePipe, private fb: FormBuilder, public orderService: OrderService, private router: Router, private snackBar: MatSnackBar){}

  orderForm = new FormGroup({
    name: new FormControl('', Validators.required),
    company: new FormControl(''),
    ico: new FormControl(''),
    dic: new FormControl(''),
    icDph: new FormControl(''),
    address: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    postalCode: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    note: new FormControl(''),
    deliveryOption: new FormControl('', Validators.required),
    paymentOption: new FormControl('', Validators.required),
    discountAmount: new FormControl(0),
    orderStatus: new FormControl('nezpracovane-nova-objednavka')
  });

  invoiceForm = new FormGroup({
    invoiceNumber: new FormControl(`${this.orderId}`, Validators.required),
    invoiceVariable: new FormControl(`${this.orderId}`, Validators.required),
    invoiceIssueDate: new FormControl('', Validators.required),
    invoiceDueDate: new FormControl('', Validators.required),
    invoiceDeliveryDate: new FormControl('', Validators.required),
    invoiceName: new FormControl('', Validators.required),
    invoiceCompany: new FormControl(''),
    invoiceICO: new FormControl(''),
    invoiceDIC: new FormControl(''),
    invoiceEmail: new FormControl('', Validators.required),
    invoicePhoneNumber: new FormControl('', Validators.required),
  })

  onCompanyChange(){
    const companyValue = this.orderForm.value.company;
    const icoControl = this.orderForm.get('ico');
    const dicControl = this.orderForm.get('dic');
    if(companyValue && companyValue.trim().length > 0){
      icoControl.setValidators([Validators.required]);
      dicControl.setValidators([Validators.required]);
    }else{
      console.log('No company was entered');
    }
  }

  update(){
    this.charactersCount = this.userMessage.length;
  }
  submitOrder(){
    if(this.orderForm.valid && this.invoiceCreated){
      let order: OrderDTO = {
        orderId: this.orderId,
        customerName: this.orderForm.value.name,
        company: this.orderForm.value.company,
        ico: this.orderForm.value.ico,
        dic: this.orderForm.value.dic,
        icDph: this.orderForm.value.icDph,
        address: this.orderForm.value.address,
        city: this.orderForm.value.city,
        postalCode: this.orderForm.value.postalCode,
        email: this.orderForm.value.email,
        phoneNumber: this.orderForm.value.phoneNumber,
        note: this.orderForm.value.note || '',
        deliveryOption: this.orderForm.value.deliveryOption,
        paymentOption: this.orderForm.value.paymentOption,
        discountAmount: this.orderForm.value.discountAmount,
        orderStatus: this.orderForm.value.orderStatus,
        orderDate: this.currentDate
      };
      this.orderService.createOrder(order).subscribe((response: OrderDTO) => {
        this.snackBar.open('Objednávka bola úspešne vytvorená!', '', {duration: 1000});
        if(response){
          this.orderId = response.orderId;
          if(!this.invoiceCreated){
            this.createInvoice();
          }
          this.router.navigate(['/orders-page']);
        }
      }, (error) => {
        console.error("An error occured while trying to create order", error)
      });
    }else if(this.orderForm.invalid){
      this.validateAllFormFields(this.orderForm);
      this.validateAllFormFields(this.invoiceForm);
      this.snackBar.open('Zadané údaje nie sú správne alebo polia označené hviezdičkou boli vynechané!', '', {duration: 2000});
    }
    else if(!this.invoiceCreated){
      this.snackBar.open('Nezabudnite na vytvorenie faktúry!', '', {duration: 1000});
    }
  }

  validateAllFormFields(formGroup: FormGroup){
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if(control?.invalid){
        control.markAsTouched(); 
      }
    })
  }

  createInvoice(){
    if(this.invoiceForm.valid){
      const invoiceHTML = `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 800px; margin: auto;">
    <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="margin: 0; color: #333;">Faktúra</h1>
        <p style="margin: 0; font-size: 14px; color: #666;">Číslo faktúry: ${this.invoiceForm.value.invoiceNumber}</p>
        <p style="margin: 0; font-size: 14px; color: #666;">Dátum vystavenia: ${this.invoiceForm.value.invoiceIssueDate}</p>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <div style="flex: 1; padding-right: 20px; border-right: 1px solid #ddd;">
            <h3 style="margin-bottom: 10px; color: #555;">Údaje objednávateľa</h3>
            <p><strong>Meno a priezvisko:</strong> ${this.orderForm.value.name}</p>
            <p><strong>Firma:</strong> ${this.orderForm.value.company}</p>
            <p><strong>IČO (v prípade firmy):</strong> ${this.orderForm.value.ico}</p>
            <p><strong>DIČ (v prípade firmy):</strong> ${this.orderForm.value.dic}</p>
            <p><strong>IČ DPH (v prípade firmy):</strong> ${this.orderForm.value.icDph}</p>
            <p><strong>Adresa:</strong> ${this.orderForm.value.address}</p>
            <p><strong>Mesto:</strong> ${this.orderForm.value.city}</p>
            <p><strong>PSČ:</strong> ${this.orderForm.value.postalCode}</p>
            <p><strong>E-mail:</strong> ${this.orderForm.value.email}</p>
            <p><strong>Telefónne číslo:</strong> ${this.orderForm.value.phoneNumber}</p>
        </div>
        <div style="flex: 1; padding-left: 20px;">
            <h3 style="margin-bottom: 10px; color: #555;">Fakturačné údaje</h3>
            <p><strong>Číslo faktúry:</strong> ${this.invoiceForm.value.invoiceNumber}</p>
            <p><strong>Variabilný symbol:</strong> ${this.invoiceForm.value.invoiceVariable}</p>
            <p><strong>Typ dokladu:</strong> Faktúra</p>
            <p><strong>Dátum splatnosti:</strong> ${this.invoiceForm.value.invoiceDueDate}</p>
            <p><strong>Dátum dodania:</strong> ${this.invoiceForm.value.invoiceDeliveryDate}</p>
            <p><strong>Meno a priezvisko:</strong> ${this.invoiceForm.value.invoiceName}</p>
            <p><strong>Firma:</strong> ${this.invoiceForm.value.invoiceCompany}</p>
            <p><strong>IČO (v prípade firmy):</strong> ${this.invoiceForm.value.invoiceICO}</p>
            <p><strong>DIČ (v prípade firmy):</strong> ${this.invoiceForm.value.invoiceDIC}</p>
            <p><strong>E-mail:</strong> ${this.invoiceForm.value.invoiceEmail}</p>
            <p><strong>Telefónne číslo:</strong> ${this.invoiceForm.value.invoicePhoneNumber}</p>
        </div>
    </div>
    <div style="margin-bottom: 20px;">
        <h3 style="margin-bottom: 10px; color: #555;">Položky na faktúre</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <thead>
                <tr style="background-color: #f8f8f8; border-bottom: 2px solid #ddd;">
                    <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Položka</th>
                    <th style="text-align: center; padding: 8px; border: 1px solid #ddd;">Množstvo</th>
                    <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">Cena za kus</th>
                    <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">Celkom</th>
                </tr>
            </thead>
            <tbody>
                <!-- Repeat for each item -->
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">{{ polozkaNazov }}</td>
                    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">{{ polozkaMnozstvo }}</td>
                    <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">{{ polozkaCena }}</td>
                    <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">{{ polozkaCelkom }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div style="margin-bottom: 20px;">
        <p><strong>Dátum objednávky:</strong> ${this.currentDate}</p>
        <p><strong>Spôsob doručenia:</strong> ${this.orderForm.value.deliveryOption}</p>
        <p><strong>Spôsob platby:</strong> ${this.orderForm.value.paymentOption}</p>
    </div>
    <div style="text-align: right; margin-bottom: 20px;">
        <p><strong>Medzisúčet:</strong> 0€</p>
        <p><strong>Zľava (-${this.orderForm.value.discountAmount}%):</strong></p>
        <h2 style="margin: 0; color: #333;">Celková suma: 0€</h2>
    </div>
    <div style="border-top: 1px solid #ddd; padding-top: 10px; color: #666; font-size: 12px;">
        <p><strong>Poznámka: ${this.orderForm.value.note}</strong></p>
    </div>
</div>`

      const options = {
        margin: 5,
        filename: `Faktúra_č${this.orderId}.pdf`,
        html2canvas: { scale: 2 }
      };

      if(invoiceHTML){
        html2pdf().set(options).from(invoiceHTML).save();
        this.invoiceCreated = true;
      }
    }else{
      this.validateAllFormFields(this.invoiceForm);
      this.snackBar.open('Zadané údaje nie sú správne alebo polia označené hviezdičkou boli vynechané!', '', {duration: 2000});
    }
  }

  ngOnInit(): void {
    const now = new Date();
    this.currentDate = this.datePipe.transform(now, 'dd.MM.yyyy HH:mm:ss');
  }
}
export interface OrderDTO {
  orderId: number;
  customerName: string;
  company: string;
  ico: string;
  dic: string;
  icDph: string;
  address: string;
  city: string;
  postalCode: string;
  email: string;
  phoneNumber: string;
  note: string;
  deliveryOption: string;
  paymentOption: string;
  discountAmount: number;
  orderStatus: string;
  orderDate?: string;
}
