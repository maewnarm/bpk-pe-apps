import * as qs from "qs";
import { toast } from "react-toastify";

export const getOtsmProjects = async (options?: object) => {
  if (
    process.env.NEXT_PUBLIC_STRAPI_HOST &&
    process.env.NEXT_PUBLIC_STRAPI_PORT
  ) {
    const fetchOptions = qs.stringify(options);
    const res = await fetch(
      `http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:${process.env.NEXT_PUBLIC_STRAPI_PORT}/api/otsm-projects?${fetchOptions}`
    ).catch((error) => {
      toast.error("fetching data is error, please check server API, " + error, {
        autoClose: false,
      });
    });
    if (res) {
      if (res.status !== 200) {
        toast.error("Get data 'otsm-project' error, " + res.statusText, {
          autoClose: false,
        });
        return null;
      } else {
        const data = await res.json();
        return data.data;
      }
    }
  } else {
    toast.error(
      "env parameter is undefined, please check .env file and parameters",
      {
        autoClose: false,
      }
    );
    return null;
  }
};

export const getOtsmMachines = async (projectId: number, options?: object) => {
  if (
    process.env.NEXT_PUBLIC_STRAPI_HOST &&
    process.env.NEXT_PUBLIC_STRAPI_PORT
  ) {
    const fetchOptions = qs.stringify(options);
    const res = await fetch(
      `http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:${process.env.NEXT_PUBLIC_STRAPI_PORT}/api/otsm-projects/${projectId}?${fetchOptions}`
    ).catch((error) => {
      toast.error("fetching data is error, please check server API, " + error, {
        autoClose: false,
      });
    });
    if (res) {
      if (res.status !== 200) {
        toast.error("Get data 'otsm-machines' error, " + res.statusText, {
          autoClose: false,
        });
        return null;
      } else {
        const data = await res.json();
        return data.data;
      }
    }
  } else {
    toast.error(
      "env parameter is undefined, please check .env file and parameters",
      {
        autoClose: false,
      }
    );
  }
};
