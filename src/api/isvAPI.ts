import * as qs from "qs";
import { toast } from "react-toastify";

export const getOperationRecords = async (options?: object) => {
  if (
    process.env.NEXT_PUBLIC_FAST_HOST &&
    process.env.NEXT_PUBLIC_FAST_PORT
  ) {
    const fetchOptions = qs.stringify(options);
    console.log(fetchOptions)
    const res = await fetch(
      `http://${process.env.NEXT_PUBLIC_FAST_HOST}:${process.env.NEXT_PUBLIC_FAST_PORT}/isv/records/?${fetchOptions}`
    ).catch((error) => {
      toast.error("fetching data is error, please check server API, " + error, {
        autoClose: false,
      });
    });
    if (res) {
      if (res.status !== 200) {
        toast.error("Get data 'isv-records' error, " + res.statusText,{
          autoClose: false
        });
        return null;
      } else {
        const data = await res.json();
        return data;
      }
    }
  } else {
    toast.error(
      "env parameter is undefined, please check .env file and parameters"
    ,{
      autoClose: false
    });
    return null;
  }
};