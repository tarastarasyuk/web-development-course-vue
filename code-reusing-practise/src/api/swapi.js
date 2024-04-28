export function getPlanets({ page = 1, search} = {}) {
    const url = new URL("http://localhost:8123/api/planets");
    Object.entries({
        page,
        search,
    }).forEach(([key, value]) => {
        if (value !== null) {
            url.searchParams.append(key, value);
        }
    });
    return fetch(url).then((r) => r.json());
}
