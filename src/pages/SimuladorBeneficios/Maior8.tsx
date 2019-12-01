import React from "react";
import { History } from 'history';
import { Box, CampoEstatico, TipoCampoEstatico, Botao, TipoBotao } from "@intechprev/componentes-web";

import { Page } from "..";

interface RendaMensal {
    percentual: number;
    renda: number;
    tempoRecebimento: string;
}

interface Props {
    location?: any;
    history?: History;
}

interface State {
    idadeAtual: number;
    idadeAposentadoria: number;
    saldoProjetado: number;
    valorResgate: number;
    rendaMensal: Array<RendaMensal>;
}

export default class Maior8 extends React.Component<Props, State> {

    private page = React.createRef<Page>();

    state: State = {
        idadeAtual: 0,
        idadeAposentadoria: 0,
        saldoProjetado: 0,
        valorResgate: 0,
        rendaMensal: [
            { percentual: 0.1, renda: 1306.44, tempoRecebimento: "83 anos 3 meses" },
            { percentual: 0.2, renda: 1306.44, tempoRecebimento: "83 anos 3 meses" },
            { percentual: 0.3, renda: 1306.44, tempoRecebimento: "83 anos 3 meses" },
            { percentual: 0.4, renda: 1306.44, tempoRecebimento: "83 anos 3 meses" },
            { percentual: 0.5, renda: 1306.44, tempoRecebimento: "83 anos 3 meses" },
        ]
    }

    componentDidMount = async () => {
        await this.setState({
            idadeAtual: this.props.location.state.idadeAtual,
            idadeAposentadoria: this.props.location.state.idadeAposentadoria
        });

        await this.page.current.loading(false);
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
                                        <td>{rendaMensal.percentual}%</td>
                                        <td><CampoEstatico valor={rendaMensal.renda} tipo={TipoCampoEstatico.dinheiro} /></td>
                                        <td>{rendaMensal.tempoRecebimento}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <br /><br />
                    <Botao titulo={"Nova Simulação"} tipo={TipoBotao.primary} submit onClick={() => this.props.history.goBack()} />
                </Box>
            </Page>
        );
    }
}