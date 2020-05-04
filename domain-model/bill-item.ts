export class BillItem {
  id?: string;
  
  discountIdList: string[] = [];
  billId: string = "";
  menuItemId: string = "";
  quantity: number = 1;
  groupId: number = 1;
  paymentId: string = "";
}
