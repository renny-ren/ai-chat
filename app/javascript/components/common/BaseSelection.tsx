import React, { Fragment, useState, useEffect } from "react"
import { Listbox, Transition } from "@headlessui/react"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid"

interface BaseSelectionProps {
  options: {}[]
  onChange?: () => void
}

const BaseSelection: React.FC<BaseSelectionProps> = ({ options, onChange }) => {
  const [selected, setSelected] = useState(options[0])

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ")
  }

  const handleSelectionChange = (item) => {
    setSelected(item)
    if (onChange) {
      onChange(item)
    }
  }

  return (
    <>
      <Listbox value={selected} onChange={handleSelectionChange}>
        {({ open }) => (
          <>
            <div className="relative mt-2">
              <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:ring-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500">
                <span className="flex items-center">
                  <span className="block truncate">{selected.label}</span>
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {options.map((opt, i) => (
                    <Listbox.Option
                      key={i}
                      className={({ active }) =>
                        classNames(
                          active ? "bg-emerald-500 text-white" : "text-gray-900",
                          "relative cursor-default select-none py-2 pl-3 pr-9"
                        )
                      }
                      value={opt}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <span className={classNames(selected ? "font-semibold" : "font-normal", "block truncate")}>
                              {opt.label}
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-emerald-600",
                                "absolute inset-y-0 right-0 flex items-center pr-4"
                              )}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </>
  )
}

export default BaseSelection
