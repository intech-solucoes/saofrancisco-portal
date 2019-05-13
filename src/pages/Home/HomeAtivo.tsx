import React from "react";
import { Page } from "..";
import { Row, Col, Box, CampoEstatico, TipoCampoEstatico } from "@intechprev/componentes-web";
import { HomeCard } from "./HomeCard";
import { PlanoService, SalarioBaseService, FichaFinanceiraService } from "@intechprev/prevsystem-service";

interface Props { }

interface State {
    planos: Array<any>;
    salario: any;
    ultimaContribuicao: any;
    saldos: any;
    dataAposentadoria: any;
}

export class HomeAtivo extends React.Component<Props, State> {

    private page = React.createRef<Page>();

    componentDidMount = async () => {
        this.page.current.loading(true);
        
        var planos = await PlanoService.Buscar();
        var ultimaContribuicao = await FichaFinanceiraService.BuscarUltimaExibicaoPorPlano(planos[0].CD_PLANO);
        var saldos = await FichaFinanceiraService.SaoFranciscoBuscarSaldoPorPlano(planos[0].CD_PLANO);
        await this.setState({ planos, ultimaContribuicao, saldos });

        this.page.current.loading(false);
    }

    render() {
        return (
            <Page {...this.props} ref={this.page}>
                {this.page.current &&
                    <div>
                        {this.state.planos.map((plano, index) => {
                            return (
                                <div>
                                    <Row key={index}>
                                        <Col>
                                            <HomeCard titulo={plano.DS_PLANO}>
                                                {plano.DS_CATEGORIA}
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
                                                {plano.DT_INSC_PLANO}
                                            </HomeCard>
                                        </Col>
                                    </Row>

                                    <Row className={"mt-4"}>
                                        <Col>
                                            <Box titulo={"Sua Última Contribuição"} label={this.state.ultimaContribuicao.DataReferencia}>
                                                
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
                                    </Row>

                                    <Row className={"mt-4"}>
                                        <Col>
                                            <Box titulo={"Seus Saldo"} label={this.state.saldos.DataReferencia}>
                                                
                                                <table className={"table table-striped table-sm"}>
                                                    <thead>
                                                        <tr>
                                                            <th></th>
                                                            <th className={'text-right'}>Cotas</th>
                                                            <th className={'text-right'}>Valor Atualizado</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Saldo Participante</td>
                                                            <td className={'text-right'}>
                                                                <CampoEstatico valor={this.state.saldos.QuantidadeCotasParticipante} tipo={TipoCampoEstatico.texto} />
                                                            </td>
                                                            <td className={'text-right'}>
                                                                <CampoEstatico valor={this.state.saldos.ValorParticipante} tipo={TipoCampoEstatico.dinheiro} />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>Saldo Patrocinadora</td>
                                                            <td className={'text-right'}>
                                                                <CampoEstatico valor={this.state.saldos.QuantidadeCotasPatrocinadora} tipo={TipoCampoEstatico.texto} />
                                                            </td>
                                                            <td className={'text-right'}>
                                                                <CampoEstatico valor={this.state.saldos.ValorPatrocinadora} tipo={TipoCampoEstatico.dinheiro} />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>Total</td>
                                                            <td className={'text-right'}>
                                                                <CampoEstatico valor={this.state.saldos.QuantidadeCotasParticipante + this.state.saldos.QuantidadeCotasParticipante} tipo={TipoCampoEstatico.texto} />
                                                            </td>
                                                            <td className={'text-right'}>
                                                                <CampoEstatico valor={this.state.saldos.ValorParticipante + this.state.saldos.ValorParticipante} tipo={TipoCampoEstatico.dinheiro} />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                
                                                <p className={"text-primary"}>
                                                    Valor da cota em {this.state.saldos.DataCota}: <CampoEstatico valor={this.state.saldos.ValorCota} tipo={TipoCampoEstatico.texto} />
                                                </p>
                                            </Box>
                                        </Col>
                                    </Row>
                                </div>
                            );
                        })}
                    </div>
                }
            </Page>
        );
    }
}