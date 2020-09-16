import React from "react";
import axios from "axios";
import { DocumentoService, PlanoService } from "@intechprev/prevsystem-service";
import { Link } from "react-router-dom";
import Tabelas from './../Documentos/Tabelas';

import { Page } from "..";
import { Row, Col, Box, Form, Botao, Alerta, CampoTexto, TipoAlerta, TipoBotao, Combo } from '@intechprev/componentes-web';
import config from '../../config.json';
import { PageAdmin } from ".";

const apiUrl = config.apiUrl

export { 
    Tabelas
}

interface Props {
    match?: any;
}

interface State {
    planos: any,
    plano: any,
    documentos: any,
    pastas: any,
    nomePasta: string
    nomeDocumento: string,
    arquivoUpload: string,
    podeCriarDocumento: boolean
    oidArquivoUpload: number,
    oidPasta: any,
    pastaAtual: string
    pastaPai: string,
    visibilidadeFileInput: boolean,
    uploadPercentage: number,
    uploading: boolean
}

export default class Documentos extends React.Component<Props, State> {

    private page = React.createRef<PageAdmin>();
    private formDocumento = React.createRef<Form>();
    private alertDocumento = React.createRef<Alerta>();
    private formPasta = React.createRef<Form>();
    private alertPasta = React.createRef<Alerta>();

    constructor(props: Props) {
        super(props);

        this.state = {
            planos: [],
            plano: null,
            documentos: [],
            pastas: [],
            nomePasta: "",
            nomeDocumento: "",
            arquivoUpload: "",
            podeCriarDocumento: false,
            oidArquivoUpload: 0,
            oidPasta: props.match.params.pasta,
            pastaAtual: null,
            pastaPai: "",
            visibilidadeFileInput: true,
            uploadPercentage: 0,
            uploading: false
        }
    }

    componentDidMount = async () => {
        await this.buscarLista();
        await this.page.current.loading(false);
    }
    
    UNSAFE_componentWillReceiveProps() {
        window.location.reload();
    }

    buscarLista = async () => {
        var planos = await PlanoService.BuscarTodos();
        var resultado = await DocumentoService.BuscarPorPasta(this.state.oidPasta);

        var pastaPai = "";

        if(resultado.pastaAtual && resultado.pastaAtual.OID_DOCUMENTO_PASTA_PAI)
            pastaPai = resultado.pastaAtual.OID_DOCUMENTO_PASTA_PAI;

        await this.setState({ 
            documentos: resultado.documentos,
            pastas: resultado.pastas,
            pastaAtual: resultado.pastaAtual,
            pastaPai,
            planos
        });
    }

    salvarPasta = async (e: Event) => {
        if(e)
            e.preventDefault();

        await this.alertPasta.current.limparErros();
        await this.formPasta.current.validar();

        if(this.alertPasta.current.state.mensagem.length === 0 && this.alertPasta.current.props.mensagem.length === 0) {
            try {
                await DocumentoService.CriarPasta(this.state.nomePasta, this.state.oidPasta);
                await this.setState({
                    nomePasta: ""
                });
        
                await this.buscarLista();

            } catch(err) {
                console.error(err);
            }
        }
    }

    uploadFile = async (e: any) => {
        try {
            const formData = new FormData()
            var arquivoUpload = e.target.files[0];
    
            formData.append("File", arquivoUpload, arquivoUpload.name);
    
            await this.setState({ uploading: true });

            axios.post(apiUrl + '/upload', formData, {
                headers: {'Content-Type': 'multipart/form-data'},
                onUploadProgress: async progressEvent => {
                    await this.setState({ 
                        uploadPercentage: Math.round(( progressEvent.loaded * 100 ) / progressEvent.total )
                    });
                },
            })
            .then(result => {
                this.setState({
                    podeCriarDocumento: true,
                    oidArquivoUpload: result.data,
                    visibilidadeFileInput: false,
                    uploading: false,
                    uploadPercentage: 0
                });
            })
        } catch(err) { 
            console.error(err);
        }
    }

    salvarDocumento = async (e: any) => {
        if(e)
            e.preventDefault();

        await this.alertDocumento.current.limparErros();
        await this.formDocumento.current.validar();

        if(this.alertDocumento.current.state.mensagem.length === 0 && this.alertDocumento.current.props.mensagem.length === 0) {
            try {
                var oidPasta = this.state.oidPasta;
                if(oidPasta === undefined)
                    oidPasta = ""
                await DocumentoService.Criar(this.state.oidArquivoUpload, this.state.nomeDocumento, "SIM", 1, this.state.plano, oidPasta);
                await this.setState ({
                    nomeDocumento: "",
                    arquivoUpload: "",
                    oidArquivoUpload: 0,
                    visibilidadeFileInput: true,
                    podeCriarDocumento: false
                });
                await this.buscarLista();

            } catch(err) {
                console.error(err);
            }
        }
    }

    render() {
        return (
            <PageAdmin {...this.props} ref={this.page}>

                <Row>
                    <Col tamanho={"lg-5"}>
                        <Box titulo={"UPLOAD DE DOCUMENTOS"}>
                            <Form ref={this.formDocumento}>
                            
                                <CampoTexto contexto={this} nome={"nomeDocumento"} max={50} valor={this.state.nomeDocumento} titulo={"Título"} obrigatorio />
                                
                                <Combo contexto={this} titulo={"Plano"} obrigatorio={false}
                                        nome={"plano"} valor={this.state.plano} textoVazio="Todas(os)"
                                        opcoes={this.state.planos} nomeMembro={"DS_PLANO"} valorMembro={"CD_PLANO"} />
                                        
                                <div className="form-group">

                                    <label htmlFor="selecionar-documento"><b>Arquivo</b></label><br />

                                    {/* {this.state.uploading &&
                                        <div className="progress" style={{ marginBottom: 10 }}>
                                            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: this.state.uploadPercentage + "%"}} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    } */}

                                    {this.state.visibilidadeFileInput && !this.state.uploading &&
                                        <input name="selecionar-documento" id="selecionar-documento" type="file" onChange={this.uploadFile} />
                                    }
                                    
                                    {!this.state.visibilidadeFileInput && !this.state.uploading &&
                                        <div>
                                            <Alerta tipo={TipoAlerta.success} mensagem={"Arquivo enviado com sucesso"} />
                                            <Botao titulo={"Enviar outro arquivo"} tipo={TipoBotao.primary}
                                                    onClick={async () => await this.setState({ visibilidadeFileInput: true, oidArquivoUpload: 0, podeCriarDocumento: false })} />
                                        </div>
                                    }
                                    <hr/>
                                    
                                    <Botao titulo={"Salvar"} tipo={TipoBotao.primary} submit desativado={!this.state.podeCriarDocumento} 
                                            onClick={this.salvarDocumento} />
                                </div>

                                <Alerta ref={this.alertDocumento} padraoFormulario tipo={TipoAlerta.danger} />

                            </Form>
                        </Box>

                        <Box titulo={"CRIAÇÃO DE PASTA"}>
                            <Form ref={this.formPasta}>
                            
                                <CampoTexto contexto={this} nome={"nomePasta"} max={50} valor={this.state.nomePasta} titulo={"Nome"} obrigatorio />
                                <hr/>

                                <div className="form-group">
                                    <Botao className={"btn btn-primary"} titulo={"Salvar"} submit onClick={this.salvarPasta} />
                                </div>

                                <Alerta ref={this.alertPasta} padraoFormulario tipo={TipoAlerta.danger} />

                            </Form>
                        </Box>
                    </Col>

                    <Col>
                        <Box>
                            {this.state.pastaAtual &&
                                <Link className={"btn btn-primary mb-4"} to={`/admin/documentos/${this.state.pastaPai}`}>
                                    <i className={"fa fa-chevron-left mr-2"}></i>
                                    Voltar
                                </Link>
                            }

                            {(this.state.pastas.length > 0 || this.state.documentos.length > 0) &&
                                <div>
                                    <Tabelas {...this.props} itens={this.state.pastas} campoTexto={"NOM_PASTA"} icone={"fa-folder-open text-warning"} tipo={"pasta"} admin={true} />
                                    <Tabelas {...this.props} itens={this.state.documentos} campoTexto={"TXT_TITULO"} icone={"fa-file text-info"} tipo={"documento"} admin={true} />
                                </div>
                            }

                            {this.state.pastas.length === 0 && this.state.documentos.length === 0 &&
                                <div className="alert alert-danger">Nenhum item disponível.</div>
                            }
                        </Box>
                    </Col>
                </Row>

            </PageAdmin>
        );
    }
}