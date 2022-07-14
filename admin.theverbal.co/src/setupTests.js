import { server } from "./_tests_/hooks/mocks/server";

// eslint-disable-next-line no-undef
beforeAll(() =>
    server.listen({
        onUnhandledRequest(req) {
            console.error("Found an unhandled %s request to %s", req.method, req.url.href);
        },
    }),
);

// eslint-disable-next-line no-undef
afterEach(() => server.resetHandlers());

// eslint-disable-next-line no-undef
afterAll(() => server.close());

const localStorageMock = (function () {
    let store = {};

    return {
        getItem: function (key) {
            return store[key] || null;
        },
        setItem: function (key, value) {
            store[key] = value.toString();
        },
        removeItem: function (key) {
            delete store[key];
        },
        clear: function () {
            store = {};
        },
    };
})();

Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
});
