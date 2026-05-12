type StyleItem = {
    name: string;
    file: string;
};

const styles: StyleItem[] = [
    {
        name: "Styl 1",
        file: "./style-1.css"
    },
    {
        name: "Styl 2",
        file: "./style-2.css"
    },
    {
        name: "Styl 3",
        file: "./style-3.css"
    }
];

let currentLink: HTMLLinkElement | null = null;

function changeStyle(styleFile: string): void {

    if (currentLink) {
        currentLink.remove();
    }

    const link = document.createElement("link");

    link.rel = "stylesheet";
    link.href = styleFile;

    document.head.appendChild(link);

    currentLink = link;
}

function generateButtons(): void {

    const container = document.getElementById("style-links");

    if (!container) return;

    container.style.display = "flex";
    container.style.justifyContent = "center";
    container.style.gap = "20px";
    container.style.margin = "30px 0";

    styles.forEach((style) => {

        const button = document.createElement("button");

        button.textContent = style.name;

        button.addEventListener("click", () => {
            changeStyle(style.file);
        });

        container.appendChild(button);
    });
}

generateButtons();
changeStyle(styles[0].file);