import React from "react";
import { Row, Col, CampoEstatico, TipoCampoEstatico } from "@intechprev/componentes-web";
import { HomeCard } from "./HomeCard";
import { PlanoService } from "@intechprev/prevsystem-service";

interface Props {
    page: any;
}

interface State {
    plano: any;
}

export class HomeAtivoSaldado extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            plano: null
        }
    }

    componentDidMount = async () => {
        this.props.page.current.loading(true);
        
        var plano = await PlanoService.BuscarSaldado();

        await this.setState({
            plano
        });

        this.props.page.current.loading(false);
    }

    render() {
        return (
            <div>
                {this.state.plano &&
                    <div>
                        <Row>
                            <Col>
                                <HomeCard titulo={"PLANO BD SALDADO"}>
                                    {this.state.plano.DS_SIT_PLANO}
                                </HomeCard>
                            </Col>
                            <Col>
                                <HomeCard titulo={"Data Saldamento"}>
                                    {this.state.plano.DT_INSC_PLANO}
                                </HomeCard>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <HomeCard titulo={"Valor Inicial do Saldamento"}>
                                    <CampoEstatico valor={this.state.plano.VL_BENEF_SALDADO_INICIAL} tipo={TipoCampoEstatico.dinheiro} />
                                </HomeCard>
                            </Col>
                            <Col>
                                <HomeCard titulo={"Valor Atualizado"} label={`em ${this.state.plano.DT_INIC_VALIDADE.substring(3)}`}>
                                    <CampoEstatico valor={this.state.plano.VL_BENEF_SALDADO_ATUAL} tipo={TipoCampoEstatico.dinheiro} />
                                </HomeCard>
                            </Col>
                        </Row>
                    </div>
                }
            </div>
        );
    }
}