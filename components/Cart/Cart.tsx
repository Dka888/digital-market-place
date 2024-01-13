"use client";
import { ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Separator } from "@radix-ui/react-separator";
import { formatPrice } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import Image from "next/image"
import { useCart } from "../hooks/use-cart";
import { CartItem } from "./CartItem";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export const Cart = () => {
    const { items } = useCart();
    const itemCount = items.length;

    const cartTotal = items.reduce((acc, curr) => acc + curr.product.price, 0);
    const fee = 1;

    return (
    <Sheet>
        <SheetTrigger className="group -m-2 flex items-center p-2">
            <ShoppingCart 
                aria-hidden='true' 
                className="h-6 w-6 flex-shrink-0 text-grey-400 group-hover:text-grey-500" 
            />
            <span className="ml-2 text-sm font-medium text-grey-700 group-hover:text-grey-800">
                {itemCount}
            </span>
        </SheetTrigger>
        <SheetContent className='flex w-full flex-col pr-0 sm:max-w-lg'>
            <SheetHeader className="space-y-2.5 pr-6">
                <SheetTitle>Cart({itemCount})</SheetTitle>
            </SheetHeader>
            {itemCount > 0 ? (
            <>
                <div className='flex w-full flex-col pr-6'>
                    <ScrollArea>
                    {items.map(({product}) => (
                        <CartItem 
                            key={product.id} 
                            product={product}
                        />
                    ))}
                    </ScrollArea>
                </div>
                <div className="space-y-4 pr-6">
                    <Separator />
                    <div className="space-y-1.5 text-sm">
                        <div className="flex ">
                            <span className="flex-1"> Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="flex ">
                            <span className="flex-1"> Transaction Fee</span>
                            <span>{formatPrice(fee, {currency: "PLN"})}</span>
                        </div>
                        <div className="flex ">
                            <span className="flex-1"> Total</span>
                            <span>{formatPrice(fee + cartTotal)}</span>
                        </div>
                    </div>
                    <SheetFooter>
                        <SheetTrigger asChild>
                            <Link href='/cart' className={buttonVariants({
                                className: 'w-full',
                            })}>
                                Continue to Checkout
                            </Link>
                        </SheetTrigger>
                    </SheetFooter>
                </div>
            </>)
            : <div className="flex h-full flex-col items-center justify-center space-y-1">
                <div aria-hidden='true' className="relative mb-4 h-60 w-60 text-muted-foreground">
                    <Image src='/hippo-empty-cart.png' fill alt="empty cart"/>
                </div>
                <div className='text-xl font-bold'> Your cart is empty</div>
                <SheetTrigger asChild>
                    <Link href='/products' className={buttonVariants({
                        variant: 'link',
                        size: "sm",
                        className: "text-sm text-muted-foreground"
                    })}>  
                    Add items to your cart to checkout
                    </Link>
                </SheetTrigger>
                </div>}
        </SheetContent>
    </Sheet>
    );
}