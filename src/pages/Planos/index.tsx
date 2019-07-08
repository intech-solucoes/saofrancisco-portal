import React from "react";
import { Link } from "react-router-dom";
import { PlanoService, FichaFechamentoService } from "@intechprev/prevsystem-service";

import { Page } from "..";
import { Box, TipoBotao, Form, Alerta, Row, Col, CampoTexto, TipoAlerta, Botao, TamanhoBotao } from "@intechprev/componentes-web";
import { RelatorioExtrato } from "./RelatorioExtrato";
import DataInvalida from "../../_utils/Data";

interface Props { }

interface State {
    listaPlanos: Array<any>;

    modalVisivel: boolean,
    cdPlano: string,
    dataInicio: string,
    dataFim: string,
}

export default class Planos extends React.Component<Props, State> {

    private page = React.createRef<Page>();
    private form = React.createRef<Form>();
    private alert = React.createRef<Alerta>();
    private relatorio = React.createRef<RelatorioExtrato>();

    constructor(props: Props) {
        super(props)

        this.state = {
            modalVisivel: false,
            listaPlanos: [],
            dataInicio: "",
            dataFim: "",
            cdPlano: ""
        }
    }

    componentDidMount = async () => {
        var listaPlanos = await PlanoService.Buscar();
        
        if(localStorage.getItem("pensionista") === "false")  {
            var datasExtrato = await FichaFechamentoService.BuscarDatasExtrato(listaPlanos[0].CD_PLANO);
            await this.setState({
                dataInicio: datasExtrato.DataInicial.substring(3),
                dataFim: datasExtrato.DataFinal.substring(3)
            });
        }

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
                            
                            <Form ref={this.form}>
                                <div className="modal-body">
                                    <Row>
                                        <Col className={"col-lg-6"}>
                                            <CampoTexto contexto={this} nome={"dataInicio"} mascara={"99/9999"} obrigatorio valor={this.state.dataInicio} 
                                                        label={"Data de Início"} placeholder={"MM/AAAA"} tamanhoLabel={"lg-4"} />
                                        </Col>

                                        <Col className={"col-lg-6"}>
                                            <CampoTexto contexto={this} nome={"dataFim"} mascara={"99/9999"} obrigatorio valor={this.state.dataFim} 
                                                        label={"Data Final"} placeholder={"MM/AAAA"} tamanhoLabel={"lg-4"} />
                                        </Col>
                                    </Row>
                                    <div></div>
                                </div>

                                <Alerta ref={this.alert} padraoFormulario tipo={TipoAlerta.danger} /> {/** tamanho={"5"} rowClassName={"justify-content-end"} style={{marginRight: 15}} */}
                                <div className="modal-footer">
                                    <Botao titulo={"Gerar"} tipo={TipoBotao.primary} submit onClick={this.gerarExtrato} />
                                </div>
                            </Form>

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

    render() {
        return (
            <Page {...this.props} ref={this.page}>
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
                                                {plano.CD_CATEGORIA !== "4" && plano.CD_PLANO !== "0003" &&
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
                <RelatorioExtrato ref={this.relatorio} preview={false} dtInicio={this.state.dataInicio} dtFim={this.state.dataFim} cdPlano={this.state.cdPlano} />
            </Page>
        );
    }
}