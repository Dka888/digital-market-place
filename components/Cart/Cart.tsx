"use client";
import { ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";

export const Cart = () => {
    const itemCount = 0;
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
                <SheetTitle>Cart(0)</SheetTitle>
            </SheetHeader>
            {itemCount > 0 ? (
            <>
                <div className='flex w-full flex-col pr-6'>
                    {/* cart logic */}
                    cart item
                </div>
            </>)
            : <></>}
        </SheetContent>
    </Sheet>
    );
}