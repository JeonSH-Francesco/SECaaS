import { getCookie } from "./cookie";

const basicHeaders = new Headers();
basicHeaders.append('Content-Type', 'application/json');

const authHeaders = new Headers();
const token = localStorage.getItem('token');

authHeaders.append('Content-Type', 'application/json');
authHeaders.append('Authorization', `Bearer ${token}`);

export {authHeaders, basicHeaders}