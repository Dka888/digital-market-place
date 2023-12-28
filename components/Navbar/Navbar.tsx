import Link from "next/link"
import { MaxWidthWrapper } from "../MaxWidthWrapper"
import { Icons } from "../ui/Icons"
import { NavItems } from "./NavItems"

export const Navbar = () => {
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
                        </div>
                    </div>
                </MaxWidthWrapper>
            </header>
        </div>
    )
}