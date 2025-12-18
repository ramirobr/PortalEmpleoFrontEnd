import { PostulantRegisterResponse, SignupData, CompanyRegisterResponse } from "@/types/user";
import { fetchApi } from "../apiClient";
import { CompanySignUpData } from "@/types/company";

export async function SignUp(body: SignupData) {
  const postulant = await fetchApi<PostulantRegisterResponse>("/Postulant/RegisterPostulant", {
    method: "POST",
    body,
  });
  return postulant
}

export async function CompanySignUp(body: CompanySignUpData) {
  const company = await fetchApi<CompanyRegisterResponse>("/Company/registerCompany", {
    method: "POST",
    body,
  });
  return company
}
