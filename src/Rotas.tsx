import React from 'react';
import { RouteProps } from 'react-router-dom';

import {
    Login, EsqueciSenha
} from "./pages";

function GetRotas() {
    const rotas = [
        {
            titulo: "Login",
            caminho: "/login",
            componente: (routeProps: RouteProps) => <Login {...routeProps} />,
            mostrarMenu: false,
            exact: false,
            id: "",
            icone: ""
        },
        {
            titulo: "Esqueci Minha Senha",
            caminho: "/esqueciSenha",
            componente: (routeProps: RouteProps) => <EsqueciSenha {...routeProps} />,
            mostrarMenu: false,
            exact: false,
            id: ""
        }
    ];

    return rotas;
}

export default GetRotas();