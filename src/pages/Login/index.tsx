import React from "react";
import packageJson from '../../../package.json';

import { PageClean } from "../";

import { Alerta, TipoAlerta, Row, Col } from "@intechprev/componentes-web";
import { handleFieldChange } from "@intechprev/react-lib";
import { UsuarioService, FuncionarioService } from "@intechprev/prevsystem-service";
import { Link } from "react-router-dom";

import EsqueciSenha from "./EsqueciSenha";
import Termos from "./Termos";
import TrocarSenhaPrimeiroAcesso from "./TrocarSenhaPrimeiroAcesso";

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
            
            await localStorage.setItem("token", login.AccessToken);
            await localStorage.setItem("token-admin", login.AccessToken);
            await localStorage.setItem("pensionista", login.Pensionista.toString());

            var matriculas = await UsuarioService.BuscarMatriculas();
            
            if(matriculas.length > 1) {
                await this.setState({
                    matriculas,
                    loginFeito: true
                });
            } else {
                this.props.history.push('/');
            }

            //this.props.history.push('/');
            
            //document.location.href = ".";
        } catch(erro) {
            if(erro.response) {
                //await this.loginForm.current.mostrarErro(erro.response.data);
                await this.setState({ erro: erro.response.data });
            } else {
                //await this.loginForm.current.mostrarErro(erro);
                //alert("Ocorreu um erro ao processar sua requisição!");
                await this.setState({ erro });
            }
        } finally {
            await this.setState({ loading: false });
        }
    }

    selecionar = async (matricula: string) => {
        var funcionarioResult = await FuncionarioService.Buscar();
        await localStorage.setItem("fundacao", funcionarioResult.Funcionario.CD_FUNDACAO);
        await localStorage.setItem("empresa", funcionarioResult.Funcionario.CD_EMPRESA);

        var funcionarioLogin = await UsuarioService.SelecionarMatricula(matricula);
        await localStorage.setItem("token", funcionarioLogin.AccessToken);
        await localStorage.setItem("admin", funcionarioLogin.Admin);

        this.props.history.push('/');
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

                            <br/>
                            <br/>

                            {this.state.matriculas.map((matricula, index) => {
                                return (
                                    <Row key={index} className={"mb-3"}>
                                        <Col>
                                            <div className="matricula-card" onClick={() => this.selecionar(matricula)}>
                                                <Row>
                                                    <Col>
                                                        <b>Matrícula: </b><label style={{fontSize: 15}}>{matricula}</label><br/>
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
                
                <br/>
                <br/>
                <div className="text-center">
                    Versão {packageJson.version}
                </div>
            </PageClean>
        );
    }
}