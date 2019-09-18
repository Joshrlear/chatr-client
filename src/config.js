export default {
    SERVER_BASE_URL: process.env.NODE_ENV !== "development" ? process.env.REACT_APP_SERVER_BASE_URL : "http://localhost:5000/",
    CLIENT_BASE_URL: process.env.NODE_ENV !== "development" ? process.env.REACT_APP_CLIENT_BASE_URL : "http://localhost:3000/"
}