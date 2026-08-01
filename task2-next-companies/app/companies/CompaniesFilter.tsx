"use client";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";


interface CompaniesFilterProps {
  cities: string[];
}


export default function CompaniesFilter({
  cities,
}: CompaniesFilterProps) {

  const router = useRouter();
  const searchParams = useSearchParams();


  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();


    const formData = new FormData(
      event.currentTarget
    );


    const search =
      formData.get("search")?.toString().trim() || "";


    const city =
      formData.get("city")?.toString() || "";


    const params = new URLSearchParams();


    if (search) {
      params.set("search", search);
    }


    if (city) {
      params.set("city", city);
    }


    const queryString =
      params.toString();


    router.push(
      queryString
        ? `/companies?${queryString}`
        : "/companies"
    );
  }


  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex flex-wrap gap-4"
    >

      <input
        name="search"
        placeholder="Поиск по названию"
        defaultValue={
          searchParams.get("search") ?? ""
        }
        className="rounded border px-3 py-2"
      />


      <select
        name="city"
        defaultValue={
          searchParams.get("city") ?? ""
        }
        className="rounded border px-3 py-2"
      >

        <option value="">
          Все города
        </option>


        {cities.map((city) => (
          <option
            key={city}
            value={city}
          >
            {city}
          </option>
        ))}

      </select>


      <button
        type="submit"
        className="rounded bg-black px-4 py-2 text-white"
      >
        Найти
      </button>

    </form>
  );
}