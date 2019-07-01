import React, { Component } from "react";
import { FuncionarioService, DependenteService } from "@intechprev/prevsystem-service";

import { Page } from "..";
import { CampoEstatico, Row, Col, Box } from "@intechprev/componentes-web";

interface Props {
}

interface State {
    dados: {
        Funcionario: any,
        DadosPessoais: any,
        Entidade: any,
        NOME_EMPRESA: string,
        SEXO: string,
        DS_ESTADO_CIVIL: string,
        CPF: string,
        IDADE: string,
        CEP: string
    },
    dependentes: any
}

export class DadosPessoais extends Component<Props, State> {

    private page = React.createRef<Page>();
    
    constructor(props: Props) {
        super(props);
        this.state = {
            dados: {
                Funcionario: {},
                DadosPessoais: {},
                Entidade: {},
                NOME_EMPRESA: "",
                SEXO: "",
                DS_ESTADO_CIVIL: "",
                CPF: "",
                IDADE: "",
                CEP: ""
            },
            dependentes: []
        };

    }

    async componentWillMount() {
        var dados = await FuncionarioService.Buscar();
        var dependentes = await DependenteService.Buscar();
        await this.setState({ 
            dados,
            dependentes
        });
        await this.page.current.loading(false);
    }

    render() {
        return (
            <Page {...this.props} ref={this.page}>
                {this.page.current && 
                    <Row>
                        <Col tamanho={"12"} className={"col-lg-6"}>
                            <Box titulo={"Dados Pessoais"}>
                            
                                <div className="form-row">
                                    <CampoEstatico titulo="Nome" valor={this.state.dados.Funcionario.NOME_ENTID} col="12" id="0" />
                                </div>

                                <div className="form-row">
                                    <CampoEstatico titulo="Empresa" valor={this.state.dados.NOME_EMPRESA} id="1" />
                                    <CampoEstatico titulo="Matrícula" valor={this.state.dados.Funcionario.NUM_MATRICULA} id="2" />
                                </div>

                                <div className="form-row">
                                    <CampoEstatico titulo="Sexo" valor={this.state.dados.SEXO} id="3" />
                                    <CampoEstatico titulo="Estado Civil" valor={this.state.dados.DS_ESTADO_CIVIL} id="4" />
                                </div>

                                <div className="form-row">
                                    <CampoEstatico titulo="RG" valor={this.state.dados.DadosPessoais.NU_IDENT} id="5" />
                                    <CampoEstatico titulo="Órgão Emissor RG" valor={this.state.dados.DadosPessoais.ORG_EMIS_IDENT} id="6" />
                                </div>
                                <div className="form-row">
                                    <CampoEstatico titulo="Emissão RG" valor={this.state.dados.DadosPessoais.DT_EMIS_IDENT} id="7" />
                                    <CampoEstatico titulo="CPF" valor={this.state.dados.CPF} col="6" id="8" />
                                </div>
                                <div className="form-row">
                                    <CampoEstatico titulo="Data de nascimento" valor={this.state.dados.DadosPessoais.DT_NASCIMENTO} id="9" />
                                    <CampoEstatico titulo="Idade" valor={this.state.dados.IDADE} id="10" />
                                </div>
                                <div className="form-row">
                                    <CampoEstatico titulo="Data de Admissão" valor={this.state.dados.Funcionario.DT_ADMISSAO} id="11" />
                                    <CampoEstatico titulo="Data de Recadastro" valor={this.state.dados.Funcionario.DT_RECADASTRO} id="12" />
                                </div>
                                <div className="form-row">
                                    <CampoEstatico titulo="Nome do Pai" valor={this.state.dados.DadosPessoais.NOME_PAI} id="13" />
                                    <CampoEstatico titulo="Nome da Mãe" valor={this.state.dados.DadosPessoais.NOME_MAE} id="14" />
                                </div>
                                <div className="form-row">
                                    {/* <CampoEstatico titulo="Contrato Único" valor={"Não Assinado"} id="15" /> */}
                                    <CampoEstatico titulo="E-mail" valor={this.state.dados.DadosPessoais.EMAIL_AUX} col="6" id="16" />
                                </div>

                            </Box>
                        </Col>
                        
                        <Col>
                            <Box titulo={"Endereço"}>
                                <div className="form-row">
                                    <CampoEstatico titulo="Endereço" valor={this.state.dados.Entidade.END_ENTID} id="17" />
                                    <CampoEstatico titulo="Número" valor={this.state.dados.Entidade.NR_END_ENTID} id="18" />
                                </div>
                                <div className="form-row">
                                    <CampoEstatico titulo="Complemento" valor={this.state.dados.Entidade.COMP_END_ENTID} id="19" />
                                    <CampoEstatico titulo="Bairro" valor={this.state.dados.Entidade.BAIRRO_ENTID} id="20" />
                                </div>
                                <div className="form-row">
                                    <CampoEstatico titulo="Cidade" valor={this.state.dados.Entidade.CID_ENTID} col="4" id="21" />
                                    <CampoEstatico titulo="UF" valor={this.state.dados.Entidade.UF_ENTID} col="2" id="22" />
                                    <CampoEstatico titulo="CEP" valor={this.state.dados.CEP} id="23" />
                                </div>
                            </Box>

                            <Box titulo={"Dados Bancários"}>
                                <div className="form-row">
                                    <CampoEstatico titulo="Banco" valor={this.state.dados.Entidade.NUM_BANCO} col="4" id="24" />
                                    <CampoEstatico titulo="Agência" valor={this.state.dados.Entidade.NUM_AGENCIA} col="4" id="25" />
                                    <CampoEstatico titulo="Conta" valor={this.state.dados.Entidade.NUM_CONTA} col="4" id="26" />
                                </div>

                                <div className="form-row">
                                </div>
                            </Box>

                            {
                                this.state.dependentes.length > 0 &&

                                <Box titulo={"Dependentes"}>
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th style={{width:"250"}}>Nome</th>
                                                <th>Sexo</th>
                                                <th style={{width:"150"}}>Data de Nascimento</th>
                                                <th style={{width:"150"}}>Grau de Parentesco</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.dependentes.map((dependente: any, index: number) => { 
                                                    return (
                                                        <tr key={index}>
                                                            <td>
                                                                {dependente.NOME_DEP}
                                                            </td>
                                                            <td>
                                                                {dependente.SEXO_DEP == "F" ? "FEMININO" : "MASCULINO"}
                                                            </td>
                                                            <td>
                                                                {dependente.DT_NASC_DEP}
                                                            </td>
                                                            <td>
                                                                {dependente.DS_GRAU_PARENTESCO}
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </Box>
                            }
                        </Col>
                    </Row>
                }
            </Page>
        );
    }
}
