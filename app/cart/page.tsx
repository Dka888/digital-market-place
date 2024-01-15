"use client";

import { useCart } from "@/components/hooks/use-cart"
import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES } from "@/config";
import { cn, formatPrice } from "@/lib/utils"
import { trpc } from "@/trpc/client";
import { Check, Loader2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {

    const router = useRouter();
    const {items, removeItem} = useCart();
    const cartTotal = items.reduce((acc, curr) => acc + curr.product.price, 0);
    const [isMounted, setIsMounted] = useState(false);
    const fee = 1;
    const { mutate: createCheckoutSession, isLoading } = trpc.payment.createSession.useMutation({
        onSuccess: ({url}) => {
            if(url) {
                router.push(url)
            }
        }
    });

    const productIds = items.map(({ product }) => product.id)

    useEffect(() => {
        setIsMounted(true)
    }, []);

    return <div>
        <div className='mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8'>
            <h1 className='text-3xl font-bold tracking-tight text-grey-900 sm:text-4xl'>Shopping Cart</h1>

            <div className='mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16'>
                <div className={cn("lg:col-span-7", {
                    "rounded-lg border-2 border-dashed border-zinc-200 p-12": isMounted && items.length === 0
                })}>

                <h2 className='sr-only'>Items in your shopping cart</h2>

                {isMounted && items.length === 0 && (
                    <div className='flex h-full flex-col items-center justify-center space-y-1'>
                        <div aria-hidden='true' className='relative mb-4 h-40 w-40 text-muted-foreground'>
                            <Image src='/hippo-empty-cart.png' fill loading="eager" alt='empty cart' />
                        </div>
                        <h3 className='font-semibold text-2xl'>Your Cart is empty</h3>
                        <p className='text-center text-muted-foreground'>
                            Whoops! Nothing to show here yet!
                        </p>
                    </div>)}

                    <ul className={cn({
                        "divide-y divide-grey-200 border-b border-t border-grey-200" : isMounted && items.length > 0
                    })}>
                        {items.map(({ product }) => {
                            const { category, images, id, price } = product;
                            const label = PRODUCT_CATEGORIES.find((c) => c.value === category)?.label;
                            const {image} = images[0];

                            return (
                                <li key={id} className='flex py-6 sm:py-10'>
                                    <div className='relative h-24 w-24'>
                                        {typeof image !== 'string' && image.url
                                            ? <Image 
                                                fill 
                                                src={image?.url} 
                                                alt='product image' 
                                                className='h-full w-full rounded-md object-cover object-center sm: h-48 sm:w-48'
                                            />
                                            : null
                                        }
                                    </div>

                                    <div className='ml-4 flex flex-1 flex-col justify-between sm:ml-6'>
                                        <div className="relative pr-9 sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                            <div>
                                                <div className='flex justify-between'>
                                                    <h3 className='text-sm'>
                                                        <Link href={`/product/${product.id}`} className='font-medium text-grey-700 hover:text-grey-800' >                                                            {product.name}
                                                        </Link>
                                                    </h3>
                                                </div>
                                            
                                                <div className='mt-1 flex text-sm'>
                                                    <p className='text-muted-foreground'>
                                                        Category: {label}
                                                    </p>
                                                </div>

                                                <p className='text-sm mt-1 font-medium text-grey-800'>{formatPrice(price)}</p>
                                            </div>

                                            <div className='mt-4 sm:mt-0 sm:pr-9 w-20'>
                                                <div className="absolute right-0 top-0">
                                                    <Button 
                                                        aria-label="remove product"
                                                        onClick={() => removeItem(id)} 
                                                        variant='ghost'   
                                                    >
                                                        <X className='h-5 w-5' aria-hidden="true"/>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <p className='mt-4 flex space-x-2 text-sm text-grey-7000'>
                                            <Check className='h-5 w-5 flex-shrink-0 text-green-500' />
                                            <span className="">
                                                Eligible for instant delivery
                                            </span>
                                        </p>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                <section className='mt-16 rounded-lg bg-grey-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8'>
                    <h2 className='text-lg font-medium text-grey-900'>Order summary</h2>

                    <div className="mt-6 space-y-4">
                        <div className='flex items-center justify-between'>
                            <p className='text-sm text-gre-600'>Subtitle</p>
                            <p className='text-sm text-gre-900 font-medium'>
                                {isMounted 
                                    ? formatPrice(cartTotal) 
                                    : <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
                                }
                            </p>
                        </div>

                        <div className='flex items-center justify-between border-t border-grey-200 pt-4'>
                            <div className='flex items-center text-sm text-muted-foreground'>
                                <span className=''>Flat Transaction Fee</span>
                            </div>
                            <div className='text-sm font-medium text-grey-900'>
                                {isMounted 
                                    ? formatPrice(fee) 
                                    : <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
                                }
                            </div>
                        </div>

                        <div className='flex items-center justify-between border-t border-grey-200 pt-4'>
                            <div className='text-base font-medium text-grey-900'>Order Total</div>
                            <div className='text-base font-medium text-grey-900'>  {isMounted 
                                    ? formatPrice(fee + cartTotal) 
                                    : <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
                                }</div>
                        </div>

                    </div>

                    <div className='mt-6'>
                        <Button 
                            onClick={() => createCheckoutSession({ productIds })}
                            className='w-full' 
                            size='lg'
                            disabled={isLoading || !!items.length}
                        > {isLoading && <Loader2 className="w-4 h-4 mr-1.5 animate-spin"/>}
                            Checkout</Button>
                    </div>
                </section>
            </div>

        </div>
    </div>
}

export default Page