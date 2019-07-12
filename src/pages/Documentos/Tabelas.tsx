import React from 'react';
import { DocumentoService } from "@intechprev/prevsystem-service";
import { Row, Col, Botao } from '@intechprev/componentes-web';
import { Link } from "react-router-dom";

interface Props {
    itens: any,
    tipo: string,
    icone: string,
    campoTexto: string
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
        if(window.confirm('Deseja realmente excluir a pasta e todo seu conteĂºdo?')) {
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
            tempLink.style.display = 'none';
            tempLink.href = blobURL;
            tempLink.setAttribute('download', documento.NOM_ARQUIVO_LOCAL);

            if (typeof tempLink.download === 'undefined') {
                tempLink.setAttribute('target', '_blank');
            }

            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            window.URL.revokeObjectURL(blobURL);

        } catch (err) {
            if(err.response)
                console.error(err.response.data);
            else
                console.error(err);
        }
    }

    render() {
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
                                        <Link className={"btn btn-link"} to={`/documentos/${item.OID_DOCUMENTO_PASTA}`}>{item[this.props.campoTexto]}</Link>
                                    }

                                    {this.props.tipo !== "pasta" &&
                                        <Botao className={"btn btn-link"} onClick={() => this.downloadDocumento(item.OID_DOCUMENTO)} titulo={item[this.props.campoTexto]} />
                                    }
                                </Col>
                                
                                <Col tamanho={"1"}>
                                    <Botao titulo={""} className={"btn btn-sm btn-danger"} icone={"fa fa-trash"}
                                        onClick={async () => {
                                            if(this.props.tipo === "pasta")
                                                await this.deletarPasta(item.OID_DOCUMENTO_PASTA);
                                            else
                                                await this.deletarDocumento(item.OID_DOCUMENTO);
                                        }} />
                                </Col>
                            </Row>
                        );
                    })
                }
            </div>
        );
    }
}