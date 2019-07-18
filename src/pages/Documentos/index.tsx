import React from "react";
import axios from "axios";
import { DocumentoService, PlanoService } from "@intechprev/prevsystem-service";
import { Link, RouteComponentProps } from "react-router-dom";
import Tabelas from './Tabelas';

import { Page } from "..";
import { Row, Col, Box, Form, Botao, Alerta, CampoTexto, TipoAlerta, TipoBotao } from '@intechprev/componentes-web';
import config from '../../config.json';

const apiUrl = config.apiUrl

export { 
    Tabelas
}

interface Props {
    match?: any;
}

interface State {
    planos: any,
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

    private page = React.createRef<Page>();
    private formDocumento = React.createRef<Form>();
    private alertDocumento = React.createRef<Alerta>();
    private formPasta = React.createRef<Form>();
    private alertPasta = React.createRef<Alerta>();

    constructor(props: Props) {
        super(props);

        this.state = {
            planos: [],
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
        var planos = await PlanoService.Buscar();

        await this.setState({
            planos
        });
        
        await this.buscarLista();
        await this.page.current.loading(false);
    }
    
    UNSAFE_componentWillReceiveProps() {
        window.location.reload();
    }

    buscarLista = async () => {
        var resultado = await DocumentoService.BuscarPorPlanoPasta(this.state.planos[0].CD_PLANO, this.state.oidPasta);

        var pastaPai = "";

        if(resultado.pastaAtual && resultado.pastaAtual.OID_DOCUMENTO_PASTA_PAI)
            pastaPai = resultado.pastaAtual.OID_DOCUMENTO_PASTA_PAI;

        await this.setState({ 
            documentos: resultado.documentos,
            pastas: resultado.pastas,
            pastaAtual: resultado.pastaAtual,
            pastaPai
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
        //e.preventDefault();

        await this.alertDocumento.current.limparErros();
        await this.formDocumento.current.validar();

        if(this.alertDocumento.current.state.mensagem.length === 0 && this.alertDocumento.current.props.mensagem.length === 0) {
            try {
                var oidPasta = this.state.oidPasta;
                if(oidPasta === undefined)
                    oidPasta = ""
                await DocumentoService.Criar(this.state.oidArquivoUpload, this.state.nomeDocumento, "SIM", 1, oidPasta);
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
            <Page {...this.props} ref={this.page}>

                <Row>
                    <Col tamanho={"6"}>
                        <Box>
                            {this.state.pastaAtual &&
                                <Link className={"btn btn-primary mb-4"} to={`/documentos/${this.state.pastaPai}`}>
                                    <i className={"fa fa-chevron-left mr-2"}></i>
                                    Voltar
                                </Link>
                            }

                            {(this.state.pastas.length > 0 || this.state.documentos.length > 0) &&
                                <div>
                                    <Tabelas {...this.props} itens={this.state.pastas} campoTexto={"NOM_PASTA"} icone={"fa-folder-open text-warning"} tipo={"pasta"} admin={false} />
                                    <Tabelas {...this.props} itens={this.state.documentos} campoTexto={"TXT_TITULO"} icone={"fa-file text-info"} tipo={"documento"} admin={false} />
                                </div>
                            }

                            {this.state.pastas.length === 0 && this.state.documentos.length === 0 &&
                                <div className="alert alert-danger">Nenhum item disponível.</div>
                            }
                        </Box>
                    </Col>
                </Row>

            </Page>
        );
    }
}