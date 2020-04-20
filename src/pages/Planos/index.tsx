import React from "react";
import { Link } from "react-router-dom";
import { PlanoService, FichaFechamentoService } from "@intechprev/prevsystem-service";

import { Page } from "..";
import { Box, TipoBotao, Form, Alerta, Row, Col, CampoTexto, TipoAlerta, Botao, TamanhoBotao } from "@intechprev/componentes-web";
import DataInvalida from "../../_utils/Data";
import { NumFuncionalidade } from "../Page";
import { FuncionalidadeService } from "../../services";

interface Props { }

interface State {
    listaPlanos: Array<any>;

    modalVisivel: boolean,
    cdPlano: string,
    dataInicio: string,
    dataFim: string,
    motivoBloqueio: string;
}

export default class Planos extends React.Component<Props, State> {

    private page = React.createRef<Page>();
    private form = React.createRef<Form>();
    private alert = React.createRef<Alerta>();

    constructor(props: Props) {
        super(props)

        this.state = {
            modalVisivel: false,
            listaPlanos: [],
            dataInicio: "",
            dataFim: "",
            cdPlano: "",
            motivoBloqueio: "Aguarde enquanto o sistema carrega as informaformações."
        }
    }

    componentDidMount = async () => {
        var listaPlanos = await PlanoService.Buscar();

        await this.setState({ 
            listaPlanos
        });

        await this.page.current.loading(false);
    }

    /** 
     * @description Método que altera o state 'modalVisivel' que, consequentemente, deixa a modal visível ou não. Além disso, ao fechar a modal, os states de registros devem 
     * permanecer vazios e os states de erro devem receber'false'. Ao abrir a modal, os states recebem os valores default. 
     */ 
    toggleModal = async (cdPlano: string) => {
        if(!this.state.modalVisivel) {
            var datasExtrato = await FichaFechamentoService.BuscarDatasExtrato(cdPlano);
            await this.buscarBloqueioExtrato();
            await this.setState({
                dataInicio: datasExtrato.DataInicial.substring(3),
                dataFim: datasExtrato.DataFinal.substring(3),
            });
        }
        await this.setState({
            modalVisivel: !this.state.modalVisivel,
            cdPlano
        });
    }

    renderModal = () => {
        if (this.state.modalVisivel) {
            return (
                <div className="modal" role="dialog">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h5 className="modal-title">Período</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => this.toggleModal("")}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            
                            {this.renderExtratoForm()}

                        </div>
                    </div>
                </div>
            );
        }
        else
            return <div></div>

    }

    gerarExtrato = async () => {
        try {
            await this.alert.current.limparErros();
            await this.form.current.validar();
            
            var dataInicio = this.converteData("01/" + this.state.dataInicio);
            var dataFim = this.converteData("01/" + this.state.dataFim);

            await this.validarData("01/" + this.state.dataInicio, dataInicio, "Data de Início");
            await this.validarData("01/" + this.state.dataFim, dataFim, "Data Fim");
            
            if(dataInicio > dataFim)
                this.alert.current.adicionarErro("A data inicial é superior à data final");
    
            if(dataFim > new Date())
                this.alert.current.adicionarErro("A data final é superior à data atual");
    
            if(this.alert.current.state.mensagem.length === 0 && this.alert.current.props.mensagem.length === 0) {
                
                var relatorio = await PlanoService.RelatorioExtratoPorPlanoReferencia(this.state.cdPlano, "01/" + this.state.dataInicio, "01/" + this.state.dataFim);
                
                if (navigator.msSaveBlob) { // IE10+ : (has Blob, but not a[download] or URL)
                    return navigator.msSaveBlob(new Blob([relatorio]), "Extrato.pdf");
                } else {

                    const blobURL = window.URL.createObjectURL(new Blob([relatorio]));
                    const tempLink = document.createElement('a');
                    tempLink.style.display = 'none';
                    tempLink.href = blobURL;
                    tempLink.setAttribute('download', "Extrato.pdf");

                    if (typeof tempLink.download === 'undefined') {
                        tempLink.setAttribute('target', '_blank');
                    }

                    document.body.appendChild(tempLink);
                    tempLink.click();
                    document.body.removeChild(tempLink);
                    window.URL.revokeObjectURL(blobURL);
                }
            }
            
        } catch(err) {
            console.error(err);
        }
    }

    validarData = async (data: string, dataObjeto: Date, nomeCampo: string) => {
        if(DataInvalida(dataObjeto, data))
            await this.alert.current.adicionarErro(`Campo "${nomeCampo}" inválido.`);
    }

    converteData = (data: any) => {
        var dataObjeto = data.split("/");
        dataObjeto = new Date(dataObjeto[2], dataObjeto[1] - 1, dataObjeto[0]);
        return dataObjeto;
    }

    buscarBloqueioExtrato = async () => {
        const Funcionalidade = NumFuncionalidade.EXTRATO;
        
        const planos = await PlanoService.Buscar();
        const cdPlanos = [];
        /* Código do plano do participante logado. */
        cdPlanos.push(planos[0].CD_PLANO);
        /* Código do segundo plano do participante logado (repetir o primeiro caso só tenha um plano). */
        cdPlanos.push(planos.length > 1 ? planos[1].CD_PLANO : cdPlanos[0]);
        /* Código do terceiro plano do participante logado (repetir o segundo caso só tenha um ou dois planos ) */
        cdPlanos.push(planos.length > 2 ? planos[2].CD_PLANO : cdPlanos[1]);

        const motivoBloqueio = await FuncionalidadeService.BuscarBloqueiosPorNumFuncionalidade(Funcionalidade, cdPlanos[0], cdPlanos[1], cdPlanos[2]);

        this.setState({motivoBloqueio});
    }

    renderExtratoForm = () => {
        if(this.state.motivoBloqueio){
            return(
                <div className="modal-body">
                    <Alerta mensagem={this.state.motivoBloqueio} tipo={TipoAlerta.danger}/>
                </div>
            );
        }
        return(
            <Form ref={this.form}>
                <div className="modal-body">
                    <Row>
                        <Col className={"col-lg-6"}>
                            <CampoTexto
                                contexto={this}
                                nome={"dataInicio"}
                                mascara={"99/9999"}
                                obrigatorio
                                valor={this.state.dataInicio} 
                                titulo={"Data de Início"}
                                placeholder={"MM/AAAA"}
                                tamanhoTitulo={"lg-4"}
                            />
                        </Col>

                        <Col className={"col-lg-6"}>
                            <CampoTexto
                                contexto={this}
                                nome={"dataFim"}
                                mascara={"99/9999"}
                                obrigatorio
                                valor={this.state.dataFim} 
                                titulo={"Data Final"}
                                placeholder={"MM/AAAA"}
                                tamanhoTitulo={"lg-4"}
                            />
                        </Col>
                    </Row>
                    <div></div>
                </div>

                <Alerta ref={this.alert} padraoFormulario tipo={TipoAlerta.danger} /> {/** tamanho={"5"} rowClassName={"justify-content-end"} style={{marginRight: 15}} */}
                
                <div className="modal-footer">
                    <Botao titulo={"Gerar"} tipo={TipoBotao.primary} submit onClick={this.gerarExtrato} />
                </div>
            </Form>
        );
    }

    render() {
        return (
            <Page Funcionalidade={NumFuncionalidade.SEUS_PLANOS} {...this.props} ref={this.page}>
                <Box>
                    <table className="table" id="tabelaPlanos">
                        <thead>
                            <tr>
                                <th style={{width:"250"}}>Plano</th>
                                <th style={{width:"280"}}>Situação</th>
                                <th style={{width:"180"}}>Categoria</th>
                                <th style={{width:"150"}}>Data de inscrição</th>
                                <th style={{width:"130"}}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.listaPlanos.map((plano: any, index: number) => {
                                    return (
                                        <tr key={index}>
                                            <td>{plano.DS_PLANO}</td>
                                            <td>{plano.DS_SIT_PLANO}</td>
                                            <td>{plano.DS_CATEGORIA}</td>
                                            <td>{plano.DT_INSC_PLANO}</td>
                                            <td align="center">
                                                {plano.CD_CATEGORIA !== "4" && plano.CD_PLANO !== "0001" &&
                                                    <Botao tipo={TipoBotao.primary} tamanho={TamanhoBotao.pequeno} titulo={"Extrato"}
                                                        onClick={() => { localStorage.setItem("empresa", plano.CD_EMPRESA); this.toggleModal(plano.CD_PLANO); }} />
                                                }
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </Box>

                {this.renderModal()}
            </Page>
        );
    }
}