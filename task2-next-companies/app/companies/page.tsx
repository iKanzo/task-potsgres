import {
  getCompanies,
  getCities,
} from "@/lib/companies";

import CompaniesFilter from "./CompaniesFilter";
import Pagination from "./Pagination";


interface CompaniesPageProps {
  searchParams: Promise<{
    search?: string;
    city?: string;
    page?: string;
  }>;
}


export default async function CompaniesPage({
  searchParams,
}: CompaniesPageProps) {


  const params = await searchParams;


  const page =
    Number(params.page) || 1;


  const {
    companies,
    total,
    totalPages,
  } = await getCompanies({
    search: params.search,
    city: params.city,
    page,
  });


  const cities =
    await getCities();



  return (
    <main className="min-h-screen p-8">

      <h1 className="mb-6 text-3xl font-bold">
        Companies
      </h1>


      <CompaniesFilter
        cities={cities}
      />


      <p className="mb-4 text-gray-600">
        Найдено компаний: {total}
      </p>


      {companies.length === 0 && (
        <p>
          Компании не найдены
        </p>
      )}



      <div className="overflow-x-auto rounded-lg border">

        <table className="w-full border-collapse">

          <thead>
            <tr className="border-b bg-gray-100">

              <th className="p-3 text-left">
                Название
              </th>

              <th className="p-3 text-left">
                Категория
              </th>

              <th className="p-3 text-left">
                Город
              </th>

              <th className="p-3 text-left">
                Рейтинг
              </th>

              <th className="p-3 text-left">
                Отзывы
              </th>

            </tr>
          </thead>


          <tbody>

            {companies.map((company) => (

              <tr
                key={company.id}
                className="border-b"
              >

                <td className="p-3">
                  {company.name}
                </td>

                <td className="p-3">
                  {company.category}
                </td>

                <td className="p-3">
                  {company.city}
                </td>

                <td className="p-3">
                  {company.rating ?? "—"}
                </td>

                <td className="p-3">
                  {company.reviews_count}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>


      <Pagination
        currentPage={page}
        totalPages={totalPages}
        search={params.search}
        city={params.city}
      />

    </main>
  );
}