import { PaymentStatus } from "@/components/PaymentStatus";
import { PRODUCT_CATEGORIES } from "@/config";
import { getServerSideUser } from "@/lib/payload-utils";
import { formatPrice } from "@/lib/utils";
import { getPayloadClient } from "@/payload/get-payload";
import { Product, ProductFile, User } from "@/payload/payload-types";
import { cookies } from "next/headers";
import Image from 'next/image';
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface ThankYouPageInterface {
searchParams: {[key: string]: string | string[] | undefined}
}

const ThankYouPage = async ({searchParams}: ThankYouPageInterface) => {

    const orderId = searchParams.orderId;

    const nextCookies = cookies();

    const {user} = await getServerSideUser(nextCookies);

    const payload = await getPayloadClient()

    const {docs: orders} = await payload.find({
        collection: "orders",
        depth: 2,
        where: {
            id: {
                equals: orderId
            }
        }
    })

    const [order] = orders;

    const products = order.products as Product[];

    const total = products.reduce((acc, cur) => acc + Number(cur.price), 0)

    if(!order) {
        return notFound()
    }

    const orderUserId = typeof order.user === 'string'
        ? order.user
        : order.user.id;

    if(orderUserId !== user?.id) {
        return redirect(`/sign-in?origin=thank-you?orderId=${order.id}`)
    }



    return <main className='relative lg:min-h-full'>
        <div className='hidden lg:block h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12'>
            <Image 
                fill
                src='/checkout-thank-you.jpg'
                className='w-full h-full object-cover object-center'
                alt='thank you'
            />
        </div>

        <div>
            <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24'>
                <div className='lg:col-start-2'>
                    <p className="text-sm font-medium text-green-600">Order successful</p>
                    <h1 className="mt-2 text-4xl font-bold tracking-tight text-grey-900 sm:text-5xl">Thank you for ordering</h1>
                    {order._isPaid 
                        ? <p className="mt-2 text-base text-muted-foreground">
                            Your order was processed and your assets are available to download below. 
                            We&appos;ve sent your receipt and order details to {' '}
                            {typeof order.user !== "string"  && (<span className="font-medium text-grey-900">{order.user.email}</span>)}.
                        </p> 
                        : <p className='mt-2 text-base text-muted-foreground'>
                            We appreciate your order, and we are currently processing it.
                        </p>}

                        <div className='mt-16 text-sm font-medium'>
                            <div className='text-muted-foreground'>Order nr.</div>

                            <div className='mt-2 text-grey-900'>{order.id}</div>

                            <ul className='mt-6 divide-y divide-grey-200 border-grey-200 text-sm font-medium text-muted-foreground'>
                                {(order.products as Product[]).map(product => {
                                    const label = PRODUCT_CATEGORIES.find(({ value }) => value === product.category)?.label;

                                    const downloadUrl = (product.product_files as ProductFile).url as string;

                                    const { image } = product.images[0];
                                    return (
                                        <li key={product.id} className='flex space-x-6 py-6'>
                                            <div className='relative h-24 w-24'>
                                                {typeof image !== "string" && image.url 
                                                ? <Image 
                                                    fill
                                                    src={image.url}
                                                    alt={product.name}
                                                    className='flex-none rounded-md bg-grey-100 object-cover object-center'
                                                    />
                                                : null}
                                            </div>

                                            <div className="flex-auto flex flex-col justify-between">
                                                <div className='space-y-1'>
                                                    <h3 className='text-grey-900'>{product.name}</h3>
                                                    <p className='my-1'>Category: {label}</p>
                                                </div>

                                                {order._isPaid && (
                                                    <a 
                                                        href={downloadUrl} 
                                                        download={product.name}
                                                        className='text-green-600 hover:underline underline-offset-2'    
                                                    >Download asset</a>
                                                )}
                                            </div>

                                            <p className='flex-none font-medium text-grey-900'>
                                                {formatPrice(product.price)}
                                            </p>
                                        </li>
                                    )
                                    }
                                    )}
                            </ul>

                            <div className='space-y-6 border-grey-200 pt-6 text-sm font-medium text-muted-foreground'>
                                <div className='flex justify-between'>
                                    <p>Subtotal</p>
                                    <p className='text-grey-900'>{formatPrice(total)}</p>
                                </div>
                            </div>

                            <div className='space-y-6 border-grey-200 pt-6 text-sm font-medium'>
                                <div className='flex justify-between'>
                                    <p>Transaction fee</p>
                                    <p className='text-grey-900'>{formatPrice(1)}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-grey-200 pt-6 text-grey-600">
                                <p className="text-base">Total</p>
                                <p className="text-base">{formatPrice(total + 1)}</p>
                                
                            </div>
                        </div>

                        <PaymentStatus orderEmail={(order.user as User).email} orderId={order.id} isPaid={order._isPaid} />

                        <div className="mt-16 border-t border-grey-200 py-6 text-right">
                            <Link className="text-sm font-medium text-green-500 hover:text-green-600" href='/products'>
                                Continue shopping &rarr;
                            </Link>
                        </div>
                </div>
            </div>
        </div>
    </main>
}

export default ThankYouPage