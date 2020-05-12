import React from "react";
import { History } from 'history';
import { Box, CampoEstatico, TipoCampoEstatico, Botao, TipoBotao } from "@intechprev/componentes-web";
import { SimuladorCodeprevService, UsuarioService } from "@intechprev/prevsystem-service";

import { Page } from "..";

interface RendaMensal {
    Percentual: number;
    Renda: number;
    StringTempoRecebimento: string;
}

interface Props {
    location?: any;
    history?: History;
    navigation?: any;
}

interface State {
    idadeAtual: number;
    idadeAposentadoria: number;
    saldoProjetado: number;
    valorResgate: number;
    rendaMensal: Array<RendaMensal>;
    memoria: Array<any>;
    admin: boolean;
}

export default class Maior8 extends React.Component<Props, State> {

    private page = React.createRef<Page>();

    state: State = {
        admin: false,
        idadeAtual: 0,
        idadeAposentadoria: 0,
        saldoProjetado: 0,
        valorResgate: 0,
        memoria: [],
        rendaMensal: []
    }

    componentWillMount = async () => {
        this.load();
        //this.props.navigation.addListener('willFocus', this.load);
    }

    load = async () => {
        console.log({ aporte: this.props.location.state.aporte });
        if (!this.props.location.state) {
            this.props.history.goBack();
        }
        else {
            var { data: admin } = await UsuarioService.VerificarAdmin();

            var dados = {
                IdadeAposentadoria: this.props.location.state.idadeAposentadoria,
                PercentualContrib: this.props.location.state.percentualContrib,
                PercentualSaque: this.props.location.state.percentualAVista,
                Aporte: this.props.location.state.aporte,
                SaldoAcumulado: this.props.location.state.saldoAcumulado,
                SalarioContribuicao: this.props.location.state.salarioContribuicao
            };

            var dadosSimulacao = await SimuladorCodeprevService.Simular(dados);

            await this.setState({
                admin,
                idadeAtual: this.props.location.state.idadeAtual,
                idadeAposentadoria: this.props.location.state.idadeAposentadoria,
                saldoProjetado: dadosSimulacao.SaldoProjetado,
                valorResgate: dadosSimulacao.Saque,
                rendaMensal: dadosSimulacao.RendaMensal,
                memoria: dadosSimulacao.MemoriaCalculo
            });

            await this.page.current.loading(false);
        }
    }

    memoria = async () => {

    }

    render() {
        return (
            <Page {...this.props} ref={this.page}>
                <Box titulo={"Resultados"}>
                    <h2>Importante!</h2>
                    <h5 className={"mb-5 mt-3"}>
                        Todos os valores desta simulação foram apurados considerando as informações por você fornecidas.
                        As rentabilidades e benefícios projetados são unicamente referências, não constituindo nenhuma garantia
                        por parte da Fundação São Francisco.
                    </h5>

                    <h4 className={"mt-5 mb-2"}>Idade Atual</h4>
                    <h5 className={"text-secondary"}><CampoEstatico valor={this.state.idadeAtual} /></h5>

                    <h4 className={"mt-5 mb-2"}>Idade na Aposentadoria</h4>
                    <h5 className={"text-secondary"}><CampoEstatico valor={this.state.idadeAposentadoria} /></h5>

                    <h4 className={"mt-5 mb-2"}>Saldo Projetado Acumulado</h4>
                    <h5 className={"text-secondary"}><CampoEstatico valor={this.state.saldoProjetado} tipo={TipoCampoEstatico.dinheiro} /></h5>

                    <h4 className={"mt-5 mb-2"}>Valor do Resgate à Vista</h4>
                    <h5 className={"text-secondary"}><CampoEstatico valor={this.state.valorResgate} tipo={TipoCampoEstatico.dinheiro} /></h5>

                    <h4 className={"mt-5 mb-2"}>Renda Mensal Inicial</h4>
                    <h5 className={"mb-5 mt-3"}>
                        Os Benefícios sob a forma de renda mensal corresponderão ao valor obtido pela aplicação de um percentual,
                        de até 1,5% (um e meio por cento), do Saldo de Conta Aplicável existente ao final do mês de referência do benefício.
                    </h5>

                    <table className={"table table-striped table-sm"}>
                        <thead>
                            <tr>
                                <th>Percentual</th>
                                <th>Renda Mensal</th>
                                <th>Tempo de Recebimento (13 parcelas anuais)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.rendaMensal.map((rendaMensal: RendaMensal, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{rendaMensal.Percentual}%</td>
                                        <td><CampoEstatico valor={rendaMensal.Renda} tipo={TipoCampoEstatico.dinheiro} /></td>
                                        <td>{rendaMensal.StringTempoRecebimento}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <br /><br />
                    <Botao titulo={"Nova Simulação"} tipo={TipoBotao.primary} submit onClick={() => this.props.history.goBack()} />
                </Box>
                {this.state.admin &&
                    <Box titulo={"Memória de Cálculo"}>
                        {this.state.memoria.map((item, index) => {
                            return (
                                <>
                                    <b>{item.Key}</b>:
                                    <br />
                                    {item.Value}<br /><br />
                                </>
                            );
                        })}
                    </Box>
                }
            </Page>
        );
    }
}