export class BillItem {
  id?: string;
  
  billId: string = "";
  menuItemId: string = "";
  quantity: number = 1;
  groupId: number = 1;
  splitFraction: number = 1;
  discountIdList: string[] = [];
  paymentId: string = "";
}
