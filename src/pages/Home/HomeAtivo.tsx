import React from "react";
import { Page } from "..";
import { Row, Col, Box, CampoEstatico, TipoCampoEstatico, Combo } from "@intechprev/componentes-web";
import { HomeCard } from "./HomeCard";
import { PlanoService, FichaFinanceiraService, FichaFechamentoService } from "@intechprev/prevsystem-service";

import * as _ from "lodash";

interface Props { }

interface State {
    planos: Array<any>;
    plano: any;
    cdPlano: string;
    salario: any;
    ultimaContribuicao: any;
    saldos: any;
}

export class HomeAtivo extends React.Component<Props, State> {

    private page = React.createRef<Page>();

    componentDidMount = async () => {
        this.page.current.loading(true);
        
        var planos = await PlanoService.Buscar();

        await this.setState({
            planos,
            cdPlano: planos[0].CD_PLANO,
        })

        await this.carregarPlano();

        this.page.current.loading(false);
    }

    carregarPlano = async() => {
        var ultimaContribuicao = await FichaFinanceiraService.BuscarUltimaExibicaoPorPlano(this.state.cdPlano);
        var saldos = await FichaFechamentoService.BuscarSaldoPorPlano(this.state.cdPlano);

        var plano = _.filter(this.state.planos, (plano: any) => plano.CD_PLANO === this.state.cdPlano)[0];

        await this.setState({ 
            ultimaContribuicao, 
            saldos,
            plano
        });
    }

    render() {
        return (
            <Page {...this.props} ref={this.page}>
                {this.page.current && this.state.plano &&
                    <div>
                        {this.state.planos.length > 1 &&
                            <div>
                                <Combo contexto={this} label={"Selecione um plano"} onChange={this.carregarPlano}
                                        nome={"cdPlano"} valor={this.state.cdPlano} obrigatorio
                                        opcoes={this.state.planos} nomeMembro={"DS_PLANO"} valorMembro={"CD_PLANO"} />
                            </div>
                        }
                    
                        <Row>
                            <Col>
                                <HomeCard titulo={this.state.plano.DS_PLANO}>
                                    {this.state.plano.DS_CATEGORIA}
                                </HomeCard>
                            </Col>
                            <Col>
                                <HomeCard titulo={"Contribuição Atual"} >
                                    {this.state.ultimaContribuicao.Percentual}%
                                </HomeCard>
                            </Col>
                            <Col>
                                <HomeCard titulo={"Salário de Participação"}>
                                    <CampoEstatico valor={this.state.ultimaContribuicao.SRC} tipo={TipoCampoEstatico.dinheiro} />
                                </HomeCard>
                            </Col>
                            <Col>
                                <HomeCard titulo={"Data de Inscrição"}>
                                    {this.state.plano.DT_INSC_PLANO}
                                </HomeCard>
                            </Col>
                        </Row>

                        <Row className={"mt-4"}>
                            <Col>
                                <Box titulo={"Sua Última Contribuição"} label={`Posição de ${this.state.ultimaContribuicao.DataReferencia.substring(3)}`}>
                                    
                                    <table className={"table table-striped table-sm"}>
                                        <tbody>
                                            {this.state.ultimaContribuicao.Itens.map((contrib: any, index: number) => {
                                                // Define o tipo de linha (td ou th) baseado no index. Se for o ultimo, será o total, e será th
                                                var Td = (props: any) => <td className={props.className}>{props.children}</td>;

                                                if(index == this.state.ultimaContribuicao.Itens.length - 1)
                                                    Td = (props: any) => <th className={props.className}>{props.children}</th>;

                                                return (
                                                    <tr key={index}>
                                                        <Td>{contrib.Item1}</Td>
                                                        <Td className={"text-right"}>
                                                            <CampoEstatico valor={contrib.Item2} tipo={TipoCampoEstatico.dinheiro} />
                                                        </Td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>

                                </Box>
                            </Col>
                            
                            <Col>
                                <Box titulo={"Seu Saldo"} label={`Posição de ${this.state.saldos.DT_FECHAMENTO.substring(3)}`}>
                                    
                                    <table className={"table table-borderless table-sm"}>
                                        <tbody>
                                            <tr>
                                                <td>Minhas Contribuições (total):</td>
                                                <td className={'text-right'}>
                                                    <CampoEstatico valor={this.state.saldos.VL_GRUPO1} tipo={TipoCampoEstatico.dinheiro} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Contribuições Patronais (total):</td>
                                                <td className={'text-right'}>
                                                    <CampoEstatico valor={this.state.saldos.VL_GRUPO2} tipo={TipoCampoEstatico.dinheiro} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Contribuições Totais:</td>
                                                <td className={'text-right'}>
                                                    <CampoEstatico valor={this.state.saldos.VL_GRUPO1 + this.state.saldos.VL_GRUPO2} tipo={TipoCampoEstatico.dinheiro} />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <hr/>

                                    <div className={"mb-3 pl-2 pr-2 table"}>
                                        Rendimento do Plano:
                                        <p className={"float-right"}>
                                            <CampoEstatico valor={this.state.saldos.VL_ACUMULADO - (this.state.saldos.VL_GRUPO1 + this.state.saldos.VL_GRUPO2)} tipo={TipoCampoEstatico.dinheiro} />
                                        </p>
                                    </div>

                                    <div className={"alert alert-success"}>
                                        <b>Saldo Acumulado Atualizado:</b>
                                        <p className={"float-right"}>
                                            <b><CampoEstatico valor={this.state.saldos.VL_ACUMULADO} tipo={TipoCampoEstatico.dinheiro} /></b>
                                        </p>
                                    </div>
                                    
                                    <p className={"text-info"}>
                                        Valor da cota: <CampoEstatico valor={this.state.saldos.VL_COTA} tipo={TipoCampoEstatico.texto} />
                                    </p>
                                </Box>
                            </Col>
                        </Row>
                    </div>
                }
            </Page>
        );
    }
}