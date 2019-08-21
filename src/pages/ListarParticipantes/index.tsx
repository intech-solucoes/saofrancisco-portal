import React, { Component } from 'react';
import { Row, Col, Box, Form, CampoTexto, Botao, TipoBotao, TamanhoBotao } from '@intechprev/componentes-web';

import { FuncionarioService, UsuarioService } from "@intechprev/prevsystem-service";
import { func } from 'prop-types';

interface Props {
    history?: any;
}

interface State {
    matricula: string,
    nome: string,
    resultadoPesquisa: any
}

export class ListarParticipantes extends Component<Props, State> {

    private form = React.createRef<Form>();

    constructor(props: Props) {
        super(props)

        this.state = {
            matricula: "",
            nome: "",
            resultadoPesquisa: []
        };
    };

    pesquisar = async () => {
        var resultadoPesquisa = await FuncionarioService.Pesquisar(null, null, null, null, this.state.matricula, this.state.nome);
        await this.setState({ resultadoPesquisa });
    }

    selecionar = async (cpf: string, cdPlano: string) => {
        try {
            var login = await UsuarioService.SelecionarParticipante(cpf);
            await localStorage.setItem("token", login.AccessToken);
                        
            var dados = await FuncionarioService.Buscar();

            await localStorage.setItem("fundacao", dados.Funcionario.CD_FUNDACAO);
            await localStorage.setItem("empresa", dados.Funcionario.CD_EMPRESA);
            await localStorage.setItem("pensionista", login.Pensionista.toString());

            this.props.history.push(`/`);
            //document.location.href = '.';
        } catch(e) {
            alert(e.response.data);
        }
    }

    render() {
        return (
            <Row className={"mt-5 ml-5 mr-5"}>
                <Col>
                    <Box titulo={"Listagem de Participantes"}>

                        <Form ref={this.form}>

                            <CampoTexto contexto={this} nome={"matricula"} placeholder={"Matricula"} valor={this.state.matricula} />
                            <CampoTexto contexto={this} nome={"nome"} placeholder={"Nome"} valor={this.state.nome} />
                            <Botao titulo={"Procurar"} tipo={TipoBotao.primary} submit onClick={this.pesquisar} />

                        </Form>

                        {this.state.resultadoPesquisa.length > 0 && 
                            <div>
                                <br/>

                                <table className={"table table-hover"}>
                                    <thead>
                                        <tr>
                                            <th style={{ width: "1px" }}></th>
                                            <th>Nome</th>
                                            <th>Matrícula</th>
                                            <th>CPF</th>
                                            <th>Empresa</th>
                                            <th>Plano</th>
                                            <th></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {this.state.resultadoPesquisa.map((func: any, index: number) => {
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        {func.PENSIONISTA === "S" && 
                                                            <div className={"badge badge-success"}>PENSIONISTA</div>
                                                        }
                                                    </td>
                                                    <td>{func.NOME_ENTID}</td>
                                                    <td>{func.NUM_MATRICULA}</td>
                                                    <td>{func.CPF_CGC}</td>
                                                    <td>{func.CD_EMPRESA}</td>
                                                    <td>{func.CD_PLANO}</td>
                                                    <td>
                                                        <Botao titulo={"Selecionar"} tipo={TipoBotao.primary} tamanho={TamanhoBotao.pequeno}
                                                               onClick={async () => await this.selecionar(func.CPF_CGC, func.CD_PLANO)} />
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        }

                        {this.state.resultadoPesquisa.length < 0 && 
                            <div className={"alert alert-danger"}>A pesquisa não retornou resultados</div>
                        }
                    </Box>
                </Col>
            </Row>
        );
    }

}