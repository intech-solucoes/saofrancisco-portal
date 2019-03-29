import React from 'react';
import { Row, Col, Box, Button, CampoTexto, Alert, TipoAlerta, TipoBotao, Form } from "@intechprev/componentes-web";
import { UsuarioService } from "@intechprev/prevsystem-service";
import { Page } from "..";

interface Props {

}

interface State {
    senhaAtual: string;
    senhaNova: string;
    confirmarSenha: string;
    mensagemSucesso: boolean
}

export class TrocarSenha extends React.Component<Props, State> {

    private page = React.createRef<Page>();
    private form = React.createRef<Form>();
    private alert = React.createRef<Alert>();

    constructor(props: Props) {
        super(props);

        this.state = {
            senhaAtual: "",
            senhaNova: "",
            confirmarSenha: "",
            mensagemSucesso: false
        }
    }

    componentDidMount() {
        this.page.current.loading(false);
    }

    trocarSenha = async () => {
        // Define os estados iniciais de alertas.
        await this.alert.current.limparErros();
        await this.form.current.validar();

        this.setState({ mensagemSucesso: false })
        
        // Valida se a nova senha tem 6 ou mais caracteres.
        if(this.state.senhaNova.length < 6)
            this.alert.current.adicionarErro("A nova senha deve possuir no mínimo 6 caracteres.");

        // Valida se os campos de nova senha e confirmação são iguais.
        if(this.state.senhaNova !== this.state.confirmarSenha)
            this.alert.current.adicionarErro("As senhas não coincidem.");

        try {
            if(this.alert.current.state.mensagem.length === 0 && this.alert.current.props.mensagem.length === 0) {
                await UsuarioService.TrocarSenha(this.state.senhaAtual, this.state.senhaNova);
                this.setState({ mensagemSucesso: true })
            }
        } catch(err) {
            if(err.response)
                this.alert.current.adicionarErro(err.response.data)
            else
                console.error(err);
        }

    }

    render() {
        return (
            <Page {...this.props} ref={this.page}>
                <Row>
                    <Col className={"col-lg-12"}>
                        <Box titulo={""}>
                            <Form ref={this.form}>
                            
                                <Row className={"form-group"}>
                                    <label htmlFor="senhaAtual" className="col-2 col-form-label"><b>Senha atual</b></label>
                                    <Col tamanho={"10"}>
                                        <CampoTexto contexto={this} nome={"senhaAtual"} obrigatorio tipo={"password"} valor={this.state.senhaAtual} />
                                    </Col>
                                </Row>

                                <Row className={"form-group"}>
                                    <label htmlFor="senhaNova" className="col-sm-2  col-form-label"><b>Nova senha</b></label>
                                    <Col tamanho={"10"}>
                                        <CampoTexto contexto={this} nome={"senhaNova"} obrigatorio tipo={"password"} valor={this.state.senhaNova} />
                                    </Col>
                                </Row>

                                <Row className={"form-group"}>
                                    <label htmlFor="confirmarSenha" className="col-sm-2  col-form-label"><b>Confirme nova senha</b></label>
                                    <Col tamanho={"10"}>
                                        <CampoTexto contexto={this} nome={"confirmarSenha"} obrigatorio tipo={"password"} valor={this.state.confirmarSenha} />
                                    </Col>
                                </Row>

                                {this.state.mensagemSucesso &&
                                    <Alert tipo={TipoAlerta.primary} mensagem={"Senha alterada com sucesso."} />
                                }

                                <Alert ref={this.alert} padraoFormulario tipo={TipoAlerta.danger} /> 
                                <hr />

                                <Button submit titulo={"Trocar Senha"} tipo={TipoBotao.primary} 
                                        onClick={() => this.trocarSenha()} usaLoading />
                            
                            </Form>
                        </Box>
                    </Col>
                </Row>
            </Page>
        );
    }
}
