import React from 'react';
import { DocumentoService } from "@intechprev/prevsystem-service";
import { Row, Col, Botao, TipoBotao } from '@intechprev/componentes-web';
import { Link } from "react-router-dom";

interface Props {
    itens: any,
    tipo: string,
    icone: string,
    campoTexto: string,
    admin: boolean
}

export default class Tabelas extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    deletarDocumento = async (oidDocumento: number) => {
        if(window.confirm('Deseja realmente excluir o documento?')) {
            await DocumentoService.Deletar(oidDocumento);
            document.location.reload();
        }
    }

    deletarPasta = async (oidDocumentPasta: number) => {
        if(window.confirm('Deseja realmente excluir a pasta e todo seu conteúdo?')) {
            await DocumentoService.DeletarPasta(oidDocumentPasta);
            document.location.reload();
        }
    }

    downloadDocumento = async (oidDocumento: number) => {
        try {
            var documento = await DocumentoService.BuscarPorOidDocumento(oidDocumento);

            var documentoBlob = await DocumentoService.Download(oidDocumento);

            const blobURL = window.URL.createObjectURL(new Blob([documentoBlob]));
            const tempLink = document.createElement('a');
            tempLink.href = blobURL;
            tempLink.setAttribute('download', documento.NOM_ARQUIVO_LOCAL);
            document.body.appendChild(tempLink);
            tempLink.click();

        } catch (err) {
            if(err.response) {
                alert(err.response.data);
                console.error(err.response.data);
            }
            else {
                console.error(err);
            }
        }
    }

    render() {
        var linkBase = "/documentos";

        if(this.props.admin)
            linkBase = "/admin/documentos";

        return (
            <div>
                {
                    this.props.itens.map((item: any, index: number) => {
                        return (
                            <Row key={index} className={"m-3"}>
                                <Col tamanho={"1"}>
                                    <i className={"fa fa-2x " + this.props.icone}></i>
                                </Col>

                                <Col className={"mt-1"}>
                                    {this.props.tipo === "pasta" &&
                                        <Link className={"btn btn-link"} to={`${linkBase}/${item.OID_DOCUMENTO_PASTA}`}>{item[this.props.campoTexto]}</Link>
                                    }

                                    {this.props.tipo !== "pasta" &&
                                        <Botao tipo={TipoBotao.link} onClick={() => this.downloadDocumento(item.OID_DOCUMENTO)} titulo={item[this.props.campoTexto]} />
                                    }
                                </Col>
                                
                                {this.props.admin &&
                                    <Col tamanho={"1"}>
                                        <Botao titulo={""} className={"btn btn-sm btn-danger"} icone={"fa fa-trash"}
                                            onClick={async () => {
                                                if(this.props.tipo === "pasta")
                                                    await this.deletarPasta(item.OID_DOCUMENTO_PASTA);
                                                else
                                                    await this.deletarDocumento(item.OID_DOCUMENTO);
                                            }} />
                                    </Col>
                                }
                            </Row>
                        );
                    })
                }
            </div>
        );
    }
}