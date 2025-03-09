export const API_URLS = {
    login: 'http://localhost:3000/user/login',
    Canvas: 'http://localhost:3000/user/project/'
};

const canvas_base_url = API_URLS.Canvas

export const json_urls = {
    "Init": canvas_base_url + 'init',
    "Create": canvas_base_url + 'create',
    "Update": canvas_base_url + 'update',
    "Delete": canvas_base_url + 'delete',
    "Get": canvas_base_url + 'get'
}