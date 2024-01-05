import Link from "next/link"
import { MaxWidthWrapper } from "../MaxWidthWrapper"
import { Icons } from "../ui/Icons"
import { NavItems } from "./NavItems"
import { buttonVariants } from "../ui/button"
import { Cart } from "../Cart/Cart"
import { getServerSideUser } from "@/lib/payload-utils"
import {cookies} from 'next/headers';
import {UserAccountNav} from './UserAccountNav';

export const Navbar = async() => {
    const nextCookies = cookies();
    const {user} = await getServerSideUser(nextCookies);

    return (
        <div className="h-16 bg-white sticky z-55 top-0 inset-x-0">
            <header className="bg-white relative">
                <MaxWidthWrapper>
                    <div className="border-b border-grey-200">
                        <div className='flex items-center h-16'>
                            {/* todo mobile navbar */}

                            <div className='ml-4 lg:ml-0 flex'>
                                <Link href='/'>
                                    <Icons.logo className="h-10 w-10"/>
                                </Link>
                            </div>
                            <div className="hidden z-50 lg:ml-8 lg:block lg:self-stretch" >
                                <NavItems />
                            </div>

                            <div className="ml-auto flex items-center">
                                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                                    {user ? null : <Link href='/sign-in' className={buttonVariants()}>Sing in</Link>}
                                    {user ? null : <span className="h-6 w-px bg-gray-300" aria-hidden='true'/>}
                                    {user ? (<UserAccountNav user={user}/>) : <Link href='/sign-up' className={buttonVariants({variant: 'ghost'})}>Sign up</Link>}
                                    {user ? <span className="h-6 w-px bg-gray-300" aria-hidden='true'/> : null}
                                    {user 
                                    ? null 
                                    : <div className="flex lg:ml-6">
                                        <span className="h-6 w-px bg-gray-300" aria-hidden='true'/>
                                     </div> }

                                     <div className="ml-4 flow-root lg:ml-6">
                                        <Cart />
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </MaxWidthWrapper>
            </header>
        </div>
    )
}