import React from 'react';
import { RouteProps, Route } from 'react-router-dom';

import {
    Login, EsqueciSenha, Home, DadosPessoais, Relacionamento, TrocarSenha, Planos, ListarParticipantes, InformeRendimentos,
    SimuladorBeneficios,
    Contracheque, ContrachequeDetalhe, Documentos, Mensagens, Maior8, Menor8
} from "./pages";
import { Termos, TrocarSenhaPrimeiroAcesso } from './pages/Login';

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
            titulo: "Termos",
            caminho: "/termos",
            componente: (routeProps: RouteProps) => <Termos {...routeProps} />,
            mostrarMenu: false,
            exact: false,
            id: ""
        },
        {
            titulo: "Trocar Senha",
            caminho: "/trocarSenhaPrimeiroAcesso",
            componente: (routeProps: RouteProps) => <TrocarSenhaPrimeiroAcesso {...routeProps} />,
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
            id: "dados"
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
            titulo: "Simulador",
            icone: "fas fa-chart-bar",
            caminho: "/simulador",
            componente: (routeProps: RouteProps) => <SimuladorBeneficios {...routeProps} />,
            mostrarMenu: true, 
            exact: true,
            id: "simulador"
        },
        {
            titulo: "Simulador de Benefícios - CODEPREV",
            icone: "fas fa-chart-bar",
            caminho: "/simulador/menor8",
            componente: (routeProps: RouteProps) => <Menor8 {...routeProps} />,
            mostrarMenu: false, 
            exact: true,
            id: "simuladorMenor8"
        },
        {
            titulo: "Simulador de Benefícios - CODEPREV",
            icone: "fas fa-chart-bar",
            caminho: "/simulador/maior8",
            componente: (routeProps: RouteProps) => <Maior8 {...routeProps} />,
            mostrarMenu: false, 
            exact: true,
            id: "simuladorMaior8"
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
            caminho: "/contracheque/:plano/:data/:cdTipoFolha/:cdEspecie",
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
            id: "documentos",
            exact: true
        },
        {
            titulo: "Mensagens",
            icone: "fas fa-envelope",
            caminho: "/mensagens",
            componente: (routeProps: RouteProps) => <Mensagens {...routeProps} />,
            mostrarMenu: true,
            id: "mensagens"
        },
        {
            titulo: "Relacionamento",
            icone: "fas fa-comment-alt",
            caminho: "/relacionamento",
            componente: (routeProps: RouteProps) => <Relacionamento {...routeProps} />,
            mostrarMenu: true,
            id: "relacionamento"
        },
        {
            titulo: "Trocar senha",
            icone: "fas fa-key",
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