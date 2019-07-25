import React from "react";

import { PageClean } from "..";

import { UsuarioService, LGPDService } from "@intechprev/prevsystem-service";
import { Alerta, TipoAlerta, Form, CampoTexto, Botao, TipoBotao } from "@intechprev/componentes-web";

interface Props {
    history?: any;
}

interface State {
    
}

export default class EsqueciSenha extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    aceitar = async () => {
        try {
            await LGPDService.Inserir(1);
            this.props.history.push('/trocarSenhaPrimeiroAcesso');
        } catch(erro) {
            if(erro.response) {
                //await this.loginForm.current.mostrarErro(erro.response.data);
                await this.setState({ erro: erro.response.data });
            } else {
                //await this.loginForm.current.mostrarErro(erro);
                //alert("Ocorreu um erro ao processar sua requisição!");
                await this.setState({ erro });
            }
        }
    }

    recusar = async () => {
        await alert("Sem o consentimento expresso no termo, o acesso ao Portal do Participante e à área restrita do Aplicativo Mobile não será permitido.");
        localStorage.removeItem("token");
        localStorage.removeItem("token-admin");
        await this.props.history.push('/login');
    }

    render() {
        return (
			<PageClean tamanho={550} {...this.props}>
                <h5><b>TERMO DE CONSENTIMENTO E AUTORIZAÇÃO LIVRE, ESCLARECIDO E INEQUÍVOCO DE UTILIZAÇÃO DE DADOS PESSOAIS</b></h5>
                <p style={{ textAlign: "justify" }}>
                    Nos termos do presente termo de consentimento e autorização livre, esclarecido e inequívoco, e de acordo com o artigo 5°, XII, 
                    da Lei 13.709/18 – LEI GERAL DE PROTEÇÃO DE DADOS, manifesto minha livre, informada e inequívoca autorização, pelo qual concordo 
                    com o tratamento de meus dados pessoais, financeiros e cadastrais e, respectivamente, de meus dependentes, para que a 
                    FUNDAÇÃO SÃO FRANCISCO DE SEGURIDADE SOCIAL os utilize para o fim da prestação específica de administração do(s) 
                    meu(s) Plano(s) de Benefícios, dados estes que serão consultados e colhidos via Portal de Serviços contidos no sítio da Entidade, 
                    em área restrita, e/ou no aplicativo mobile disponível para download nas lojas Apple Store e Google Play.
                </p>

                <Botao titulo={"Li e concordo com o termo acima"} onClick={this.aceitar} block />
                <Botao titulo={"Agora não"} onClick={this.recusar} tipo={TipoBotao.light} block />
            </PageClean>
        );
    }
}