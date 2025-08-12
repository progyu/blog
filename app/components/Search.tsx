"use client";

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useState, useMemo } from "react";
import Fuse, { type FuseResult } from "fuse.js";
import type { Post } from "@/app/get-posts";
import { Highlight } from "./Highlight";

type FusePostResult = FuseResult<Post>;

export function Search({ posts }: { posts: Post[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: [
          { name: "title", weight: 2 },
          { name: "description", weight: 1 },
          { name: "content", weight: 0.5 },
          { name: "tags", weight: 1.5 },
        ],
        includeScore: true,
        includeMatches: true,
        minMatchCharLength: 2,
        threshold: 0.3,
        ignoreLocation: true,
      }),
    [posts]
  );

  const results: FusePostResult[] = query ? fuse.search(query).slice(0, 10) : [];

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setQuery("");
    setIsOpen(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        aria-label="Search posts"
        className="inline-flex hover:bg-gray-200 dark:hover:bg-[#313131] active:bg-gray-300 dark:active:bg-[#242424] items-center p-2 rounded-sm transition-[background-color]"
      >
        <SearchIcon />
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-start justify-center p-4 pt-16 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                    Search Posts
                  </DialogTitle>
                  <div className="mt-4">
                    <input
                      type="text"
                      value={query}
                      onChange={handleSearch}
                      placeholder="Search by title, content, or tags..."
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mt-4 max-h-96 overflow-y-auto">
                    {results.length > 0 ? (
                      <ul>
                        {results.map(({ item: post, matches }) => {
                          const titleMatch = matches?.find(m => m.key === 'title');
                          const contentMatch = matches?.find(m => m.key === 'content' || m.key === 'description');

                          return (
                            <li key={post.slug} className="mt-2">
                              <a href={`/${post.slug}`} className="block p-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                                <div className="font-semibold text-gray-900 dark:text-gray-100">
                                  {titleMatch ? (
                                    <Highlight text={post.title} indices={titleMatch.indices} />
                                  ) : (
                                    post.title
                                  )}
                                </div>
                                {contentMatch && (
                                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    <Highlight text={contentMatch.value!} indices={contentMatch.indices} />
                                  </div>
                                )}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      query.length > 0 && <p className="text-center text-gray-500 py-4">No results found.</p>
                    )}
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

function SearchIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
