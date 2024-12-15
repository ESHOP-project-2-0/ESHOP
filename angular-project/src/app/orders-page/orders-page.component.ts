import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { CommonModule } from '@angular/common';
import { OrderDTO } from '../order-form/order-form.component';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.css'
})
export class OrdersPageComponent implements OnInit{
  public ordersData: OrderDTO[] = [];

  constructor(private orderService: OrderService){}

  ngOnInit(): void {
    this.orderService.getOrders().subscribe((result) =>{
      console.log("Objednávky načítané:", result);
      this.ordersData = result;
    }, (error) =>{
      console.error("An error have occurred while trying to get data of orders", error);
    })
  }
}
