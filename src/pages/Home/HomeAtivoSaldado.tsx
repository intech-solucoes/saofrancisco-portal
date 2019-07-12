import React from "react";
import { Page } from "..";
import { Row, Col } from "@intechprev/componentes-web";
import { HomeCard } from "./HomeCard";
import { PlanoService } from "@intechprev/prevsystem-service";

interface Props { }

interface State {
    plano: any;
}

export class HomeAtivoSaldado extends React.Component<Props, State> {

    private page = React.createRef<Page>();

    componentDidMount = async () => {
        this.page.current.loading(true);
        
        var plano = await PlanoService.BuscarSaldado();

        await this.setState({
            plano
        });

        this.page.current.loading(false);
    }

    render() {
        return (
            <Page {...this.props} ref={this.page}>
                {this.page.current &&
                    <div>
                        <Row>
                            <Col>
                                <HomeCard titulo={this.state.plano.DS_PLANO}>
                                    {this.state.plano.DS_CATEGORIA}
                                </HomeCard>
                            </Col>
                            <Col>
                                <HomeCard titulo={this.state.plano.DS_PLANO}>
                                    {this.state.plano.DS_CATEGORIA}
                                </HomeCard>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <HomeCard titulo={this.state.plano.DS_PLANO}>
                                    {this.state.plano.DS_CATEGORIA}
                                </HomeCard>
                            </Col>
                            <Col>
                                <HomeCard titulo={this.state.plano.DS_PLANO}>
                                    {this.state.plano.DS_CATEGORIA}
                                </HomeCard>
                            </Col>
                        </Row>
                    </div>
                }
            </Page>
        );
    }
}