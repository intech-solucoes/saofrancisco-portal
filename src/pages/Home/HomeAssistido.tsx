import React from "react";
import { Page } from "..";
import { Row, Col } from "@intechprev/componentes-web";
import { HomeCard } from "./HomeCard";
import { PlanoService, SalarioBaseService, FichaFinanceiraService } from "@intechprev/prevsystem-service";

interface Props { }

interface State {
    planos: Array<any>;
    dataAposentadoria: any;
}

export class HomeAssistido extends React.Component<Props, State> {

    private page = React.createRef<Page>();

    componentDidMount = async () => {
        this.page.current.loading(true);

        var planos = await PlanoService.Buscar();
        await this.setState({ planos });
        
        this.page.current.loading(false);
    }

    render() {
        return (
            <Page {...this.props} ref={this.page}>
                {this.page.current &&
                    <div>
                        <Row>
                            <Col>
                                <HomeCard titulo={this.state.planos[0].DS_PLANO}>
                                    {this.state.planos[0].DS_CATEGORIA}
                                </HomeCard>
                            </Col>
                        </Row>
                    </div>
                }
            </Page>
        );
    }
}