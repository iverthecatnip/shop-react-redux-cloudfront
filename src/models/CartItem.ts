import { Product } from "~/models/Product";

export type CartItem = {
  product: Product;
  count: number;
};

export type Cart = {
  cart: {
    id: string,
    items: CartItem[],
  },
  total: number
}

export type CartResponse = {
  data : {
    cart : Cart;
    user? : string;
  }
}
