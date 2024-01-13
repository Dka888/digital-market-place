"use client"

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useCart } from "../hooks/use-cart";
import { Product } from "@/payload/payload-types";

export const AddCartButton = ({ product }: {product: Product}) => {
    const [isSuccess, setIsSuccess] = useState(false);
    const {addItem} = useCart()

    useEffect(() => {
        const timer = setTimeout(() => setIsSuccess(false), 3000);

        return clearTimeout(timer);
    }, [isSuccess]);

    const handleAddProductToCart = () => {
        addItem(product);
        setIsSuccess(true)
    }

    return <Button
         size='lg' 
         className='w-full'
         onClick={handleAddProductToCart}
         >{isSuccess ? 'Added!' : 'Add to cart'}
         </Button>
}