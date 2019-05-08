import React, { Component, RefObject } from 'react'
import { Link } from "react-router-dom";

import { Row, Col } from "@intechprev/componentes-web";

import Rotas from "./Rotas";

interface Props {
    history?: any;
    ref: RefObject<PageAdmin>;
}

export default class PageAdmin extends Component<Props> {

    constructor(props: Props) {
        super(props);

        this.state = {
            nomeUsuario: "Teste"
        }
    }

    logout = async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("token-admin");
        this.props.history.push("login");
    }

    loading = async (valor: boolean) => {
        await this.setState({
            loading: valor
        });
    }

    toggleMenu = async () => {

    }
    
    render() {
        
        var Title = () => {
            var rota = this.props.history.location.pathname;
            
            var titulo;

            for(var i = 0; i < Rotas.length; i++) {
                if(rota === Rotas[i].caminho || rota === Rotas[i].caminhoLink || rota.includes(Rotas[i].caminhoLink)) {
                    titulo = <h2 id="titulo">{Rotas[i].titulo}</h2>;
                }
            }

            return titulo;
        };
        
        return (
            <div className="wrapper">
                <nav className="navbar-default nav-open">
                    <ul>
                        <li className="navbar-header">
                            <img src="imagens/logo.png" alt="logo" />
                        </li>
                        {
                            Rotas.map((rota, index) => {
                                var link = rota.caminhoLink ? rota.caminhoLink : rota.caminho;

                                if (rota.mostrarMenu) {
                                    return (
                                        <li key={index} id={rota.id}>
                                            <Link to={link}>
                                                <i className={rota.icone}></i>
                                                {rota.titulo}
                                            </Link>
                                        </li>
                                    );
                                }
                                else return "";
                            })
                        }
                        <li>
                            <a href="." onClick={() => this.props.history.push("/")}>
                                <i className="fas fa-sign-out-alt"></i>
                                Sair do admin
                            </a>
                        </li>
                    </ul>
                </nav>

                <div className="page-wrapper nav-open">
                    <Row className="page-heading">
                        <Col>
                            <button className="btn btn-primary btn-menu" onClick={this.toggleMenu}>
                                <i className="fa fa-list"></i>
                            </button>

                            <Title />
                        </Col>
                    </Row>

                    <div className="wrapper-content">
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
}