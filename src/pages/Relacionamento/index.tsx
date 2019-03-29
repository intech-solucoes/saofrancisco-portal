import React from 'react';
import { Row, Col, Box, Button, CampoTexto, Form, Alert, TipoBotao, TipoAlerta } from '@intechprev/componentes-web';
import { RelacionamentoService } from "@intechprev/prevsystem-service";

import { Page } from "../";

interface Props {
}

interface State {
    email: string;
    assunto: string;
    mensagem: string;
}

export class Relacionamento extends React.Component<Props, State> {

    private page = React.createRef<Page>();
    private form = React.createRef<Form>();
    private alert = React.createRef<Alert>();

    constructor(props: Props) {
        super(props);

        this.state = {
            email: "",
            assunto: "",
            mensagem: "",
        }
    }

    componentDidMount() {
        this.page.current.loading(false);
    }

    validar = async () => {
        await this.alert.current.limparErros();
        await this.form.current.validar();

        if(this.alert.current.state.mensagem.length === 0 && this.alert.current.props.mensagem.length === 0) {
            try { 
                await RelacionamentoService.Enviar(this.state.email, this.state.assunto, this.state.mensagem);
                alert("Mensagem enviada com sucesso!");
                await this.limparCampos();
            } catch(err) {
                if(err.response)
                    alert(err.response.data);
                else
                    console.error(err);
            }
        } else {
            
        }
    }

    /**
     * @description Método que limpa os states de campo para limpar o formulário de nova mensagem.
     */
    limparCampos = () => {
        this.setState({
            email: "",
            assunto: "",
            mensagem: "",
        })
    }

    render() {
        return (
            <Page {...this.props} ref={this.page}>
                <Row>
                    <Col>
                        <Box>
                            <Form ref={this.form}>
                                <CampoTexto contexto={this} nome={"email"} max={50} valor={this.state.email} label={"Seu e-mail"} tipo={"email"} />
                                <CampoTexto contexto={this} nome={"assunto"} max={50} valor={this.state.assunto} label={"Assunto"} obrigatorio />
                                <CampoTexto contexto={this} nome={"mensagem"} max={4000} textarea valor={this.state.mensagem} rows={10} label={"Mensagem"} obrigatorio />

                                <Button titulo={"Enviar"} tipo={TipoBotao.primary} submit onClick={this.validar} />
                                <br /><br />
                                <Alert ref={this.alert} padraoFormulario tipo={TipoAlerta.danger} tamanho={"6"}/>
                            </Form>
                        </Box>
                    </Col>
                </Row>
            </Page>
        )
    }
}
