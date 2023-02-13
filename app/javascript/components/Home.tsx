import React, { Fragment, useState } from "react"
import { Link } from "react-router-dom"
import { Dialog, Popover, Tab, Transition } from "@headlessui/react"
import { Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon, XMarkIcon } from "@heroicons/react/24/outline"
import ChatModule from "./ChatModule/ChatModule"

const navigation = {
  categories: [
    {
      id: "women",
      name: "Women",
      featured: [
        {
          name: "New Arrivals",
          href: "#",
          imageSrc: "https://tailwindui.com/img/ecommerce-images/mega-menu-category-01.jpg",
          imageAlt: "Models sitting back to back, wearing Basic Tee in black and bone.",
        },
        {
          name: "Basic Tees",
          href: "#",
          imageSrc: "https://tailwindui.com/img/ecommerce-images/mega-menu-category-02.jpg",
          imageAlt: "Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.",
        },
      ],
      sections: [
        {
          id: "clothing",
          name: "Clothing",
          items: [
            { name: "Tops", href: "#" },
            { name: "Dresses", href: "#" },
            { name: "Pants", href: "#" },
            { name: "Denim", href: "#" },
            { name: "Sweaters", href: "#" },
            { name: "T-Shirts", href: "#" },
            { name: "Jackets", href: "#" },
            { name: "Activewear", href: "#" },
            { name: "Browse All", href: "#" },
          ],
        },
        {
          id: "accessories",
          name: "Accessories",
          items: [
            { name: "Watches", href: "#" },
            { name: "Wallets", href: "#" },
            { name: "Bags", href: "#" },
            { name: "Sunglasses", href: "#" },
            { name: "Hats", href: "#" },
            { name: "Belts", href: "#" },
          ],
        },
        {
          id: "brands",
          name: "Brands",
          items: [
            { name: "Full Nelson", href: "#" },
            { name: "My Way", href: "#" },
            { name: "Re-Arranged", href: "#" },
            { name: "Counterfeit", href: "#" },
            { name: "Significant Other", href: "#" },
          ],
        },
      ],
    },
    {
      id: "men",
      name: "Men",
      featured: [
        {
          name: "New Arrivals",
          href: "#",
          imageSrc: "https://tailwindui.com/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg",
          imageAlt: "Drawstring top with elastic loop closure and textured interior padding.",
        },
        {
          name: "Artwork Tees",
          href: "#",
          imageSrc: "https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-06.jpg",
          imageAlt:
            "Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt.",
        },
      ],
      sections: [
        {
          id: "clothing",
          name: "Clothing",
          items: [
            { name: "Tops", href: "#" },
            { name: "Pants", href: "#" },
            { name: "Sweaters", href: "#" },
            { name: "T-Shirts", href: "#" },
            { name: "Jackets", href: "#" },
            { name: "Activewear", href: "#" },
            { name: "Browse All", href: "#" },
          ],
        },
        {
          id: "accessories",
          name: "Accessories",
          items: [
            { name: "Watches", href: "#" },
            { name: "Wallets", href: "#" },
            { name: "Bags", href: "#" },
            { name: "Sunglasses", href: "#" },
            { name: "Hats", href: "#" },
            { name: "Belts", href: "#" },
          ],
        },
        {
          id: "brands",
          name: "Brands",
          items: [
            { name: "Re-Arranged", href: "#" },
            { name: "Counterfeit", href: "#" },
            { name: "Full Nelson", href: "#" },
            { name: "My Way", href: "#" },
          ],
        },
      ],
    },
  ],
  pages: [
    { name: "Company", href: "#" },
    { name: "Stores", href: "#" },
  ],
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function Example() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="lg:ml-72 xl:ml-80">
        <header className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex">
          <div className="contents lg:pointer-events-auto lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:px-6 lg:pt-4 lg:pb-8 lg:dark:border-white/10 xl:w-80">
            <div className="hidden lg:flex">
              <a aria-label="Home" href="/"></a>
            </div>
            <div
              className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-12 px-4 transition sm:px-6 lg:left-72 lg:z-30 lg:px-8 xl:left-80 backdrop-blur-sm dark:backdrop-blur lg:left-72 xl:left-80 bg-white/[var(--bg-opacity-light)] dark:bg-zinc-900/[var(--bg-opacity-dark)]"
              style={{ bgOpacityLight: "0.5", bgOpacityDark: "0.2" }}
            >
              <div className="absolute inset-x-0 top-full h-px transition bg-zinc-900/[.075] dark:bg-white/[.075]"></div>
              <div className="hidden lg:block lg:max-w-md lg:flex-auto">
                <button
                  type="button"
                  className="hidden h-8 w-full items-center gap-2 rounded-full bg-white pl-2 pr-3 text-sm text-zinc-500 ring-1 ring-zinc-900/10 transition hover:ring-zinc-900/20 dark:bg-white/5 dark:text-zinc-400 dark:ring-inset dark:ring-white/10 dark:hover:ring-white/20 lg:flex focus:[&amp;:not(:focus-visible)]:outline-none"
                >
                  Find something...
                  <kbd className="ml-auto text-2xs text-zinc-400 dark:text-zinc-500">
                    <kbd className="font-sans">⌘</kbd>
                    <kbd className="font-sans">K</kbd>
                  </kbd>
                </button>
              </div>
              <div className="flex items-center gap-5 lg:hidden">
                <button
                  type="button"
                  className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5"
                  aria-label="Toggle navigation"
                ></button>
                <a aria-label="Home" href="/"></a>
              </div>
              <div className="flex items-center gap-5">
                <nav className="hidden md:block">
                  <ul role="list" className="flex items-center gap-8">
                    <li>
                      <a
                        className="text-sm leading-5 text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                        href="/"
                      >
                        API
                      </a>
                    </li>
                    <li>
                      <a
                        className="text-sm leading-5 text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                        href="/#"
                      >
                        Documentation
                      </a>
                    </li>
                    <li>
                      <a
                        className="text-sm leading-5 text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                        href="/#"
                      >
                        Support
                      </a>
                    </li>
                  </ul>
                </nav>
                <div className="hidden md:block md:h-5 md:w-px md:bg-zinc-900/10 md:dark:bg-white/15"></div>
                <div className="flex gap-4">
                  <div className="contents lg:hidden">
                    <button
                      type="button"
                      className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5 lg:hidden focus:[&amp;:not(:focus-visible)]:outline-none"
                      aria-label="Find something..."
                    ></button>
                  </div>
                  <button
                    type="button"
                    className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5"
                    aria-label="Toggle dark mode"
                  ></button>
                </div>
                <div className="hidden min-[416px]:contents">
                  <a
                    className="inline-flex gap-0.5 justify-center overflow-hidden text-sm font-medium transition rounded-full bg-zinc-900 py-1 px-3 text-white hover:bg-zinc-700 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-1 dark:ring-inset dark:ring-emerald-400/20 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-300 dark:hover:ring-emerald-300"
                    href="/#"
                  >
                    Sign in
                  </a>
                </div>
              </div>
            </div>
            <nav className="hidden lg:mt-10 lg:block">
              <ul role="list">
                <li className="md:hidden">
                  <a
                    className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    href="/"
                  >
                    API
                  </a>
                </li>
                <li className="md:hidden">
                  <a
                    className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    href="/#"
                  >
                    Documentation
                  </a>
                </li>
                <li className="md:hidden">
                  <a
                    className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    href="/#"
                  >
                    Support
                  </a>
                </li>
                <li className="relative mt-6 md:mt-0">
                  <h2 className="text-xs font-semibold text-zinc-900 dark:text-white">Guides</h2>
                  <div className="relative mt-3 pl-2">
                    <div
                      className="absolute inset-x-0 top-0 bg-zinc-800/2.5 will-change-transform dark:bg-white/2.5"
                      style={{
                        height: "32px",
                        top: "0px",
                        opacity: "1",
                        borderRadius: "2.95203% / 25%",
                        transform: "none",
                        transformOrigin: "50% 50% 0px",
                      }}
                    ></div>
                    <div className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"></div>
                    <div className="absolute left-2 h-6 w-px bg-emerald-500" style={{ top: "4px", opacity: 1 }}></div>
                    <ul role="list" className="border-l border-transparent">
                      <li className="relative">
                        <a
                          aria-current="page"
                          className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-900 dark:text-white"
                          href="/"
                        >
                          <span className="truncate">Introduction</span>
                        </a>
                        <ul role="list" style={{ opacity: 1 }}>
                          <li>
                            <a
                              className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-7 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                              href="/#guides"
                            >
                              <span className="truncate">Guides</span>
                            </a>
                          </li>
                          <li>
                            <a
                              className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-7 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                              href="/#resources"
                            >
                              <span className="truncate">Resources</span>
                            </a>
                          </li>
                        </ul>
                      </li>
                      <li className="relative">
                        <a
                          className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                          href="/quickstart"
                        >
                          <span className="truncate">Quickstart</span>
                        </a>
                      </li>
                      <li className="relative">
                        <a
                          className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                          href="/sdks"
                        >
                          <span className="truncate">SDKs</span>
                        </a>
                      </li>
                      <li className="relative">
                        <a
                          className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                          href="/authentication"
                        >
                          <span className="truncate">Authentication</span>
                        </a>
                      </li>
                      <li className="relative">
                        <a
                          className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                          href="/pagination"
                        >
                          <span className="truncate">Pagination</span>
                        </a>
                      </li>
                      <li className="relative">
                        <a
                          className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                          href="/errors"
                        >
                          <span className="truncate">Errors</span>
                        </a>
                      </li>
                      <li className="relative">
                        <a
                          className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                          href="/webhooks"
                        >
                          <span className="truncate">Webhooks</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
                <li className="relative mt-6">
                  <h2 className="text-xs font-semibold text-zinc-900 dark:text-white">Resources</h2>
                  <div className="relative mt-3 pl-2">
                    <div className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"></div>
                    <ul role="list" className="border-l border-transparent">
                      <li className="relative">
                        <a
                          className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                          href="/contacts"
                        >
                          <span className="truncate">Contacts</span>
                        </a>
                      </li>
                      <li className="relative">
                        <a
                          className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                          href="/conversations"
                        >
                          <span className="truncate">Conversations</span>
                        </a>
                      </li>
                      <li className="relative">
                        <a
                          className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                          href="/messages"
                        >
                          <span className="truncate">Messages</span>
                        </a>
                      </li>
                      <li className="relative">
                        <a
                          className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                          href="/groups"
                        >
                          <span className="truncate">Groups</span>
                        </a>
                      </li>
                      <li className="relative">
                        <a
                          className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                          href="/attachments"
                        >
                          <span className="truncate">Attachments</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
                <li className="sticky bottom-0 z-10 mt-6 min-[416px]:hidden">
                  <a
                    className="inline-flex gap-0.5 justify-center overflow-hidden text-sm font-medium transition rounded-full bg-zinc-900 py-1 px-3 text-white hover:bg-zinc-700 dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400 w-full"
                    href="/#"
                  >
                    Sign in
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <div className="relative px-4 pt-14 sm:px-6 lg:px-8">
          <main className="py-16">
            <div className="absolute inset-0 -z-10 mx-0 max-w-none overflow-hidden">
              <div className="absolute left-1/2 top-0 ml-[-38rem] h-[25rem] w-[81.25rem] dark:[mask-image:linear-gradient(white,transparent)]">
                <div className="absolute inset-0 bg-gradient-to-r from-[#36b49f] to-[#DBFF75] opacity-40 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-[#36b49f]/30 dark:to-[#DBFF75]/30 dark:opacity-100"></div>
              </div>
            </div>
            <div>
              <ChatModule />
            </div>
          </main>
          <footer className="mx-auto max-w-2xl space-y-10 pb-16 lg:max-w-5xl">
            <div className="flex flex-col items-center justify-between gap-5 border-t border-zinc-900/5 pt-8 dark:border-white/5 sm:flex-row">
              <p className="text-xs text-zinc-600 dark:text-zinc-400">© Copyright. All rights reserved.</p>
              <div className="flex gap-4">
                <a className="group" href="/#">
                  <span className="sr-only">Follow us on Twitter</span>
                </a>
                <a className="group" href="/#">
                  <span className="sr-only">Follow us on GitHub</span>
                </a>
                <a className="group" href="/#">
                  <span className="sr-only">Join our Discord server</span>
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  )
}
