import axios from "axios";
import jwt_decode from "jwt-decode";

const API = "http://3.6.81.127:5000";

axios.interceptors.request.use(function (config) {
  const token = sessionStorage.getItem("token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getLoginDetails = () => {
  const token = sessionStorage.getItem("token");
  let decoded;
  if (token) {
    decoded = jwt_decode(token);
  }
  return decoded;
};

export const userLogin = async (data) => {
  try {
    return await axios.post(`${API}/user/login`, data);
  } catch (err) {
    return { status: 400 };
  }
};

export const getUserData = async (today) => {
  try {
    return await axios.get(`${API}/entries/records?today=${today}`);
  } catch (err) {
    return { status: 400 };
  }
};

export const addNewEntry = async (formData) => {
  try {
    console.log(formData);
    return await axios.post(`${API}/entries/add_entry`, formData);
  } catch (err) {
    return { status: 400 };
  }
};

export const updateEntry = async (formData) => {
  try {
    console.log(formData);
    return await axios.post(`${API}/entries/edit_entry`, formData);
  } catch (err) {
    return { status: 400 };
  }
};

export const getUserAvg = async () => {
  try {
    return await (
      await axios.get(`${API}/entries/avg`)
    ).data;
  } catch (err) {
    return { status: 400 };
  }
};

export const markCompleted = async (id) => {
  try {
    return await axios.get(`${API}/entries/completed/${id}`);
  } catch (err) {
    return { status: 400 };
  }
};
