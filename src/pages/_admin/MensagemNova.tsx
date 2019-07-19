import React from 'react';
import { MensagemService, ListasService } from "@intechprev/prevsystem-service";
import { handleFieldChange } from "@intechprev/react-lib";
import { Row, Col, Box, CampoTexto, Botao, Form, Alerta, Combo, TipoBotao, TipoAlerta } from "@intechprev/componentes-web";
import DataInvalida from '../../_utils/DataInvalida';
import ListaMensagens from "../Mensagens/ListaMensagens";
import { PageAdmin } from '.';

interface Props {}

interface State { 
    // States campos
    tituloMensagem: string,
    mensagem: string,
    enviarEmail: boolean,
    enviarPortal: boolean,
    enviarMobile: boolean,
    dataExpiracao: string,
    fundacao: any,
    empresa: any,
    plano: string,
    situacaoPlano: string,
    matricula: string,

    // States Listas
    listas: [],
    listaFundacao: any,
    listaEmpresa: [],
    listaPlano: [],
    listaSituacaoPlano: [],
    mensagens: [],

    modalVisivel: false
}

export class MensagemNova extends React.Component<Props, State> {

    private page = React.createRef<PageAdmin>();
    private form = React.createRef<Form>();
    private alert = React.createRef<Alerta>();

    constructor(props: Props) {
        super(props);
        this.state = {

            // States campos
            tituloMensagem: "",
            mensagem: "",
            enviarEmail: false,
            enviarPortal: false,
            enviarMobile: false,
            dataExpiracao: "",
            fundacao: "",
            empresa: "",
            plano: "",
            situacaoPlano: "",
            matricula: "",

            // States Listas
            listas: [],
            listaFundacao: [],
            listaEmpresa: [],
            listaPlano: [],
            listaSituacaoPlano: [],
            mensagens: [],

            modalVisivel: false
        }
    }

    /**
     * @description Método de ciclo de vida, chamado ao montar o componente. Busca todas as listagens e armazena em seus respectivos states.
     */
    async componentDidMount() {

        try {
            var mensagens = await MensagemService.BuscarTodas();
            await this.setState({ mensagens })

            var listas = await ListasService.ListarFundacaoEmpresaPlano();
            await this.setState({
                listas,
                listaFundacao: listas.Fundacoes,
                listaSituacaoPlano: listas.SitPlanos,
                fundacao: listas.Fundacoes[0].CD_FUNDACAO
            });

            await this.onChangeFundacao(null);
            
            await this.page.current.loading(false);
        } catch(err) {
            console.error(err);
        }
    }

    /**
     * @description Método que busca as empresas que existem dentro da fundação selecionada e armazena no state listaEmpresa.
     * @param {event} object
     */
    onChangeFundacao = async (event: Event) => {
        try {
            await this.setState({ listaEmpresa: this.state.listaFundacao[this.state.fundacao - 1].Empresas });
        } catch(err) {
            this.setState({ 
                listaEmpresa: [],
                listaPlano: [],
                empresa: "",
                plano: ""
            });
            console.error(err);
        }
    }

    /**
     * @description Método que busca os planos que existem dentro da empresa selecionada e armazena no state listaPlanos.
     * @param {event} object
     */
    onChangeEmpresa = async (event: Event) => {
        try {
            await this.setState({ listaPlano: this.state.listaFundacao[this.state.fundacao - 1].Empresas[this.state.empresa - 1].Planos });
        } catch(err) { 
            this.setState({ 
                listaPlano: [],
                plano: ""
            })
            console.error(err);
        }
    }

    validar = async () => {
        await this.alert.current.limparErros();
        await this.form.current.validar();
        await this.validarData();
        await this.validarCheckboxes();

        var dadosMensagem = {
            TXT_TITULO: "",
            TXT_CORPO: "",
            DTA_EXPIRACAO: "",
            CD_FUNDACAO: "",
            CD_EMPRESA: "",
            CD_PLANO: "",
            CD_SIT_PLANO: "",
            NUM_MATRICULA: "",
            IND_MOBILE: "",
            IND_PORTAL: "",
            IND_EMAIL: "",
            IND_SMS: "NAO"
        };
        if(this.alert.current.state.mensagem.length === 0 && this.alert.current.props.mensagem.length === 0) {
            dadosMensagem.TXT_TITULO = this.state.tituloMensagem;
            dadosMensagem.TXT_CORPO = this.state.mensagem;
            dadosMensagem.DTA_EXPIRACAO = this.state.dataExpiracao;
            dadosMensagem.CD_FUNDACAO = this.state.fundacao;
            dadosMensagem.CD_EMPRESA = this.state.empresa;
            dadosMensagem.CD_PLANO = this.state.plano;
            dadosMensagem.CD_SIT_PLANO = this.state.situacaoPlano;
            dadosMensagem.NUM_MATRICULA = this.state.matricula;
            dadosMensagem.IND_MOBILE = this.state.enviarMobile ? "SIM" : "NAO";
            dadosMensagem.IND_PORTAL = this.state.enviarPortal ? "SIM" : "NAO";
            dadosMensagem.IND_EMAIL = this.state.enviarEmail ? "SIM" : "NAO";
            
            try { 
                await MensagemService.EnviarMensagem(dadosMensagem);
                alert("Mensagem enviada com sucesso!");
                await this.limparCampos();
                
                var mensagens = await MensagemService.BuscarTodas();
                this.setState({ mensagens });

            } catch(err) {
                if(err.response)
                    alert(err.response.data);
                else
                    console.error(err);
            }
        } else {
            
        }
    }

    validarCheckboxes = async () => {
        if(!this.state.enviarEmail && !this.state.enviarPortal) {
            await this.alert.current.adicionarErro("Campo \"Enviar via\" obrigatório.");
        }
    }

    validarData = async () => {
        // var dataObjeto: any;
        // dataObjeto = this.state.dataExpiracao.split("/");
        // dataObjeto = new Date(dataObjeto[2], dataObjeto[1] - 1, dataObjeto[0]);
        // var dataInvalida = DataInvalida(dataObjeto, this.state.dataExpiracao);

        // if(dataObjeto < new Date()) {
        //     await this.alert.current.adicionarErro("A Data de Expiração deve ser superior à data atual.");
        // } else {
        //     if(dataInvalida)
        //         await this.alert.current.adicionarErro("Campo \"Data de Expiração\" inválido.");
        // }
    }

    /**
     * @description Método que limpa os states de campo para limpar o formulário de nova mensagem.
     */
    limparCampos = () => {
        this.setState({
            tituloMensagem: "",
            mensagem: "",
            enviarEmail: false,
            enviarPortal: false,
            // enviarMobile: false,
            dataExpiracao: "",
            fundacao: "",
            empresa: "",
            plano: "",
            situacaoPlano: "",
            matricula: ""
        })
    }

    render () {
        return (
            <PageAdmin {...this.props} ref={this.page}>
                <Row>
                    <Col>
                        <Box titulo={"NOVA MENSAGEM"}>
                            <Form ref={this.form}>

                                <Row>                          
                                    <Col className={"col-lg-6"}>

                                        <CampoTexto contexto={this} nome={"tituloMensagem"} max={50} valor={this.state.tituloMensagem} label={"Título"} obrigatorio />

                                        <CampoTexto contexto={this} nome={"mensagem"} max={4000} textarea valor={this.state.mensagem} rows={10} label={"Corpo da Mensagem"} obrigatorio />

                                        <div className="form-group">
                                            <label><b>Enviar via</b></label>
                                            <Row>
                                                <Col className={"col-lg-2"}>
                                                    <input name="enviarEmail" id="enviarEmail" type={"checkbox"} checked={this.state.enviarEmail} onChange={(e) => handleFieldChange(this, e)} />&nbsp;
                                                    <label htmlFor="enviarEmail">E-mail</label>
                                                </Col>

                                                <Col className={"col-lg-2"}>
                                                    <input name="enviarPortal" id="enviarPortal" type="checkbox" checked={this.state.enviarPortal} onChange={(e) => handleFieldChange(this, e)} />&nbsp;
                                                    <label htmlFor="enviarPortal">Portal</label>
                                                </Col>
                                            </Row>
                                        </div>
            
                                        <div className="form-group">
                                            <CampoTexto contexto={this} nome={"dataExpiracao"} mascara={"99/99/9999"} valor={this.state.dataExpiracao} 
                                                        label={"Data de Expiração"} />
                                            <span className="text text-secondary">Deixe em branco para indicar que a mensagem não terá uma data de expiração</span>
                                        </div>
                                    </Col>
            
                                    <Col className={"col-lg-6"}>
                                        <Combo contexto={this} label={"Fundação"} onChange={this.onChangeFundacao}
                                               nome={"fundacao"} valor={this.state.fundacao} obrigatorio
                                               opcoes={this.state.listaFundacao} nomeMembro={"NOME_ENTID"} valorMembro={"CD_FUNDACAO"} />

                                        <Combo contexto={this} label={"Empresa"} onChange={this.onChangeEmpresa}
                                               nome={"empresa"} valor={this.state.empresa} obrigatorio={false} textoVazio="Todas(os)"
                                               opcoes={this.state.listaEmpresa} nomeMembro={"NOME_ENTID"} valorMembro={"CD_EMPRESA"} />

                                        <Combo contexto={this} label={"Plano"} obrigatorio={false}
                                               nome={"plano"} valor={this.state.plano} textoVazio="Todas(os)"
                                               opcoes={this.state.listaPlano} nomeMembro={"DS_PLANO"} valorMembro={"CD_PLANO"} />

                                        <Combo contexto={this} label={"Situação do plano"} obrigatorio={false}
                                               nome={"situacaoPlano"} valor={this.state.situacaoPlano} textoVazio="Todas(os)"
                                               opcoes={this.state.listaSituacaoPlano} nomeMembro={"DS_SIT_PLANO"} valorMembro={"CD_SIT_PLANO"} />

                                        <div className="form-group">
                                            <CampoTexto contexto={this} nome={"matricula"} mascara={"999999999"} valor={this.state.matricula} label={"Matrícula"} />
                                            <span className="text text-secondary">Deixe em branco para enviar para todas as matrículas dentro dos parâmetros acima</span>
                                        </div>
                                    </Col>

                                </Row>
                                <Botao titulo={"Enviar"} tipo={TipoBotao.primary} submit onClick={this.validar} usaLoading={true} />
                                <br /><br />
                                <Alerta ref={this.alert} padraoFormulario tipo={TipoAlerta.danger} tamanho={"6"} />
                            </Form>      
                        </Box>
                            
                        <Box titulo={"HISTÓRICO DE MENSAGENS"}>
                            {this.state.mensagens.length === 0 &&
                                <div id="alerta" className={"alert alert-danger"}>
                                    Nenhuma mensagem enviada.
                                </div>
                            }
                            {this.state.mensagens.length !== 0 &&
                                <ListaMensagens mensagens={this.state.mensagens} />
                            }
                        </Box>
                    </Col>
                </Row>
            </PageAdmin>
        );
    }
}