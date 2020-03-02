import React from "react";
import { Row, Col, Box, CampoEstatico, TipoCampoEstatico, Alerta, TipoAlerta } from "@intechprev/componentes-web";
import { HomeCard } from "./HomeCard";
import { PlanoService, CalendarioPagamentoService, FichaFinanceiraAssistidoService, ProcessoBeneficioService } from "@intechprev/prevsystem-service";

interface Props {
    page: any;
    processo?: any;
}

interface State {
    planos: Array<any>;
    ultimaFolha: any;
    dataAposentadoria: any;
    processoBeneficio: any;
    calendario: Array<any>;
}

export class HomeAssistido extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            planos: [],
            ultimaFolha: null,
            dataAposentadoria: null,
            processoBeneficio: null,
            calendario: null
        }
    }

    componentDidMount = async () => {
        //await this.props.page.current.loading(true);

        var planos = await PlanoService.Buscar();
        var processoBeneficio = await ProcessoBeneficioService.BuscarPorPlano(planos[0].CD_PLANO);

        if (processoBeneficio.length > 0) {
            var ultimaFolha = await FichaFinanceiraAssistidoService.BuscarUltimaPorPlanoProcesso(planos[0].CD_PLANO, processoBeneficio[0].CD_ESPECIE, processoBeneficio[0].ANO_PROCESSO, processoBeneficio[0].NUM_PROCESSO);
            var calendario = await CalendarioPagamentoService.BuscarPorPlano(planos[0].CD_PLANO);

            await this.setState({
                planos,
                ultimaFolha,
                processoBeneficio: processoBeneficio[0],
                calendario
            });
        }

        await this.props.page.current.loading(false);
    }

    selecionarProcesso = async (processoBeneficio: any) => {

        var ultimaFolha = await FichaFinanceiraAssistidoService.BuscarUltimaPorPlanoProcesso(processoBeneficio.CD_PLANO, processoBeneficio.CD_ESPECIE, processoBeneficio.ANO_PROCESSO, processoBeneficio.NUM_PROCESSO);
        await this.setState({
            ultimaFolha,
            processoBeneficio
        });
    }

    render() {
        return (
            <div>
                {this.state.calendario &&
                    <div>
                        <Row>
                            <Col>
                                <HomeCard titulo={this.state.planos[0].DS_PLANO}>
                                    {this.state.planos[0].DS_CATEGORIA}
                                </HomeCard>
                            </Col>
                            <Col>
                                <HomeCard titulo={"Situação"}>
                                    {this.state.processoBeneficio.DS_ESPECIE}
                                </HomeCard>
                            </Col>
                            <Col>
                                <HomeCard titulo={"Data de Início do Benefício"}>
                                    {this.state.processoBeneficio.DT_INICIO_FUND}
                                </HomeCard>
                            </Col>
                        </Row>

                        {this.state.processoBeneficio.SALDO_ATUAL > 0 &&
                            <Row>
                                <Col>
                                    <HomeCard titulo={"Saldo de Conta Aplicável Atual - SCAA (em cotas)"}>
                                        <CampoEstatico valor={this.state.processoBeneficio.SALDO_ATUAL} />
                                    </HomeCard>
                                </Col>
                                <Col>
                                    <HomeCard titulo={"Renda - % SCAA"}>
                                        {this.state.processoBeneficio.VL_PARCELA_MENSAL}%
                                    </HomeCard>
                                </Col>
                                <Col>
                                    <HomeCard titulo={"Provável Encerramento do Benefício"}>
                                        {this.state.processoBeneficio.DT_APOSENTADORIA}
                                    </HomeCard>
                                </Col>
                                {this.state.planos[0].CD_PLANO !== "0001" &&
                                    <Col>
                                        <HomeCard titulo={"Regime de Tributação"}>
                                            {this.state.planos[0].TIPO_IRRF === "2" ? "Regressivo" : "Progressivo"}
                                        </HomeCard>
                                    </Col>
                                }
                            </Row>
                        }

                        <Row className={"mt-4"}>
                            <Col tamanho={"8"}>
                                {this.state.ultimaFolha.Proventos.length > 0 &&
                                    <Box titulo={`Contracheque de ${this.state.ultimaFolha.Resumo.Referencia.substring(3)}`}
                                        label={this.state.planos[0].CD_PLANO === "0002" && `Valor da cota: ${this.state.ultimaFolha.Resumo.Indice.VALOR_IND}`}>
                                        <h6 className={"text-right text-secondary mb-4"}></h6>
                                        <h2 className={"text-center mb-5"}>Valor Líquido: <CampoEstatico valor={this.state.ultimaFolha.Resumo.Liquido} tipo={TipoCampoEstatico.dinheiro} /></h2>

                                        <table className={"table table-striped table-sm"}>
                                            <thead>
                                                <tr>
                                                    <th>Rubrica</th>
                                                    <th>Tipo</th>
                                                    <th>Competência</th>
                                                    <th className={"text-right"}>Valor</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.ultimaFolha.Proventos.map((rubrica: any, index: number) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{rubrica.DS_RUBRICA}</td>
                                                            <td className={"text-success"}>Provento</td>
                                                            <td>{rubrica.DT_COMPETENCIA}</td>
                                                            <td className={"text-right"}>
                                                                <CampoEstatico valor={rubrica.VALOR_MC} tipo={TipoCampoEstatico.dinheiro} />
                                                            </td>
                                                        </tr>
                                                    )
                                                })}

                                                {this.state.ultimaFolha.Descontos.map((rubrica: any, index: number) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{rubrica.DS_RUBRICA}</td>
                                                            <td className={"text-danger"}>Desconto</td>
                                                            <td>{rubrica.DT_COMPETENCIA}</td>
                                                            <td className={"text-right"}>
                                                                <CampoEstatico valor={rubrica.VALOR_MC} tipo={TipoCampoEstatico.dinheiro} />
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>

                                    </Box>
                                }
                            </Col>

                            <Col>
                                <Box titulo={"Calendário de Pagamento"}>
                                    <table className={"table table-striped table-sm"}>
                                        <tbody>
                                            {this.state.calendario.map((data: any, index: number) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{data.DES_MES}</td>
                                                        <td className={"text-right"}>{data.NUM_DIA}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </Box>
                            </Col>
                        </Row>
                    </div>
                }

                {!this.state.processoBeneficio &&
                    <Alerta tipo={TipoAlerta.danger} mensagem={"Nenhum processo de benefício disponível para este plano."} />
                }
            </div>
        );
    }
}