import axios, { AxiosError } from "axios";
import React from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import API_PATHS from "~/constants/apiPaths";
import { Cart, CartItem, CartResponse } from "~/models/CartItem";

export function useCart() {
  return useQuery<Cart, AxiosError>("cart", async () => {
    const res = await axios.get<CartResponse>(
      `${API_PATHS.cart}/profile/cart/${localStorage.getItem("user_id")}`
    );
    if (!localStorage.getItem("user_id") && res.data.data.user) {
      localStorage.setItem("user_id", res.data.data.user);
    }

    return res.data.data;
  });
}

export function useCartData() {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<CartItem[]>("cart");
}

export function useInvalidateCart() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("cart", { exact: true }),
    []
  );
}

export function useUpsertCart() {
  return useMutation((values: CartItem) =>
    axios.put<CartItem[]>(
      `${API_PATHS.cart}/profile/cart/${localStorage.getItem("user_id")}`,
      values
    )
  );
}
