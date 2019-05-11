import React from "react";
import { Page } from "..";
import { Row, Col } from "@intechprev/componentes-web";
import { HomeCard } from "./HomeCard";

interface Props { }

interface State {
    plano: any;
    salario: any;
    ultimaContribuicao: Array<any>;
    saldos: any;
    dataAposentadoria: any;
}

export class HomeAssistido extends React.Component<Props, State> {

    private page = React.createRef<Page>();

    render() {
        return (
            <Page {...this.props} ref={this.page}>
                {this.page.current &&
                    <div>
                    <h4>Assistido</h4>
                        <Row>
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