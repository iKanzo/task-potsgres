import pool from "./db";
import { Company } from "@/types/company";


const PAGE_SIZE = 50;


interface GetCompaniesParams {
  search?: string;
  city?: string;
  page?: number;
}


interface CompaniesResult {
  companies: Company[];
  total: number;
  totalPages: number;
}


function buildFilters(
  params: GetCompaniesParams,
  values: string[]
) {
  const conditions: string[] = [];


  if (params.search) {
    values.push(`%${params.search}%`);

    conditions.push(
      `name ILIKE $${values.length}`
    );
  }


  if (params.city) {
    values.push(params.city);

    conditions.push(
      `city = $${values.length}`
    );
  }


  return conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";
}



export async function getCompanies(
  params: GetCompaniesParams = {}
): Promise<CompaniesResult> {


  const page = params.page ?? 1;

  const offset =
    (page - 1) * PAGE_SIZE;



  const values: string[] = [];

  const where = buildFilters(
    params,
    values
  );


  const countResult = await pool.query(
    `
      SELECT COUNT(*)
      FROM companies
      ${where};
    `,
    values
  );


  const total =
    Number(countResult.rows[0].count);



  const dataValues = [
    ...values,
    PAGE_SIZE.toString(),
    offset.toString(),
  ];


  const result = await pool.query(
    `
      SELECT
        id,
        name,
        category,
        city,
        address,
        rating,
        reviews_count,
        site,
        phone
      FROM companies
      ${where}
      ORDER BY name
      LIMIT $${dataValues.length - 1}
      OFFSET $${dataValues.length};
    `,
    dataValues
  );


  const companies = result.rows.map(
    (company) => ({
      ...company,
      rating: company.rating
        ? Number(company.rating)
        : null,
    })
  );


  return {
    companies,
    total,
    totalPages: Math.ceil(
      total / PAGE_SIZE
    ),
  };
}



export async function getCities(): Promise<string[]> {

  const result = await pool.query(
    `
      SELECT DISTINCT city
      FROM companies
      ORDER BY city;
    `
  );


  return result.rows.map(
    (row) => row.city
  );
}