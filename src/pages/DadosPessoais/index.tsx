import React, { Component } from "react";
import { FuncionarioService } from "@intechprev/prevsystem-service";

import { Page } from "..";
import { CampoEstatico, Row, Col, Box } from "@intechprev/componentes-web";

interface Props {
}

interface State {
    dados: any;
}

export class DadosPessoais extends Component<Props, State> {

    private page = React.createRef<Page>();
    
    constructor(props: Props) {
        super(props);
        this.state = {
            dados: {
                Funcionario: {},
                DadosPessoais: {},
                Entidade: {}
            }
        };

    }

    async componentWillMount() {
        var { data: dados } = await FuncionarioService.Buscar();
        console.log(dados);
        await this.setState({ dados });
        
        await this.page.current.loading(false);
    }

    render() {
        return (
            <Page {...this.props} ref={this.page}>
                {this.page.current && 
                    <Row>
                        <Col>
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

                                <hr />

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
                                <br />

                            </Box>
                        </Col>
                    </Row>
                }
            </Page>
        );
    }
}
