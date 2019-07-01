import React from 'react';
import { MensagemService, PlanoService, FuncionarioService } from "@intechprev/prevsystem-service";
import { Row, Col, Box, Botao, TipoBotao } from '@intechprev/componentes-web';

import ListaMensagens from "./ListaMensagens";
import { Page } from "..";
import MensagemNova from './MensagemNova';
export { MensagemNova }

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
            var plano = await PlanoService.Buscar();
            var funcionario = await FuncionarioService.Buscar();
            plano.map(async (plano: any) => {

                var mensagens = await MensagemService.BuscarPorFundacaoEmpresaPlano(funcionario.Funcionario.CD_FUNDACAO, funcionario.Usuario.CD_EMPRESA, plano.CD_PLANO);
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

    handleClick = () => {
        this.props.history.push('/mensagem/nova');
    }

    render() {
        return (
            <Page {...this.props} ref={this.page}>
                <Row>
                    {
                        this.state.planos.map((plano: any, index: number) => {
                            return (
                                <Col key={index}>
                                    <Box titulo={"Mensagens"}>
                                            <div>
                                                <Botao titulo={"Nova Mensagem"} tipo={TipoBotao.primary} onClick={this.handleClick} />
                                                <br/>
                                                <br/>
                                            </div>

                                        {plano.mensagens.length > 0 &&
                                            <ListaMensagens mostrarDados={false} mensagens={plano.mensagens} />}

                                        {plano.mensagens.length === 0 &&
                                            <div id="alertMensagem" className="alert alert-danger">Nenhuma mensagem enviada.</div>}
                                    </Box>
                                </Col>
                            )
                        })
                    }
                </Row>
            </Page>
        );
    }
}