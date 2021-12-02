import * as qs from "qs";
import { toast } from "react-toastify";

export const getOtsmProjects = async (options?: object) => {
  const fetchOptions = qs.stringify(options);
  const res = await fetch(
    `http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:${process.env.NEXT_PUBLIC_STRAPI_PORT}/api/otsm-projects?${fetchOptions}`
  );
  if (res.status !== 200) {
    toast("Get data 'otsm-project' error, " + res.statusText);
    return null;
  } else {
    const data = await res.json();
    return data.data;
  }
};

export const getOtsmMachines = async (projectId: number, options?: object) => {
  const fetchOptions = qs.stringify(options);
  const res = await fetch(
    `http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:${process.env.NEXT_PUBLIC_STRAPI_PORT}/api/otsm-projects/${projectId}?${fetchOptions}`
  );
  if (res.status !== 200) {
    toast("Get data 'otsm-machines' error, " + res.statusText);
    return null;
  } else {
    const data = await res.json();
    return data.data;
  }
};
