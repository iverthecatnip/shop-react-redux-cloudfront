import Typography from "@mui/material/Typography";
import { Product } from "~/models/Product";
import CartIcon from "@mui/icons-material/ShoppingCart";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import { useCart, useInvalidateCart, useUpsertCart } from "~/queries/cart";
import { useAvailableProducts, useProductById } from "~/queries/products";
import { useState } from "react";

type AddProductToCartProps = {
  product: Product;
  showInStock?: boolean;
};

export default function AddProductToCart({ product, showInStock = false }: AddProductToCartProps) {
  const { data = [], isFetching } = useCart();
  const { mutate: upsertCart } = useUpsertCart();
  const invalidateCart = useInvalidateCart();
  const { data: products  } = useAvailableProducts();
  const [buttonsHidden, setButtonsHidden] = useState(false);
  let items = [];
  if (data.cart) {
    items = data.cart.items;
  }
  const cartItem = items.find((i) => i.product.id === product.id);
  const productItem = products?.find((i) => i.id === product.id)
  const addProduct = () => {
    setButtonsHidden(true);
    upsertCart(
      { product, count: cartItem ? cartItem.count + 1 : 1 },
      { onSuccess: () => {
          invalidateCart().then(
            () => {
              setButtonsHidden(false);
            }
          );
        } }
    );
  };

  const removeProduct = () => {
    setButtonsHidden(true);

    if (cartItem) {
      upsertCart(
        { ...cartItem, count: cartItem.count - 1 },
        { onSuccess: () => {
            invalidateCart().then(
              () => {
                setButtonsHidden(false);
              }
            );
          } }
      );
    }
  };

  return(
    <>
      {buttonsHidden &&
        <Typography>Loading...</Typography>
      }
      {cartItem && !buttonsHidden &&
        <>
          <IconButton disabled={isFetching} onClick={removeProduct} size="large">
            <Remove color={"secondary"} />
          </IconButton>
          <Typography align="center">{cartItem.count}</Typography>
          <IconButton disabled={isFetching || cartItem.count >= productItem?.count} onClick={addProduct} size="large">
            <Add color={"secondary"} />
          </IconButton>
        </>
      }
      {!cartItem && !buttonsHidden &&
        <>
          <IconButton disabled={isFetching} onClick={addProduct} size="large">
            <CartIcon color={"secondary"} />
          </IconButton>
        </>
      }
      {showInStock && <Typography align="right">In Stock: {productItem?.count}</Typography>}
    </>)

}
