import React from 'react';

import {
    Home,
    Documentos,
    MensagemNova,
    BloquearFuncionalidade
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
        },
        {
            titulo: "Bloquear Funcionalidades",
            icone: "fas fa-ban",
            caminho: "/admin/bloquear",
            componente: (routeProps: RouteProps) => <BloquearFuncionalidade {...routeProps} />,
            mostrarMenu: true,
            exact: true,
            id: "bloquear"
        }
    ];

    return rotas;
} 


export default GetRotas();