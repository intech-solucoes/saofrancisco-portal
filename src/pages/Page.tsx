import React from "react";
import { Link } from "react-router-dom";

import { Session } from "@intechprev/service";
import { FuncionarioService, LGPDService } from "@intechprev/prevsystem-service";
import { PlanoService, FuncionalidadeService, UsuarioService } from "./../services";
import { Row, Col, Alerta, TipoAlerta } from "@intechprev/componentes-web";

import Rotas from "../Rotas";

import config from "../config.json";
import { format } from "url";

export enum NumFuncionalidade {
  "HOME_ATIVOS_E_AUTOPATROCINADOS" = 1,
  "HOME_ASISSTIDOS" = 2,
  "HOME_PENSIONISTAS" = 3,
  "SEUS_DADOS" = 4,
  "SEUS_PLANOS" = 5,
  "EXTRATO" = 6,
  "CONTRACHEQUE_ASISSTIDOS_PENSIONISTAS" = 7,
  "INFORME_DE_RENDIMENTOS_ASSISTIDOS_PENSIONISTAS" = 8,
  "DOCUMENTOS" = 9,
  "FALE_CONOSCO_MENSAGENS" = 10,
  "FORMULARIOS" = 11,
  "SIMULADOR_DE_BENEFÍCIOS_CODEPREV" = 12,
  "EMPRESTIMOS_CONSULTA" = 13,
  "EMPRESTIMOS_SIMULAÇÃO" = 14,
  "EMPRESTIMOS_CONTRATAÇÃO" = 15
}

interface Props {
  Funcionalidade?: NumFuncionalidade;
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
  motivoBloqueio: string;
  filteredRoutes: Array<any>;
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
      exception: {},
      motivoBloqueio: "Aguarde enquanto o sistema carrega as informaformações.",
      filteredRoutes: []
    }
  }

  componentWillMount = async () => {
    try {

      var token = await localStorage.getItem(`@${config.appName}:token`);

      if (token) {
        var { data: admin } = await UsuarioService.VerificarAdmin();
        var termo = await LGPDService.Buscar();

        if (!termo && !admin) {
          this.props.history.push('/termos');
        } else {
          var dados = await FuncionarioService.Buscar();
          var nomeUsuario = dados.DadosPessoais ? dados.DadosPessoais.NOME_ENTID : dados.Funcionario.NOME_ENTID;

          if (!admin && dados.Usuario && dados.Usuario.IND_PRIMEIRO_ACESSO === "S") {
            setTimeout(() => this.props.history.push('/trocarSenhaPrimeiroAcesso'), 500);
          } else {
            await this.buscarBloqueio();

            var menu = await UsuarioService.Menu();
            var filteredRoutes = Rotas.filter((a) => menu.indexOf(a.id) > -1);

            await this.setState({
              nomeUsuario,
              admin,
              filteredRoutes
            });
          }
        }

      } else {
        await this.logout();
      }
    } catch (err) {
      if (err.message.indexOf("401") > -1) {
        await this.logout();
      } else {
        alert("Ops! Ocorreu um erro ao processar sua requisição.");
        console.error(err);
      }
    }

  }

  buscarBloqueio = async () => {
    if (this.props.Funcionalidade) {
      const planos = await PlanoService.Buscar();
      const cdPlanos = [];
      if (planos.length > 0) {
        /* Código do plano do participante logado. */
        cdPlanos.push(planos[0].CD_PLANO);
        /* Código do segundo plano do participante logado (repetir o primeiro caso só tenha um plano). */
        cdPlanos.push(planos.length > 1 ? planos[1].CD_PLANO : cdPlanos[0]);
        /* Código do terceiro plano do participante logado (repetir o segundo caso só tenha um ou dois planos ) */
        cdPlanos.push(planos.length > 2 ? planos[2].CD_PLANO : cdPlanos[1]);
      }
      else {
        cdPlanos.push("0000");
        cdPlanos.push("0000");
        cdPlanos.push("0000");
      }

      const motivoBloqueio = await FuncionalidadeService.BuscarBloqueiosPorNumFuncionalidade(this.props.Funcionalidade, cdPlanos[0], cdPlanos[1], cdPlanos[2]);

      this.setState({ motivoBloqueio });

    }
    else
      this.setState({ motivoBloqueio: "" });
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

  logout = async () => {
    await Session.clear();
    this.props.history.push("/login");
  }

  renderChildren = () => {
    return (this.state.motivoBloqueio === "" ?
      this.props.children :
      <Alerta mensagem={this.state.motivoBloqueio} tipo={TipoAlerta.danger} />
    );
  }

  render() {
    var Title = () => {
      if (this.props.titulo) {
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
        <div style={{ opacity: 0.5 }} className="loader" hidden={!this.state.loading}>
          <img style={{ width: 300, height: 200 }} src="./imagens/loading.gif" alt="loading" />
        </div>

        <div className="modal-sessao" hidden={!this.state.sessaoExpirada}>

        </div>

        <div className="wrapper">
          <nav className={"navbar-default " + (this.state.menuAberto ? "nav-open" : "")}>
            <ul>
              <li className="navbar-header">
                <img src="imagens/logo.png" alt="logo" />
              </li>
              {this.state.filteredRoutes.length === 0 && <li><div className={"text-center"}>Carregando Menu...</div></li>}
              {
                this.state.filteredRoutes.map((rota, index) => {
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

              <Col tamanho={"5"} className={"col-lg-5 col-6 text-right user-icon"}>
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
              {this.renderChildren()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
