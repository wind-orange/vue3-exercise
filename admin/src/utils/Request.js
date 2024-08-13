// 封装axios发送请求及处理响应功能
import axios from "axios";
import { ElLoading } from "element-plus";
import router from "@/router";
import Message from "@/utils/Message";

const contentTypeForm = "application/x-www-urlencoded;charset=UTF-8";
const contentTypeJson = "application/json";

let loading = null;
const instance = axios.create({
  baseURL: "/api",
  timeout: 10 * 1000,
});

instance.interceptors.request.use(
  (config) => {
    if (config.showLoading) {
      loading = ElLoading.service({
        lock: true,
        text: "加载中...",
        background: "rgba(0,0,0,0.7)",
      });
    }
    return config;
  },
  (error) => {
    if (config.showLoading && loading) {
      loading.close();
    }
    Message.error("请求发送失败");
    return Promise.reject("请求发送失败");
  }
);

instance.interceptors.response.use(
  (response) => {
    const { showLoading, errorCallback, showError = true } = response.config;
    if (showLoading && loading) {
      loading.close();
    }
    const responseData = response.data;
    if (responseData.code == 200) {
      return responseData;
    } else if (responseData.code == 901) {
      setTimeout(() => router.push("/login"), 2000);
    } else {
      if (errorCallback) {
        errorCallback(responseData.info);
      }
      return Promise.reject({ showError: showError, msg: responseData.info });
    }
  },
  (error) => {
    if (error.config.showLoading && loading) {
      loading.close();
    }
    return Promise.reject({ showError: true, msg: "网络异常" });
  }
);

const request = (config) => {
  const { url, parmas, dataType, showLoading = true } = config;
  let contentType = contentTypeForm;
  let formData = parmas;
  if (dataType != null && dataType == "json") {
    contentType = contentTypeJson;
  } else {
    formData = new FormData();
    for (let key in parmas) {
      formData.append(key, parmas[key] == undefined ? "" : parmas[key]);
    }
  }
  let headers = {
    "Content-Type": contentType,
    "X-Requested-With": "XMLHttpRequest",
  };
  return instance
    .post(url, formData, {
      headers: headers,
      showLoading: showLoading,
      errorCallback: config.errorCallback,
      showError: config.showError,
    })
    .catch((error) => {
      console.log(error);
      if (error.showError) {
        Message.error(error.msg);
      }
      return null;
    });
};

export default request;
