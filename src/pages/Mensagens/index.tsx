import React from 'react';
import { MensagemService, PlanoService, FuncionarioService } from "@intechprev/prevsystem-service";
import { Row, Col, Box, Botao, TipoBotao } from '@intechprev/componentes-web';

import ListaMensagens from "./ListaMensagens";
import { Page } from "..";

interface Props {
    history?: any
}

interface State {
    mensagens: any,
    planos: any
}

export default class Mensagens extends React.Component<Props, State> {

    private page = React.createRef<Page>();

    constructor(props: Props) {
        super(props);

        this.state = {
            mensagens: [],
            planos: []
        }
    }

    async componentDidMount() {

        try {
            var planos = await PlanoService.Buscar();
            var funcionario = await FuncionarioService.Buscar();

            planos.map(async (plano: any) => {

                var mensagens = await MensagemService.BuscarPorFundacaoEmpresaPlano(funcionario.Funcionario.CD_FUNDACAO, funcionario.Funcionario.CD_EMPRESA, plano.CD_PLANO);
                plano.mensagens = mensagens;
                await this.setState({
                    planos: [...this.state.planos, plano]
                });

            });

            await this.page.current.loading(false);
        } catch(err) {
            console.error(err);
        }
            
    }

    render() {
        return (
            <Page {...this.props} ref={this.page}>
                {this.state.planos.length > 0 &&
                    <Row>
                        <Col>
                            <Box titulo={"Mensagens"}>
                                {this.state.planos[0].mensagens.length > 0 &&
                                    <ListaMensagens mostrarDados={false} mensagens={this.state.planos[0].mensagens} />}

                                {this.state.planos[0].mensagens.length === 0 &&
                                    <div id="alertMensagem" className="alert alert-danger">Nenhuma mensagem enviada.</div>}
                            </Box>
                        </Col>
                    </Row>
                }
            </Page>
        );
    }
}