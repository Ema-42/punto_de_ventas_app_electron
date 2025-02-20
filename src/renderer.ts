/* const $ = (selector: string): HTMLElement | null => document.querySelector(selector);
const $count = $("#count") as HTMLElement;
const $button = $("button") as HTMLButtonElement;

$button.addEventListener("click", () => {
    const count = parseInt($count.textContent || "0", 10);
    $count.textContent = (count + 1).toString();
});

window.ipcRenderer.onUpdateTheme((event: Event, theme: string) => {
    console.log("log: ", event, theme);
});

window.ipcRenderer.getProductos().then((productos: any[]) => {
    const tbody = document.getElementById("productos-body") as HTMLTableSectionElement;
    productos.forEach((producto) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.precio}</td>
            <td>${producto.imagen_url}</td>
            <td>${producto.categoria.nombre}</td>
        `;

        tbody.appendChild(tr);
    });
}); */