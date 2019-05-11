import React from "react";
import { Page } from "..";
import { Row, Col, Box, CampoEstatico, TipoCampoEstatico } from "@intechprev/componentes-web";
import { HomeCard } from "./HomeCard";
import { PlanoService, SalarioBaseService, FichaFinanceiraService } from "@intechprev/prevsystem-service";

interface Props { }

interface State {
    planos: Array<any>;
    salario: any;
    ultimaContribuicao: Array<any>;
    saldos: any;
    dataAposentadoria: any;
}

export class HomeAtivo extends React.Component<Props, State> {

    private page = React.createRef<Page>();

    componentDidMount = async () => {
        this.page.current.loading(true);
        
        var planos = await PlanoService.Buscar();
        var ultimaContribuicao = await FichaFinanceiraService.BuscarUltimaExibicaoPorPlano(planos[0].CD_PLANO);
        console.log(ultimaContribuicao);
        await this.setState({ planos, ultimaContribuicao });

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
                                                0%
                                            </HomeCard>
                                        </Col>
                                        <Col>
                                            <HomeCard titulo={"Salário de Participação"}>
                                                <CampoEstatico valor={this.state.ultimaContribuicao[0].SRC} tipo={TipoCampoEstatico.dinheiro} />
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
                                            <Box titulo={"Sua Última Contribuição"} label={this.state.ultimaContribuicao[0].DT_MOVIMENTO}>
                                                
                                                <table className={"table table-striped table-sm"}>
                                                    <tbody>
                                                        {this.state.ultimaContribuicao.map((contrib, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{contrib.DS_TIPO_CONTRIBUICAO}</td>
                                                                    <td className={"text-right"}>
                                                                        <CampoEstatico valor={contrib.CONTRIB_PARTICIPANTE} tipo={TipoCampoEstatico.dinheiro} />
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>

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