import React from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

const ProductCard = ({ product }) => {


	const { currency, router, toggleWishlistItem, isWishlisted, addToCart, formatCurrency } = useAppContext()

    return (
        <div
            onClick={() => { router.push('/product/' + product._id); scrollTo(0, 0) }}
            className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer"
        >
			<div className="cursor-pointer group relative bg-gray-500/10 rounded-lg w-full h-52 flex items-center justify-center">
				<Image
						src={product.image[0]}
						alt={product.name}
						className="group-hover:scale-105 transition object-cover w-4/5 h-4/5 md:w-full md:h-full"
						width={800}
						height={800}
				/>
				<div className="absolute top-2 right-2 flex items-center gap-2">
					<button
							type="button"
							onClick={(event) => {
								event.stopPropagation()
								addToCart(product._id)
							}}
							className="bg-white rounded-full shadow-md cursor-pointer p-2 hover:bg-gray-50 transition"
							aria-label="Add to cart"
					>
						<Image
								className="h-3 w-3"
								src={assets.cart_icon}
								alt="cart_icon"
							/>
					</button>
					<button
							type="button"
							onClick={(event) => {
								event.stopPropagation()
								toggleWishlistItem(product._id)
							}}
							className={`rounded-full shadow-md cursor-pointer p-2 transition ${
								isWishlisted(product._id)
									? "bg-red-500 text-white"
									: "bg-white"
							}`}
					>
						<Image
								className={`h-3 w-3 ${
									isWishlisted(product._id) ? "brightness-0 invert" : ""
								}`}
								src={assets.heart_icon}
								alt="heart_icon"
							/>
					</button>
				</div>
            </div>

            <p className="md:text-base font-medium pt-2 w-full truncate">{product.name}</p>
            <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">{product.description}</p>
            <div className="flex items-center gap-2">
                <p className="text-xs">{4.5}</p>
                <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Image
                            key={index}
                            className="h-3 w-3"
                            src={
                                index < Math.floor(4)
                                    ? assets.star_icon
                                    : assets.star_dull_icon
                            }
                            alt="star_icon"
                        />
                    ))}
                </div>
            </div>

			<div className="flex items-end justify-between w-full mt-1">
				<p className="text-base font-medium">{formatCurrency(product.offerPrice)}</p>
                <button className="max-sm:hidden px-4 py-1.5 text-gray-500 border border-gray-500/20 rounded-full text-xs hover:bg-slate-50 transition cursor-pointer">
                    Buy now
                </button>
            </div>
        </div>
    )
}

export default ProductCard
