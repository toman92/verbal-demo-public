// ToDo: switch off branch name env var to build production url on master
const API_BASE = (process.env.NODE_ENV === "production" && process.env.REACT_APP_API_URL) || "";
export const API_URL = `${API_BASE}/api`;

let headers = {
    "Content-Type": "application/json",
};

const setHeader = (name: string, data: string) => {
    headers = { ...headers, [name]: data };
};

const getHeaders = () => {
    const token = localStorage.getItem("token");
    if (token) {
        setHeader("x-auth-token", token);
    }
    return headers;
};

const postData = async (url = ``, data = {}): Promise<Response> =>
    await fetch(`${API_URL}${url}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: getHeaders(),
    });

const putData = async (url = ``, data = {}): Promise<Response> =>
    await fetch(`${API_URL}${url}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: getHeaders(),
    });

const patchData = async (url = ``, data = {}): Promise<Response> =>
    await fetch(`${API_URL}${url}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: getHeaders(),
    });

const getData = async <T>(url = ``): Promise<T> => {
    try {
        const response = await fetch(`${API_URL}${url}`, {
            method: "GET",
            headers: getHeaders(),
        });

        if (response.ok) {
            return await response.json();
        }

        return Promise.reject(response);
    } catch (error) {
        return Promise.reject(error);
    }
};

const getFile = async (url = ``): Promise<void> => {
    const response = await fetch(`${API_URL}${url}`, {
        method: "GET",
        headers: getHeaders(),
    }).then(async (res) => ({
        filename: res.headers.get("content-disposition")?.split("filename=")[1],
        blob: await res.blob(),
    }));

    // MS Edge and IE don't allow using a blob object directly as link href, instead it is necessary to use msSaveOrOpenBlob
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nav = window.navigator as any;
    if (nav && nav.msSaveOrOpenBlob) {
        nav.msSaveOrOpenBlob(response.blob);
        return;
    }

    // For other browsers: create a link pointing to the ObjectURL containing the blob.
    const objUrl = window.URL.createObjectURL(response.blob);

    const link = document.createElement("a");
    link.href = objUrl;
    link.download = response.filename ?? "file";
    link.click();
};

const deleteData = async (url = ``): Promise<Response> =>
    await fetch(`${API_URL}${url}`, {
        method: "DELETE",
        headers: getHeaders(),
    });

export { postData, getData, patchData, putData, deleteData, getFile };
