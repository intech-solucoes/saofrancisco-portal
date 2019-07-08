import React from 'react';

import {
    Home,
    Documentos,
    MensagemNova
} from "./";
import { RouteProps } from 'react-router';

function GetRotas() {
    const rotas = [
        {
            titulo: "Home",
            icone: "fas fa-home",
            caminho: "/admin",
            componente: (routeProps: RouteProps) => <Home {...routeProps} />,
            mostrarMenu: true,
            exact: true,
            id: "home"
        },
        {
            titulo: "Documentos",
            icone: "fas fa-file",
            caminho: "/admin/documentos/:pasta?",
            caminhoLink: "/admin/documentos/",
            componente: (routeProps: RouteProps) => <Documentos {...routeProps} />,
            mostrarMenu: true,
            id: "documentos"
        },
        {
            titulo: "Nova Mensagem",
            icone: "fas fa-envelope",
            caminho: "/mensagem/nova",
            componente: (routeProps: RouteProps) => <MensagemNova {...routeProps} />,
            mostrarMenu: true,
            exact: true,
            id: "novaMensagem"
        }
    ];

    return rotas;
} 


export default GetRotas();