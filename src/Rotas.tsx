import React from 'react';
import { RouteProps, Route } from 'react-router-dom';

import {
    Login, EsqueciSenha, Home, DadosPessoais, Relacionamento, TrocarSenha, Planos, ListarParticipantes, InformeRendimentos,
    PlanoDetalhes, Contracheque, ContrachequeDetalhe, Documentos
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
            titulo: "Seus Planos",
            icone: "fas fa-list",
            caminho: "/planos",
            componente: (routeProps: RouteProps) => <Planos {...routeProps} />, 
            mostrarMenu: true, 
            exact: true,
            id: "planos"
        },
        {
            titulo: "Detalhes do Plano",
            icone: "fas fa-list",
            caminho: "/planos/:plano",
            caminhoLink: "/planos/",
            componente: (routeProps: RouteProps) => <PlanoDetalhes {...routeProps} />,
            mostrarMenu: false, 
            exact: true
        },
        {
            titulo: "Contracheque",
            icone: "fas fa-closed-captioning",
            caminho: "/contracheque",
            componente: (routeProps: RouteProps) => <Contracheque {...routeProps} />,
            mostrarMenu: true,
            exact: true,
            id: "contracheque"
        },
        {
            titulo: "Inf. Rendimentos",
            icone: "fas fa-chart-pie",
            caminho: "/infoRend",
            componente: (routeProps: RouteProps) => <InformeRendimentos {...routeProps} />,
            mostrarMenu: true,
            exact: true,
            id: "informeRendimentos"
        },
        {
            titulo: "Contracheque Detalhe",
            icone: "fas fa-closed-captioning",
            caminho: "/contracheque/:plano/:data",
            caminhoLink: "/contracheque/",
            componente: (routeProps: RouteProps) => <ContrachequeDetalhe {...routeProps} />,
            mostrarMenu: false, 
            exact: true
        },
        {
            titulo: "Documentos",
            icone: "fas fa-file",
            caminho: "/documentos/:pasta?",
            caminhoLink: "/documentos/",
            componente: (routeProps: RouteProps) => <Documentos {...routeProps} />,
            mostrarMenu: true,
            id: "documentos"
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
            titulo: "Listar Participantes",
            caminho: "/listarParticipantes",
            componente: (routeProps: RouteProps) => <ListarParticipantes {...routeProps} />,
            mostrarMenu: false,
            exact: false,
            id: "listarParticipantes"
        }
    ];

    return rotas;
}

export default GetRotas();