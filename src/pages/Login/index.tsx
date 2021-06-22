import React from "react";
import packageJson from '../../../package.json';

import { PageClean } from "../";

import { Alerta, TipoAlerta, Row, Col } from "@intechprev/componentes-web";
import { handleFieldChange } from "@intechprev/react-lib";
import { Session } from "@intechprev/service";
import { UsuarioService, FuncionarioService } from "@intechprev/prevsystem-service";
import { Link } from "react-router-dom";

import EsqueciSenha from "./EsqueciSenha";
import Termos from "./Termos";
import TrocarSenhaPrimeiroAcesso from "./TrocarSenhaPrimeiroAcesso";

import config from "../../config.json";

export {
  EsqueciSenha,
  Termos,
  TrocarSenhaPrimeiroAcesso
}

interface Props {
  history?: any;
}

interface State {
  cpf: string;
  senha: string;
  loading: boolean;
  mensagem: string;
  erro: string;
  loginFeito: boolean;
  matriculas: Array<string>;
}

export default class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      cpf: "",
      senha: "",
      loading: false,
      mensagem: "",
      erro: "",
      loginFeito: false,
      matriculas: []
    }
  }

  onSubmit = async (e: any) => {
    e.preventDefault();

    await this.setState({ erro: "", loading: true });

    try {
      var login = await UsuarioService.Login(this.state.cpf, this.state.senha);

      await Session.setToken(login.AccessToken);
      await localStorage.setItem("pensionista", login.Pensionista.toString());

      var matriculas = await UsuarioService.BuscarMatriculas();

      if (matriculas.length > 1) {
        await this.setState({
          matriculas,
          loginFeito: true
        });
      } else {
        this.selecionar(matriculas[0]);
      }
    } catch (erro) {
      await this.setState({ erro: (erro.response ? erro.response.data : erro) });
    } finally {
      await this.setState({ loading: false });
    }
  }

  selecionar = async (matricula: string) => {
    try {
      var funcionarioResult = await FuncionarioService.Buscar();

      // if (funcionarioResult.Funcionario) {
      //   await localStorage.setItem("fundacao", funcionarioResult.Funcionario.CD_FUNDACAO);
      //   await localStorage.setItem("empresa", funcionarioResult.Funcionario.CD_EMPRESA);
      // }
      // else {
      await localStorage.setItem("fundacao", funcionarioResult.CD_FUNDACAO);
      await localStorage.setItem("empresa", funcionarioResult.CD_EMPRESA);
      // }

      var funcionarioLogin = await UsuarioService.SelecionarMatricula(matricula);

      await Session.setToken(funcionarioLogin.AccessToken);
      await localStorage.setItem("pensionista", funcionarioLogin.Pensionista.toString());

      this.props.history.push('/');
    } catch (erro) {
      await this.setState({ erro: (erro.response ? erro.response.data : erro) });
    }
  }

  render() {
    return (
      <PageClean {...this.props}>
        <h4>Bem vindo ao portal da São Francisco</h4>

        <h5>
          <b>Área de Acesso Restrito</b><br />
          <small>Para informações, entre em contato com a <a href="http://www.franweb.com.br/contact.html">São Francisco</a></small><br />
          <br />
        </h5>

        <form>
          {!this.state.loginFeito &&
            <div>
              <div className="form-group">
                <input name="cpf" id="cpf" placeholder="CPF (somente números)" className="form-control" value={this.state.cpf} onChange={(e) => handleFieldChange(this, e)} />
              </div>

              <div className="form-group">
                <input name="senha" id="senha" placeholder="Senha" type="password" className="form-control" value={this.state.senha} onChange={(e) => handleFieldChange(this, e)} />
              </div>

              <div className="form-group">
                <button id="entrar" className="btn btn-block btn-primary" onClick={this.onSubmit} disabled={this.state.loading}>
                  {!this.state.loading &&
                    <span>Entrar</span>}

                  {this.state.loading &&
                    <i className="fas fa-spinner fa-pulse"></i>}
                </button>
              </div>

              {this.state.mensagem !== "" && <Alerta tipo={TipoAlerta.info} mensagem={this.state.mensagem} />}
              {this.state.erro !== "" && <Alerta tipo={TipoAlerta.danger} mensagem={this.state.erro} />}

              <div className="form-group">
                <Link className="btn btn-link" id="esqueciSenha" to="/esqueciSenha">Esqueci Minha Senha / Primeiro Acesso</Link>
              </div>
            </div>
          }

          {this.state.loginFeito &&
            <div>
              <h5><b>Selecione uma matrícula:</b></h5>

              <br />
              <br />

              {this.state.matriculas.map((matricula, index) => {
                return (
                  <Row key={index} className={"mb-3"}>
                    <Col>
                      <div className="matricula-card" onClick={() => this.selecionar(matricula)}>
                        <Row>
                          <Col>
                            <b>Matrícula: </b><label style={{ fontSize: 15 }}>{matricula}</label><br />
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                )
              })}
            </div>
          }
        </form>

        <br />
        <br />
        <div className="text-center">
          Versão {packageJson.version}
        </div>
      </PageClean>
    );
  }
}