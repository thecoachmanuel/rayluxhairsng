'use client'
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
  .split(",")
  .map((value) => value.trim().toLowerCase())
  .filter(Boolean);

const isAdminEmail = (email) => {
  if (!email) {
    return false;
  }
  const normalized = email.trim().toLowerCase();
  if (ADMIN_EMAILS.length === 0) {
    return normalized === "rayluxhairsng@gmail.com";
  }
  return ADMIN_EMAILS.includes(normalized);
};

export const AppContextProvider = (props) => {

	const currency = "₦";
	const router = useRouter();


  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [featuredProductIds, setFeaturedProductIds] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [branding, setBranding] = useState({
    logoUrl: "",
    footerDescription:
      "RayLux Hairs delivers premium, long‑lasting human hair bundles, wigs, and closures. Soft textures, full volume, and salon‑ready quality for every occasion.",
    footerPhone: "+1 (000) 000 0000",
    footerEmail: "support@rayluxhairs.com",
    sellerFooterNote:
      "Copyright 2025 © RayLux Hairs Admin Portal. All rights reserved.",
    facebookUrl: "#",
    twitterUrl: "#",
    instagramUrl: "#",
  });

  const [newsletterEmails, setNewsletterEmails] = useState([]);
  const [shippingSettings, setShippingSettings] = useState({
    baseFee: 0,
    perItemFee: 0,
    freeShippingThreshold: 0,
  });
  const [membershipSettings, setMembershipSettings] = useState({
    price: 0,
    benefits:
      "Join RayLux VIP to unlock special coupon drops, early access to new textures, and surprise gifts for loyal customers.",
  });
  const [coupons, setCoupons] = useState([]);
  const [membership, setMembership] = useState(null);
	const [adminVerified, setAdminVerified] = useState(false);
  const [bannerContent, setBannerContent] = useState({
    title: "Level Up Your Look With RayLux Hairs",
    description: "From sleek straight to deep wave—premium human hair for every style.",
    ctaLabel: "Shop bundle deals",
    imageUrl: "",
  });
  const [wishlistIds, setWishlistIds] = useState([]);

  const fetchProductData = async () => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && Array.isArray(data)) {
          const mapped = data.map((row) => ({
            ...row,
            _id: row._id || (row.id !== undefined ? String(row.id) : ""),
          }));
          setProducts(mapped);
          return;
        }
      } catch (error) {
      }
    }

    try {
      const stored = localStorage.getItem("raylux_products");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setProducts(parsed);
          return;
        }
      }
    } catch (error) {
    }

    setProducts([]);
  };

  const fetchUserData = async () => {
    setUserData(userDummyData);
  };

  const loadFeaturedProducts = () => {
    try {
      const stored = localStorage.getItem("raylux_featured_products");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFeaturedProductIds(parsed);
          return;
        }
      }
      if (productsDummyData.length > 0) {
        const defaults = productsDummyData.slice(0, 3).map((p) => p._id);
        setFeaturedProductIds(defaults);
        localStorage.setItem(
          "raylux_featured_products",
          JSON.stringify(defaults)
        );
      }
    } catch (error) {
    }
  };

  const loadWishlist = () => {
    try {
      const stored = localStorage.getItem("raylux_wishlist");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setWishlistIds(parsed);
          return;
        }
      }
    } catch (error) {}
    setWishlistIds([]);
  };

  const updateFeaturedProducts = (ids) => {
    setFeaturedProductIds(ids);
    try {
      localStorage.setItem("raylux_featured_products", JSON.stringify(ids));
    } catch (error) {
    }
  };

  const loadBannerContent = () => {
    if (supabase) {
      supabase
        .from("banner")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .then((result) => {
          if (!result.error && Array.isArray(result.data) && result.data[0]) {
            const row = result.data[0];
            setBannerContent({
              title:
                typeof row.title === "string" && row.title
                  ? row.title
                  : bannerContent.title,
              description:
                typeof row.description === "string" && row.description
                  ? row.description
                  : bannerContent.description,
              ctaLabel:
                typeof row.cta_label === "string" && row.cta_label
                  ? row.cta_label
                  : bannerContent.ctaLabel,
              imageUrl:
                typeof row.image_url === "string" ? row.image_url : "",
            });
            return;
          }
        });
      return;
    }
    try {
      const stored = localStorage.getItem("raylux_banner");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          setBannerContent({
            title:
              typeof parsed.title === "string"
                ? parsed.title
                : bannerContent.title,
            description:
              typeof parsed.description === "string"
                ? parsed.description
                : bannerContent.description,
            ctaLabel:
              typeof parsed.ctaLabel === "string"
                ? parsed.ctaLabel
                : bannerContent.ctaLabel,
            imageUrl:
              typeof parsed.imageUrl === "string" ? parsed.imageUrl : "",
          });
        }
      }
    } catch (error) {
    }
  };

  const loadHeroSlides = () => {
    if (supabase) {
      supabase
        .from("hero_slides")
        .select("*")
        .order("order_index", { ascending: true })
        .then((result) => {
          if (!result.error && Array.isArray(result.data) && result.data.length) {
            const slides = result.data.map((row) => ({
              id:
                typeof row.id === "string" || typeof row.id === "number"
                  ? String(row.id)
                  : "",
              title: typeof row.title === "string" ? row.title : "",
              offer: typeof row.offer === "string" ? row.offer : "",
              buttonText1:
                typeof row.button_text1 === "string" ? row.button_text1 : "",
              buttonText2:
                typeof row.button_text2 === "string" ? row.button_text2 : "",
              imageUrl:
                typeof row.image_url === "string" ? row.image_url : "",
              primaryProductId:
                typeof row.primary_product_id === "string" ||
                typeof row.primary_product_id === "number"
                  ? String(row.primary_product_id)
                  : "",
              secondaryProductId:
                typeof row.secondary_product_id === "string" ||
                typeof row.secondary_product_id === "number"
                  ? String(row.secondary_product_id)
                  : "",
            }));
            setHeroSlides(slides);
            return;
          }
        });
      return;
    }
    try {
      const stored = localStorage.getItem("raylux_hero_slides");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHeroSlides(parsed);
          return;
        }
      }
    } catch (error) {
    }

    const defaults = [
      {
        id: "slide_1",
        title: "Luxury human hair bundles for everyday glam.",
        offer: "This week only – up to 30% off bundles",
        buttonText1: "Shop bundles",
        buttonText2: "View collections",
        imageUrl: "/raylux-hairs/raw-straight-bundles-1.jpg",
      },
      {
        id: "slide_2",
        title: "Switch up your look with premium wigs and frontals.",
        offer: "Limited stock on best‑selling units",
        buttonText1: "Shop wigs",
        buttonText2: "See lace frontals",
        imageUrl: "/raylux-hairs/body-wave-lace-wig-1.jpg",
      },
      {
        id: "slide_3",
        title: "RayLux Hairs – soft, tangle‑free textures that last.",
        offer: "Bundle deals for salon owners and resellers",
        buttonText1: "Shop RayLux deals",
        buttonText2: "Become a reseller",
        imageUrl: "/raylux-hairs/360-lace-wig-22-1.jpg",
      },
    ];
    setHeroSlides(defaults);
    try {
      localStorage.setItem("raylux_hero_slides", JSON.stringify(defaults));
    } catch (error) {
    }
  };

  const updateHeroSlides = (slides) => {
    setHeroSlides(slides);
    if (supabase) {
      const payload = slides.map((slide, index) => ({
        id: slide.id || `slide_${index + 1}`,
        title: slide.title || "",
        offer: slide.offer || "",
        button_text1: slide.buttonText1 || "",
        button_text2: slide.buttonText2 || "",
        image_url: slide.imageUrl || "",
        primary_product_id: slide.primaryProductId || null,
        secondary_product_id: slide.secondaryProductId || null,
        order_index: index,
      }));
      supabase.from("hero_slides").upsert(payload);
    }
    try {
      localStorage.setItem("raylux_hero_slides", JSON.stringify(slides));
    } catch (error) {
    }
  };

  const loadBranding = () => {
    if (supabase) {
      supabase
        .from("branding")
        .select("*")
        .limit(1)
        .then((result) => {
          if (!result.error && Array.isArray(result.data) && result.data[0]) {
            const row = result.data[0];
            setBranding({
              logoUrl:
                typeof row.logo_url === "string" ? row.logo_url : "",
              footerDescription:
                typeof row.footer_description === "string"
                  ? row.footer_description
                  : branding.footerDescription,
              footerPhone:
                typeof row.footer_phone === "string"
                  ? row.footer_phone
                  : branding.footerPhone,
              footerEmail:
                typeof row.footer_email === "string"
                  ? row.footer_email
                  : branding.footerEmail,
              sellerFooterNote:
                typeof row.seller_footer_note === "string"
                  ? row.seller_footer_note
                  : branding.sellerFooterNote,
              facebookUrl:
                typeof row.facebook_url === "string"
                  ? row.facebook_url
                  : branding.facebookUrl,
              twitterUrl:
                typeof row.twitter_url === "string"
                  ? row.twitter_url
                  : branding.twitterUrl,
              instagramUrl:
                typeof row.instagram_url === "string"
                  ? row.instagram_url
                  : branding.instagramUrl,
            });
            return;
          }
        });
      return;
    }
    try {
      const stored = localStorage.getItem("raylux_branding");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          setBranding({
            logoUrl: typeof parsed.logoUrl === "string" ? parsed.logoUrl : "",
            footerDescription:
              typeof parsed.footerDescription === "string"
                ? parsed.footerDescription
                : branding.footerDescription,
            footerPhone:
              typeof parsed.footerPhone === "string"
                ? parsed.footerPhone
                : branding.footerPhone,
            footerEmail:
              typeof parsed.footerEmail === "string"
                ? parsed.footerEmail
                : branding.footerEmail,
            sellerFooterNote:
              typeof parsed.sellerFooterNote === "string"
                ? parsed.sellerFooterNote
                : branding.sellerFooterNote,
            facebookUrl:
              typeof parsed.facebookUrl === "string"
                ? parsed.facebookUrl
                : branding.facebookUrl,
            twitterUrl:
              typeof parsed.twitterUrl === "string"
                ? parsed.twitterUrl
                : branding.twitterUrl,
            instagramUrl:
              typeof parsed.instagramUrl === "string"
                ? parsed.instagramUrl
                : branding.instagramUrl,
          });
        }
      }
    } catch (error) {
    }
  };

  const updateBranding = (updates) => {
    const nextBranding = {
      ...branding,
      ...updates,
    };
    setBranding(nextBranding);
    if (supabase) {
      const payload = {
        id: 1,
        logo_url: nextBranding.logoUrl || "",
        footer_description: nextBranding.footerDescription || "",
        footer_phone: nextBranding.footerPhone || "",
        footer_email: nextBranding.footerEmail || "",
        seller_footer_note: nextBranding.sellerFooterNote || "",
        facebook_url: nextBranding.facebookUrl || "",
        twitter_url: nextBranding.twitterUrl || "",
        instagram_url: nextBranding.instagramUrl || "",
      };
      supabase.from("branding").upsert([payload]);
    }
    try {
      localStorage.setItem("raylux_branding", JSON.stringify(nextBranding));
    } catch (error) {
    }
  };

  const loadNewsletterEmails = () => {
    try {
      const stored = localStorage.getItem("raylux_newsletter_emails");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setNewsletterEmails(parsed);
        }
      }
    } catch (error) {
    }
  };

  const addNewsletterEmail = (email) => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;
    if (newsletterEmails.includes(trimmed)) return;
    const updated = [...newsletterEmails, trimmed];
    setNewsletterEmails(updated);
    try {
      localStorage.setItem(
        "raylux_newsletter_emails",
        JSON.stringify(updated)
      );
    } catch (error) {
    }
  };

  const loadShippingSettings = () => {
    if (supabase) {
      supabase
        .from("shipping_settings")
        .select("*")
        .limit(1)
        .then((result) => {
          if (!result.error && Array.isArray(result.data) && result.data[0]) {
            const row = result.data[0];
            setShippingSettings({
              baseFee:
                typeof row.base_fee === "number" ? row.base_fee : 0,
              perItemFee:
                typeof row.per_item_fee === "number" ? row.per_item_fee : 0,
              freeShippingThreshold:
                typeof row.free_shipping_threshold === "number"
                  ? row.free_shipping_threshold
                  : 0,
            });
            return;
          }
        });
      return;
    }
    try {
      const stored = localStorage.getItem("raylux_shipping_settings");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          setShippingSettings({
            baseFee:
              typeof parsed.baseFee === "number" ? parsed.baseFee : 0,
            perItemFee:
              typeof parsed.perItemFee === "number" ? parsed.perItemFee : 0,
            freeShippingThreshold:
              typeof parsed.freeShippingThreshold === "number"
                ? parsed.freeShippingThreshold
                : 0,
          });
          return;
        }
      }
    } catch (error) {
    }
  };

  const updateShippingSettings = (settings) => {
    const nextSettings = {
      ...shippingSettings,
      ...settings,
    };
    setShippingSettings(nextSettings);
    if (supabase) {
      const payload = {
        id: 1,
        base_fee: nextSettings.baseFee || 0,
        per_item_fee: nextSettings.perItemFee || 0,
        free_shipping_threshold: nextSettings.freeShippingThreshold || 0,
      };
      supabase.from("shipping_settings").upsert([payload]);
    }
    try {
      localStorage.setItem(
        "raylux_shipping_settings",
        JSON.stringify(nextSettings)
      );
    } catch (error) {
    }
  };

  const loadMembershipSettings = () => {
    if (supabase) {
      supabase
        .from("membership_settings")
        .select("*")
        .limit(1)
        .then((result) => {
          if (!result.error && Array.isArray(result.data) && result.data[0]) {
            const row = result.data[0];
            setMembershipSettings({
              price:
                typeof row.price === "number"
                  ? row.price
                  : membershipSettings.price,
              benefits:
                typeof row.benefits === "string" && row.benefits
                  ? row.benefits
                  : membershipSettings.benefits,
            });
            return;
          }
        });
      return;
    }
    try {
      const stored = localStorage.getItem("raylux_membership_settings");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          setMembershipSettings({
            price:
              typeof parsed.price === "number"
                ? parsed.price
                : membershipSettings.price,
            benefits:
              typeof parsed.benefits === "string" && parsed.benefits
                ? parsed.benefits
                : membershipSettings.benefits,
          });
        }
      }
    } catch (error) {
    }
  };

  const updateMembershipSettings = (settings) => {
    const nextSettings = {
      ...membershipSettings,
      ...settings,
    };
    const numericPrice = Number(nextSettings.price) || 0;
    const finalSettings = {
      price: numericPrice,
      benefits: nextSettings.benefits || "",
    };
    setMembershipSettings(finalSettings);
    if (supabase) {
      const payload = {
        id: 1,
        price: finalSettings.price,
        benefits: finalSettings.benefits,
      };
      supabase.from("membership_settings").upsert([payload]);
    }
    try {
      localStorage.setItem(
        "raylux_membership_settings",
        JSON.stringify(finalSettings)
      );
    } catch (error) {
    }
  };

  const loadCoupons = () => {
    if (supabase) {
      supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false })
        .then((result) => {
          if (!result.error && Array.isArray(result.data)) {
            setCoupons(result.data);
          }
        });
      return;
    }
    try {
      const stored = localStorage.getItem("raylux_coupons");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCoupons(parsed);
        }
      }
    } catch (error) {
    }
  };

  const addCoupon = async (coupon) => {
    if (supabase) {
      const payload = {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        min_amount: coupon.minAmount,
        is_active: coupon.isActive,
      };
      const { data, error } = await supabase
        .from("coupons")
        .insert([payload])
        .select("*")
        .single();
      if (!error && data) {
        setCoupons((prev) => [data, ...prev]);
        return;
      }
    }
    const id = Date.now().toString();
    const next = [...coupons, { ...coupon, id }];
    setCoupons(next);
    try {
      localStorage.setItem("raylux_coupons", JSON.stringify(next));
    } catch (error) {
    }
  };

  const updateCoupon = async (id, updates) => {
    if (supabase) {
      const target = coupons.find((coupon) => coupon.id === id || coupon._id === id);
      if (target) {
        const rowId = target._id || target.id;
        const payload = {};
        if (typeof updates.isActive === "boolean") {
          payload.is_active = updates.isActive;
        }
        if (updates.value !== undefined) {
          payload.value = updates.value;
        }
        if (updates.minAmount !== undefined) {
          payload.min_amount = updates.minAmount;
        }
        if (updates.code !== undefined) {
          payload.code = updates.code;
        }
        if (updates.type !== undefined) {
          payload.type = updates.type;
        }
        if (Object.keys(payload).length > 0) {
          await supabase.from("coupons").update(payload).eq("id", rowId);
        }
      }
      setCoupons((prev) =>
        prev.map((coupon) =>
          coupon.id === id || coupon._id === id ? { ...coupon, ...updates } : coupon
        )
      );
      return;
    }
    const next = coupons.map((coupon) =>
      coupon.id === id ? { ...coupon, ...updates } : coupon
    );
    setCoupons(next);
    try {
      localStorage.setItem("raylux_coupons", JSON.stringify(next));
    } catch (error) {
    }
  };

  const deleteCoupon = async (id) => {
    if (supabase) {
      const target = coupons.find((coupon) => coupon.id === id || coupon._id === id);
      if (target) {
        const rowId = target._id || target.id;
        await supabase.from("coupons").delete().eq("id", rowId);
      }
      setCoupons((prev) =>
        prev.filter((coupon) => coupon.id !== id && coupon._id !== id)
      );
      return;
    }
    const next = coupons.filter((coupon) => coupon.id !== id);
    setCoupons(next);
    try {
      localStorage.setItem("raylux_coupons", JSON.stringify(next));
    } catch (error) {
    }
  };

  const loadMembership = () => {
    if (!supabase || !authUser) {
      setMembership(null);
      return;
    }
    supabase
      .from("memberships")
      .select("*")
      .eq("user_id", authUser.id)
      .limit(1)
      .then((result) => {
        if (!result.error && Array.isArray(result.data) && result.data[0]) {
          setMembership(result.data[0]);
        } else {
          setMembership(null);
        }
      })
      .catch(() => {
        setMembership(null);
      });
  };

  const joinMembership = async () => {
    if (!supabase || !authUser) {
      return {
        data: null,
        error: new Error("Sign in to join membership."),
      };
    }
    const payload = {
      user_id: authUser.id,
      email: authUser.email,
      tier: "VIP",
      is_active: true,
    };
    const { data, error } = await supabase
      .from("memberships")
      .upsert(payload)
      .select("*")
      .single();
    if (!error && data) {
      setMembership(data);
    }
    return { data, error };
  };

  const signIn = async (email, password) => {
    if (!supabase) {
      return {
        data: null,
        error: new Error("Supabase is not configured"),
      };
    }
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!result.error && result.data && result.data.user) {
      setAuthUser(result.data.user);
		  setIsSeller(isAdminEmail(result.data.user.email));
    }
    return result;
  };

  const signUp = async (email, password) => {
    if (!supabase) {
      return {
        data: null,
        error: new Error("Supabase is not configured"),
      };
    }
    const result = await supabase.auth.signUp({
      email,
      password,
    });
    if (!result.error && result.data && result.data.user) {
      setAuthUser(result.data.user);
		  setIsSeller(isAdminEmail(result.data.user.email));
    }
    return result;
  };

  const signOut = async () => {
    if (!supabase) {
      setAuthUser(null);
      setIsSeller(false);
      return;
    }
    await supabase.auth.signOut();
    setAuthUser(null);
    setIsSeller(false);
		setAdminVerified(false);
  };

	const verifyAdminPassword = async () => {
		if (!isSeller) {
			return false;
		}
		let input = null;
		if (typeof window !== "undefined") {
			input = window.prompt("Enter admin password");
		}
		if (!input) {
			return false;
		}
		try {
			const response = await fetch("/api/admin-auth", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ password: input }),
			});
			const data = await response.json().catch(() => ({}));
			if (response.ok && data && data.ok) {
				if (supabase && authUser) {
					try {
						await supabase.auth.updateUser({ password: input });
					} catch (_error) {
					}
				}
				setAdminVerified(true);
				return true;
			}
		} catch (_error) {
		}
		if (typeof window !== "undefined") {
			window.alert("Incorrect admin password.");
		}
		return false;
	};

  const updateBannerContent = (content) => {
    const nextContent = {
      title: content.title || bannerContent.title,
      description: content.description || bannerContent.description,
      ctaLabel: content.ctaLabel || bannerContent.ctaLabel,
      imageUrl:
        content.imageUrl !== undefined
          ? content.imageUrl
          : bannerContent.imageUrl,
    };
    setBannerContent(nextContent);
    if (supabase) {
      const payload = {
        id: 1,
        title: nextContent.title,
        description: nextContent.description,
        cta_label: nextContent.ctaLabel,
        image_url: nextContent.imageUrl,
      };
      supabase.from("banner").upsert([payload]);
    }
    try {
      localStorage.setItem("raylux_banner", JSON.stringify(nextContent));
    } catch (error) {
    }
  };

  const toggleWishlistItem = (id) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((itemId) => itemId !== id) : [...prev, id];
      try {
        localStorage.setItem("raylux_wishlist", JSON.stringify(next));
      } catch (error) {}
      return next;
    });
  };

  const isWishlisted = (id) => wishlistIds.includes(id);

  const persistProducts = (updatedProducts) => {
    setProducts(updatedProducts);
    try {
      localStorage.setItem("raylux_products", JSON.stringify(updatedProducts));
    } catch (error) {
    }
  };

  const updateProduct = async (id, updates) => {
    const updatedProducts = products.map((product) =>
      product._id === id ? { ...product, ...updates } : product
    );
    if (supabase) {
      const target = products.find(
        (product) => product._id === id || product.id === id
      );
      if (target) {
        const rowId = target._id || target.id;
        const payload = {};
        if (updates.name !== undefined) {
          payload.name = updates.name;
        }
        if (updates.description !== undefined) {
          payload.description = updates.description;
        }
        if (updates.price !== undefined) {
          payload.price = updates.price;
        }
        if (updates.offerPrice !== undefined) {
          payload.offerPrice = updates.offerPrice;
        }
        if (updates.category !== undefined) {
          payload.category = updates.category;
        }
        if (updates.image !== undefined) {
          payload.image = updates.image;
        }
        if (Object.keys(payload).length > 0) {
          await supabase.from("products").update(payload).eq("id", rowId);
        }
      }
      setProducts(updatedProducts);
      return;
    }
    persistProducts(updatedProducts);
  };

  const deleteProduct = async (id) => {
    const updatedProducts = products.filter((product) => product._id !== id);
    if (supabase) {
      const target = products.find(
        (product) => product._id === id || product.id === id
      );
      if (target) {
        const rowId = target._id || target.id;
        await supabase.from("products").delete().eq("id", rowId);
      }
      setProducts(updatedProducts);
      return;
    }
    persistProducts(updatedProducts);
  };

  const addToCart = async (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
  };

  const updateCartQuantity = async (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    if (quantity === 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }
    setCartItems(cartData);
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      if (cartItems[items] > 0) {
        totalCount += cartItems[items];
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (cartItems[items] > 0 && itemInfo) {
        totalAmount += itemInfo.offerPrice * cartItems[items];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  const getCartItemCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      if (cartItems[items] > 0) {
        totalCount += cartItems[items];
      }
    }
    return totalCount;
  };

	const formatCurrency = (amount) => {
		if (!amount || isNaN(amount)) {
			return `${currency}0`;
		}
		try {
			return new Intl.NumberFormat("en-NG", {
				style: "currency",
				currency: "NGN",
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			}).format(amount);
		} catch (_error) {
			return `${currency}${amount}`;
		}
	};

  useEffect(() => {
    fetchProductData();
    fetchUserData();
    loadFeaturedProducts();
    loadBannerContent();
    loadHeroSlides();
    loadBranding();
    loadNewsletterEmails();
    loadShippingSettings();
    loadMembershipSettings();
    loadCoupons();
    loadWishlist();
    if (!supabase) {
      setAuthLoading(false);
      return;
    }
    let active = true;
    supabase.auth
      .getUser()
      .then(({ data, error }) => {
        if (!active) {
          return;
        }
        if (!error && data && data.user) {
          setAuthUser(data.user);
		    setIsSeller(isAdminEmail(data.user.email));
        } else {
          setAuthUser(null);
          setIsSeller(false);
        }
        setAuthLoading(false);
      })
      .catch(() => {
        if (!active) {
          return;
        }
        setAuthUser(null);
        setIsSeller(false);
        setAuthLoading(false);
      });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) {
        return;
      }
      if (session && session.user) {
        setAuthUser(session.user);
		  setIsSeller(isAdminEmail(session.user.email));
      } else {
        setAuthUser(null);
        setIsSeller(false);
      }
    });
    return () => {
      active = false;
      if (data && data.subscription) {
        data.subscription.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    if (authUser) {
      loadMembership();
    } else {
      setMembership(null);
    }
  }, [authUser]);

  const value = {
    currency,
    router,
    isSeller,
    setIsSeller,
    userData,
    fetchUserData,
    authUser,
    authLoading,
    signIn,
    signUp,
    signOut,
    products,
    fetchProductData,
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount,
    getCartItemCount,
    formatCurrency,
    featuredProductIds,
    updateFeaturedProducts,
    bannerContent,
    updateBannerContent,
    heroSlides,
    updateHeroSlides,
    branding,
    updateBranding,
    newsletterEmails,
    addNewsletterEmail,
    shippingSettings,
    updateShippingSettings,
    membershipSettings,
    updateMembershipSettings,
    coupons,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    membership,
    joinMembership,
    wishlistIds,
    toggleWishlistItem,
    isWishlisted,
		adminVerified,
		verifyAdminPassword,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
