"use client";

import Link from "next/link";


interface PaginationProps {
  currentPage: number;
  totalPages: number;
  search?: string;
  city?: string;
}


export default function Pagination({
  currentPage,
  totalPages,
  search,
  city,
}: PaginationProps) {


  if (totalPages <= 1) {
    return null;
  }


  function createUrl(page: number) {

    const params =
      new URLSearchParams();


    params.set(
      "page",
      page.toString()
    );


    if (search) {
      params.set(
        "search",
        search
      );
    }


    if (city) {
      params.set(
        "city",
        city
      );
    }


    return `/companies?${params.toString()}`;
  }



  return (
    <div className="mt-6 flex items-center gap-3">

      {currentPage > 1 && (
        <Link
          href={createUrl(currentPage - 1)}
          className="rounded border px-3 py-2"
        >
          Назад
        </Link>
      )}


      <span>
        Страница {currentPage} из {totalPages}
      </span>


      {currentPage < totalPages && (
        <Link
          href={createUrl(currentPage + 1)}
          className="rounded border px-3 py-2"
        >
          Вперёд
        </Link>
      )}

    </div>
  );
}