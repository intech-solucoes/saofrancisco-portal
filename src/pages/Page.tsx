import React from "react";
import { Link } from "react-router-dom";

import { FuncionarioService, UsuarioService } from "@intechprev/prevsystem-service";
import { Row, Col } from "@intechprev/componentes-web";

import Rotas from "../Rotas";

interface Props {
    history?: any;
    titulo?: string;
}

interface State {
    nomeUsuario: string;
    loading: boolean;
    admin: boolean;
    menuAberto: boolean;
    sessaoExpirada: boolean;
    failure: boolean;
    exception: any;
}

export default class Page extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            nomeUsuario: "",
            loading: true,
            menuAberto: false,
            admin: false,
            sessaoExpirada: true,
            failure: false,
            exception: {}
        }
    }

    componentWillMount = async () => {
        try {

            var token = await localStorage.getItem("token");

            if (token) {
                var dados = await FuncionarioService.Buscar();
                var nomeUsuario = dados.DadosPessoais.NOME_ENTID;
                var { data: admin } = await UsuarioService.VerificarAdmin();

                await this.setState({
                    nomeUsuario,
                    admin
                });
                
            } else {
                localStorage.removeItem("token");
                localStorage.removeItem("token-admin");
                this.props.history.push("/login");
            }
        } catch (err) {
            if (err.message.indexOf("401") > -1) {
                localStorage.removeItem("token");
                localStorage.removeItem("token-admin");
                this.props.history.push("/login");
            } else {
                alert("Ops! Ocorreu um erro ao processar sua requisição.");
                console.error(err);
            }
        }

    }

    loading = async (valor: boolean) => {
        await this.setState({
            loading: valor
        });
    }

    // getRota() {
    //     var rota = window.location.pathname;
    //     for (var i = 0; i < Rotas.length; i++) {
    //         if (rota === Rotas[i].caminho)
    //             return Rotas[i].componente();
    //     }
    // }

    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("token-admin");
        this.props.history.push("/login");
    }

    render() {
        var Title = () => {
            if(this.props.titulo) {
                return <h2 id="titulo">{this.props.titulo}</h2>;
            } else {
                var rota = this.props.history.location.pathname;

                var titulo;

                for (var i = 0; i < Rotas.length; i++) {
                    if (rota === Rotas[i].caminho || rota === Rotas[i].caminho || rota.includes(Rotas[i].caminho)) {
                        titulo = <h2 id="titulo">{Rotas[i].titulo}</h2>;
                    }
                }

                return titulo;
        }
        };
        
        return (
            <div>
                <div style={{opacity: 0.5}} className="loader" hidden={!this.state.loading}>
                    <img style={{width: 300, height: 200}} src="./imagens/loading.gif" alt="loading" />
                </div>

                <div className="modal-sessao" hidden={!this.state.sessaoExpirada}>

                </div>
                
                <div className="wrapper">
                    <nav className={"navbar-default " + (this.state.menuAberto ? "nav-open" : "")}>
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
                                <a href="." onClick={this.logout}>
                                    <i className="fas fa-sign-out-alt"></i>
                                    Sair
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <button className={"btn btn-primary btn-menu-close " + (this.state.menuAberto ? "nav-open" : "")} onClick={() => this.setState({ menuAberto: false })}>
                        <i className="fas fa-times fa-3x"></i>
                    </button>

                    <div className={"page-wrapper " + (this.state.menuAberto ? "nav-open" : "")}>
                        <Row className="page-heading">
                        <Col tamanho={"1"} className={"btn-menu"}>
                                <button className="btn btn-primary" onClick={() => this.setState({ menuAberto: !this.state.menuAberto })}>
                                    <i className="fa fa-bars"></i>
                                </button>
                            </Col>

                            <Col>
                                <Title />
                            </Col>

                            <Col tamanho={"4"} className={"col-lg-4 col-6 text-right user-icon"}>
                                <Row>
                                    <Col className={"nome-usuario d-sm-none d-none d-sm-block"}>
                                        {this.state.nomeUsuario}

                                        {this.state.admin &&
                                            <span>
                                                <Link to={"/listarParticipantes"} className={"icon"} style={{ marginLeft: 10, marginRight: 10 }}>
                                                    <i className={"fas fa-user-friends"}></i>
                                                </Link>
                                                <Link to={"/admin"} className={"icon"}>
                                                    <i className={"fas fa-lock"}></i>
                                                </Link>
                                            </span>
                                        }
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <div className="wrapper-content">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
