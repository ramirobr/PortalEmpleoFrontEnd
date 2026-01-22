import { CompanySignUpData } from "@/types/company";
import { PlainStringDataMessage, SIGN_UP_FIELDS, SignupData, SignUpFieldsResponse } from "@/types/user";
import { fetchApi } from "../apiClient";
import { fetchAllCatalogsByType } from "../catalog/fetch";
import { mapCatalogsToResponse } from "../utils";

export async function SignUp(body: SignupData) {
  const postulant = await fetchApi<PlainStringDataMessage>("/Postulant/RegisterPostulant", {
    method: "POST",
    body,
  });
  return postulant
}

export async function CompanySignUp(body: CompanySignUpData) {
  const company = await fetchApi<PlainStringDataMessage>("/Company/registerCompany", {
    method: "POST",
    body,
  });
  return company
}

export async function fetchSignUpFields(): Promise<SignUpFieldsResponse | null> {
  try {
    const results = await Promise.all(
      SIGN_UP_FIELDS.map(fetchAllCatalogsByType)
    );

    return mapCatalogsToResponse(SIGN_UP_FIELDS, results)
  } catch (error) {
    console.warn("Issue getting form fields", error);
    return null;
  }
}
