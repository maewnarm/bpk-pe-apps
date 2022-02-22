import * as qs from "qs";
import { toast } from "react-toastify";

export const getProductItem = async (item:string,options?: object) => {
  if (
    process.env.NEXT_PUBLIC_STRAPI_HOST &&
    process.env.NEXT_PUBLIC_STRAPI_PORT
  ) {
    const fetchOptions = qs.stringify(options);
    const res = await fetch(
      `http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:${process.env.NEXT_PUBLIC_STRAPI_PORT}/api/${item}?${fetchOptions}`
    ).catch((error) => {
      toast("fetching data is error, please check server API, " + error, {
        autoClose: false,
      });
    });
    if (res) {
      if (res.status !== 200) {
        toast(`Get data '${item}' error, ${res.statusText}`);
        return null;
      } else {
        const data = await res.json();
        return data.data;
      }
    }
  } else {
    toast(
      "env parameter is undefined, please check .env file and parameters"
    );
    return null;
  }
};