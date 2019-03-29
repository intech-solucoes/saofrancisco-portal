import React from 'react';
import { RouteProps } from 'react-router-dom';

import {
    Login, EsqueciSenha, Home, DadosPessoais, Relacionamento, TrocarSenha, Planos
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
        },
        {
            titulo: "Home",
            icone: "fas fa-home",
            caminho: "/",
            componente: (routeProps: RouteProps) => <Home {...routeProps} />,
            mostrarMenu: true,
            exact: true,
            id: "home"
        },
        {
            titulo: "Seus Dados",
            icone: "fas fa-user",
            caminho: "/dados",
            componente: (routeProps: RouteProps) => <DadosPessoais {...routeProps} />,
            mostrarMenu: true,
            id: "dadosPessoais"
        },
        {
            titulo: "Relacionamento",
            icone: "fas fa-envelope",
            caminho: "/relacionamento",
            componente: (routeProps: RouteProps) => <Relacionamento {...routeProps} />,
            mostrarMenu: true,
            id: "relacionamento"
        },
        {
            titulo: "Trocar senha",
            icone: "fas fa-lock",
            caminho: "/trocarSenha",
            componente: (routeProps: RouteProps) => <TrocarSenha {...routeProps} />,
            mostrarMenu: true,
            id: "trocarSenha"
        },
        {
            titulo: "Seus Planos",
            icone: "fas fa-list",
            caminho: "/planos",
            componente: (routeProps: RouteProps) => <Planos {...routeProps} />, 
            mostrarMenu: true, 
            exact: true,
            id: "planos"
        },
    ];

    return rotas;
}

export default GetRotas();