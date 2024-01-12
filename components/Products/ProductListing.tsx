"use client"

import { Product } from "@/payload/payload-types"
import { useEffect, useState } from "react"
import { Skeleton } from "../ui/skeleton"
import Link from "next/link"
import { cn, formatPrice } from "@/lib/utils"
import { PRODUCT_CATEGORIES } from "@/config"
import { ImageSlider } from "./ImageSlider"

interface ProductListingProps {
    product: Product | null,
    index: number
}

export const ProductListing = ({product, index}: ProductListingProps) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        const timer = setTimeout(() => { setIsVisible(true) }, index * 75);

        return () => clearTimeout(timer);
    }, [index]);

    if(!product || !isVisible) {
        return <ProductPlaceholder />
    }
    
    if(isVisible && product) {
        const label = PRODUCT_CATEGORIES.find(({value}) => value === product.category)?.label;
        const validUrls = product.images
            .map(({ image }) =>
            typeof image === 'string' ? image : image.url
            )
            .filter(Boolean) as string[];

        return <Link 
            href={`/product/${product.id}`}
            className={cn('invisible h-full w-full cursor-pointer group/main', {
                "visible animate-in fade-in-5": isVisible,
            })}
            >
                <div className="flex flex-col w-full">
                    <ImageSlider urls={validUrls}/>
                    <h3 className='mt-4 font-medium text-sm text-grey-700'>{product.name}</h3>
                    <p className='mt-1 text-sm text-grey-500'>{label}</p>
                    <p className='mt-1 font-medium text-sm text-grey-900'>{formatPrice(product.price)}</p>
                </div>
            </Link>
    }
}  
    
    const ProductPlaceholder = () => {
        return <div className="flex flex-col w-full">
            <div className='relative bg-zinc-100 aspect-square w-full overflow-hidden rounded-xl'>
                <Skeleton className='w-full h-full' />
            </div>
            <Skeleton className="mt-4 w-2/3 h-4 rounded-lg"/>
            <Skeleton className="mt-4 w-20 h-4 rounded-lg"/>
            <Skeleton className="mt-4 w-12 h-4 rounded-lg"/>
           
        </div>
    }