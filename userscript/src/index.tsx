import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { awaitElement, log, addLocationChangeCallback } from "./utils";
import getArtistId from "./shared/functions/getArtistId";
import { store } from "./redux/store";
import { setArtistId } from "./redux/artistSlice";
import { Provider } from "react-redux";


// Função principal chamada a cada mudança de URL
async function main() {

    const link2 = document.createElement("link");
    link2.rel = "stylesheet";
    link2.href = "https://use.fontawesome.com/releases/v5.15.4/css/all.css";
    document.getElementsByTagName("head")[0].appendChild(link2);
    //google web fonts
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap";
    document.getElementsByTagName("head")[0].appendChild(link);
    // const link1 = document.createElement("link");
    // link1.rel = "stylesheet";
    // link1.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
    // document.getElementsByTagName("head")[0].appendChild(link1);

    const googleapisfonts = document.createElement("link");
    googleapisfonts.rel = "preconnect";
    googleapisfonts.href = "https://fonts.googleapis.com";
    document.getElementsByTagName("head")[0].appendChild(googleapisfonts);

    const googleapisfonts2 = document.createElement("link");
    googleapisfonts2.rel = "preconnect";
    googleapisfonts2.href = "https://fonts.gstatic.com";
    googleapisfonts2.crossOrigin = "anonymous";
    document.getElementsByTagName("head")[0].appendChild(googleapisfonts2);

    // Aguarda até que o <body> esteja disponível no DOM
    const body = await awaitElement("body");

    // Busca o primeiro elemento 'ul' dentro de '.box .menu'
    const firstMenu = document.querySelector('#ctl00_cphLeftColumn_ctl01_divLatestShows');

    if (firstMenu && firstMenu.parentNode) {
        // Cria uma nova div com a classe "box" e a insere imediatamente após 'firstMenu'
        const newBoxDiv = document.createElement('div');

        // Insere a nova div após 'firstMenu' no DOM
        firstMenu.parentNode.insertBefore(newBoxDiv, firstMenu.nextSibling);

        // Cria o root e renderiza o App dentro do novo <li>
        const root = createRoot(newBoxDiv);
        const artistId = getArtistId();
        store.dispatch(setArtistId(artistId));
        root.render(
            <Provider store={store}>
                <App />
            </Provider>
        );
    } 


}

// Chama `main()` sempre que a URL muda, incluindo no primeiro carregamento.
addLocationChangeCallback(() => {
    main().catch((e) => {
        
    });
});
